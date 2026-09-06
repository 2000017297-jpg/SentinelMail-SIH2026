import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertTriangle, ScanLine } from 'lucide-react';
import { simpleHash } from '@/lib/hash';

type IngestedFile = {
  name: string;
  size: number;
  type: string;
  hash: string;
  preview: string;
};

type Props = {
  onIngest: (file: IngestedFile) => void;
};

export default function IncidentIngestion({ onIngest }: Props) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<IngestedFile[]>([]);
  const [pasteText, setPasteText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const arr = Array.from(fileList);
      arr.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const text = String(reader.result || '');
          const ingested: IngestedFile = {
            name: file.name,
            size: file.size,
            type: file.type || 'text/plain',
            hash: simpleHash(text + file.name + file.size),
            preview: text.slice(0, 200),
          };
          setFiles((prev) => [ingested, ...prev]);
          onIngest(ingested);
        };
        reader.readAsText(file);
      });
    },
    [onIngest]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return;
    const ingested: IngestedFile = {
      name: `pasted-email-${Date.now()}.txt`,
      size: pasteText.length,
      type: 'text/plain',
      hash: simpleHash(pasteText),
      preview: pasteText.slice(0, 200),
    };
    setFiles((prev) => [ingested, ...prev]);
    onIngest(ingested);
    setPasteText('');
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-cyber-accent glow-text tracking-wider">
          INCIDENT INGESTION
        </h2>
        <p className="text-sm text-cyber-muted mt-1">
          Upload raw email sources, message files, or paste email text for forensic processing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative panel grid-bg clip-corner cursor-pointer transition-all duration-300 min-h-[280px] flex flex-col items-center justify-center p-8 ${
            dragging ? 'border-cyber-accent glow-border scale-[1.01]' : 'hover:border-cyber-accent/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".txt,.eml,.msg,.html,.csv,.json"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {dragging && (
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div className="absolute left-0 right-0 h-px bg-cyber-accent/60 animate-scan" />
            </div>
          )}
          <div className={`w-16 h-16 flex items-center justify-center rounded-full border-2 transition-colors ${dragging ? 'border-cyber-accent bg-cyber-accent/10' : 'border-cyber-border bg-cyber-bg'}`}>
            <Upload className={`w-7 h-7 ${dragging ? 'text-cyber-accent' : 'text-cyber-muted'}`} />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-200">
            {dragging ? 'Release to ingest' : 'Drag & drop email files here'}
          </p>
          <p className="text-xs text-cyber-muted mt-1">or click to browse — .txt, .eml, .msg, .html</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyber-muted">
            <ScanLine className="w-3 h-3" />
            Secure intake channel
          </div>
        </div>

        {/* Paste zone */}
        <div className="panel clip-corner flex flex-col">
          <div className="panel-header">
            <FileText className="w-3.5 h-3.5" />
            Paste Raw Email Text
          </div>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste raw email headers and body here..."
            className="flex-1 bg-cyber-bg text-gray-200 text-xs font-mono p-4 resize-none focus:outline-none focus:ring-1 focus:ring-cyber-accent/40 min-h-[180px] placeholder:text-cyber-muted/60"
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-cyber-border">
            <span className="text-[10px] uppercase tracking-widest text-cyber-muted">
              {pasteText.length} chars
            </span>
            <button
              onClick={handlePasteSubmit}
              disabled={!pasteText.trim()}
              className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider bg-cyber-accent/10 border border-cyber-accent/40 text-cyber-accent rounded hover:bg-cyber-accent/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Ingest Text
            </button>
          </div>
        </div>
      </div>

      {/* Ingested files list */}
      <div className="panel">
        <div className="panel-header">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-success" />
          Ingested Evidence
          <span className="ml-auto text-cyber-accent">{files.length}</span>
        </div>
        {files.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-cyber-muted">
            No evidence ingested yet. Upload or paste email content to begin analysis.
          </div>
        ) : (
          <div className="divide-y divide-cyber-border">
            {files.map((f, idx) => (
              <div key={f.hash} className="flex items-start gap-4 px-4 py-3 hover:bg-cyber-panel2 transition-colors">
                <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyber-bg border border-cyber-border rounded">
                  <FileText className="w-4 h-4 text-cyber-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-200 truncate">{f.name}</p>
                    <span className="text-[10px] text-cyber-muted shrink-0">{(f.size / 1024).toFixed(2)} KB</span>
                  </div>
                  <p className="text-[10px] text-cyber-muted font-mono mt-0.5 truncate">
                    SHA: {f.hash}
                  </p>
                  <p className="text-xs text-cyber-muted mt-1 line-clamp-2 font-mono">{f.preview}...</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-cyber-success">
                    <CheckCircle2 className="w-3 h-3" />
                    Hashed
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 text-cyber-muted hover:text-cyber-danger transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 panel border-cyber-warning/30 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-cyber-warning shrink-0 mt-0.5" />
        <p className="text-xs text-cyber-muted">
          All ingested evidence is immediately hashed and logged to the Chain-of-Custody ledger to maintain
          forensic integrity. Original files are processed in an isolated sandbox environment.
        </p>
      </div>
    </div>
  );
}
