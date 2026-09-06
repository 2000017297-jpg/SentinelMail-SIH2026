import { useState, useMemo } from 'react';
import Sidebar, { type ViewId } from '@/components/Sidebar';
import IncidentIngestion from '@/components/IncidentIngestion';
import ForensicDeepDive from '@/components/ForensicDeepDive';
import GeoThreatMap from '@/components/GeoThreatMap';
import ChainOfCustody from '@/components/ChainOfCustody';
import { mockIncidents, buildCustodyLedger } from '@/lib/mockData';

function App() {
  const [view, setView] = useState<ViewId>('ingestion');

  const custodyRecords = useMemo(() => buildCustodyLedger(), []);
  const geoThreats = useMemo(() => mockIncidents.map((i) => i.geo), []);

  return (
    <div className="min-h-screen bg-cyber-bg text-gray-200 flex">
      <Sidebar active={view} onChange={setView} incidentCount={mockIncidents.length} />

      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-cyber-panel/90 backdrop-blur border-b border-cyber-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyber-muted">
            <span className="text-cyber-accent">/</span>
            {view === 'ingestion' && 'Incident Ingestion'}
            {view === 'deepdive' && 'Forensic Deep-Dive'}
            {view === 'geomap' && 'Geo-Threat Map'}
            {view === 'custody' && 'Chain-of-Custody Ledger'}
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-cyber-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-cyber-success rounded-full animate-pulse" />
              Secure Connection
            </span>
            <span>UTC 2026-09-06</span>
            <span className="text-cyber-accent font-mono">analyst@soc</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-[1600px]">
          {view === 'ingestion' && <IncidentIngestion onIngest={() => {}} />}
          {view === 'deepdive' && <ForensicDeepDive incidents={mockIncidents} />}
          {view === 'geomap' && <GeoThreatMap threats={geoThreats} />}
          {view === 'custody' && <ChainOfCustody records={custodyRecords} />}
        </div>
      </main>
    </div>
  );
}

export default App;
