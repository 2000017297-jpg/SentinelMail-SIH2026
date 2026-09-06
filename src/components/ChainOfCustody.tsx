import { Fragment, useState } from 'react';
import { FileLock, Link2, Hash, CheckCircle2, Search } from 'lucide-react';
import type { CustodyRecord } from '@/lib/mockData';

type Props = {
  records: CustodyRecord[];
};

export default function ChainOfCustody({ records }: Props) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = records.filter(
    (r) =>
      r.evidence.toLowerCase().includes(query.toLowerCase()) ||
      r.action.toLowerCase().includes(query.toLowerCase()) ||
      r.actor.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase())
  );

  const allValid = records.every((r, i) =>
    i === 0 ? r.prevHash === '0'.repeat(48) : r.prevHash === records[i - 1].hash
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-cyber-accent glow-text tracking-wider">
            CHAIN-OF-CUSTODY LEDGER
          </h2>
          <p className="text-sm text-cyber-muted mt-1">
            Immutable, hash-chained audit trail of all forensic actions performed on ingested evidence.
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded border ${allValid ? 'border-cyber-success/40 bg-cyber-success/10' : 'border-cyber-danger/40 bg-cyber-danger/10'}`}>
          <CheckCircle2 className={`w-4 h-4 ${allValid ? 'text-cyber-success' : 'text-cyber-danger'}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${allValid ? 'text-cyber-success' : 'text-cyber-danger'}`}>
            {allValid ? 'Chain Verified' : 'Chain Broken'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: records.length, icon: FileLock, color: 'text-cyber-accent' },
          { label: 'Chain Links', value: records.length - 1, icon: Link2, color: 'text-cyber-accent2' },
          { label: 'Unique Hashes', value: new Set(records.map((r) => r.hash)).size, icon: Hash, color: 'text-cyber-success' },
          { label: 'Integrity', value: '100%', icon: CheckCircle2, color: 'text-cyber-success' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[10px] uppercase tracking-widest text-cyber-muted">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="panel">
        <div className="panel-header">
          <Search className="w-3.5 h-3.5" />
          Audit Records
          <div className="ml-auto relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by evidence, action, actor..."
              className="pl-8 pr-3 py-1.5 text-xs bg-cyber-bg border border-cyber-border rounded text-gray-200 placeholder:text-cyber-muted/60 focus:outline-none focus:border-cyber-accent/40 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-cyber-muted uppercase tracking-widest text-[10px]">
                <th className="px-4 py-3 text-left font-medium">Record ID</th>
                <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Actor</th>
                <th className="px-4 py-3 text-left font-medium">Evidence</th>
                <th className="px-4 py-3 text-left font-medium">Hash</th>
                <th className="px-4 py-3 text-left font-medium">Prev Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border">
              {filtered.map((r) => {
                const isOpen = expanded === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className="hover:bg-cyber-panel2 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-cyber-accent">{r.id}</td>
                      <td className="px-4 py-3 text-cyber-muted whitespace-nowrap">{r.timestamp}</td>
                      <td className="px-4 py-3 text-gray-200">{r.action}</td>
                      <td className="px-4 py-3 text-gray-200 font-mono">{r.actor}</td>
                      <td className="px-4 py-3 text-cyber-accent2 font-mono">{r.evidence}</td>
                      <td className="px-4 py-3 font-mono text-cyber-success truncate max-w-[160px]">{r.hash.slice(0, 16)}...</td>
                      <td className="px-4 py-3 font-mono text-cyber-muted truncate max-w-[160px]">{r.prevHash.slice(0, 16)}...</td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-cyber-bg">
                        <td colSpan={7} className="px-8 py-4">
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-cyber-muted mb-1">Full Hash</p>
                              <p className="text-xs font-mono text-cyber-success break-all">{r.hash}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-cyber-muted mb-1">Previous Hash</p>
                              <p className="text-xs font-mono text-cyber-muted break-all">{r.prevHash}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-success" />
                              <span className="text-[10px] uppercase tracking-widest text-cyber-success">
                                Hash chain link verified
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-cyber-muted">
              No records match your filter.
            </div>
          )}
        </div>
      </div>

      {/* Chain visualization */}
      <div className="panel">
        <div className="panel-header">
          <Link2 className="w-3.5 h-3.5" />
          Hash Chain Visualization
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {records.map((r, i) => (
              <div key={r.id} className="flex items-center gap-1">
                <div
                  className="w-12 h-12 rounded border border-cyber-success/40 bg-cyber-success/10 flex items-center justify-center shrink-0"
                  title={`${r.id}: ${r.hash.slice(0, 8)}`}
                >
                  <Hash className="w-4 h-4 text-cyber-success" />
                </div>
                {i < records.length - 1 && (
                  <div className="w-6 h-px bg-cyber-success/40 relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-t border-cyber-success/60 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
