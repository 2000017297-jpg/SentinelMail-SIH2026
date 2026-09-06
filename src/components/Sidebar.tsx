import { Upload, Search, Globe, FileLock, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

export type ViewId = 'ingestion' | 'deepdive' | 'geomap' | 'custody';

type NavItem = {
  id: ViewId;
  label: string;
  icon: typeof Upload;
  desc: string;
};

const navItems: NavItem[] = [
  { id: 'ingestion', label: 'Incident Ingestion', icon: Upload, desc: 'Import raw evidence' },
  { id: 'deepdive', label: 'Forensic Deep-Dive', icon: Search, desc: 'Header & sentiment analysis' },
  { id: 'geomap', label: 'Geo-Threat Map', icon: Globe, desc: 'Source IP geolocation' },
  { id: 'custody', label: 'Chain-of-Custody', icon: FileLock, desc: 'Hashed audit ledger' },
];

type Props = {
  active: ViewId;
  onChange: (v: ViewId) => void;
  incidentCount: number;
};

export default function Sidebar({ active, onChange, incidentCount }: Props) {
  return (
    <aside className="w-64 shrink-0 bg-cyber-panel border-r border-cyber-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-cyber-bg border border-cyber-accent/40 rounded glow-border">
            <ShieldCheck className="w-5 h-5 text-cyber-accent" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-success rounded-full animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold text-cyber-accent glow-text tracking-wider leading-tight">
              CYBERFORENSICS
            </h1>
            <p className="text-[10px] text-cyber-muted tracking-widest uppercase">Dashboard v2.6</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 pb-2 text-[10px] uppercase tracking-widest text-cyber-muted">Modules</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent glow-border'
                  : 'border border-transparent text-cyber-muted hover:bg-cyber-panel2 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyber-accent' : 'text-cyber-muted group-hover:text-gray-300'}`} />
              <div className="flex-1 text-left">
                <p className="text-xs font-medium leading-tight">{item.label}</p>
                <p className="text-[10px] text-cyber-muted leading-tight mt-0.5">{item.desc}</p>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyber-accent" />}
            </button>
          );
        })}
      </nav>

      {/* Status footer */}
      <div className="px-4 py-4 border-t border-cyber-border space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cyber-muted">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyber-success" />
            System Status
          </span>
          <span className="text-cyber-success">ONLINE</span>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cyber-muted">
          <span>Incidents Tracked</span>
          <span className="text-cyber-accent font-bold">{String(incidentCount).padStart(3, '0')}</span>
        </div>
      </div>
    </aside>
  );
}
