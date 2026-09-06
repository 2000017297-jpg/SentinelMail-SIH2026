import { useState } from 'react';
import { Globe, Crosshair, MapPin, Activity, AlertOctagon } from 'lucide-react';
import type { GeoThreat } from '@/lib/mockData';

type Props = {
  threats: GeoThreat[];
};

const severityConfig = {
  critical: { color: '#ff2e63', label: 'CRITICAL', ring: 'animate-ping-slow' },
  high: { color: '#ffb800', label: 'HIGH', ring: '' },
  medium: { color: '#00b4ff', label: 'MEDIUM', ring: '' },
  low: { color: '#00ff9f', label: 'LOW', ring: '' },
};

export default function GeoThreatMap({ threats }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = threats.find((t) => t.id === hovered) || threats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-cyber-accent glow-text tracking-wider">
          GEO-THREAT MAP
        </h2>
        <p className="text-sm text-cyber-muted mt-1">
          Geographic visualization of source IP addresses for incoming threat vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map */}
        <div className="lg:col-span-8">
          <div className="panel relative overflow-hidden">
            <div className="panel-header">
              <Globe className="w-3.5 h-3.5" />
              Global Threat Distribution
              <span className="ml-auto flex items-center gap-1.5 text-cyber-success">
                <Activity className="w-3 h-3" />
                Live
              </span>
            </div>
            <div className="relative grid-bg bg-cyber-bg" style={{ aspectRatio: '2 / 1' }}>
              {/* World map silhouette using SVG paths (simplified continents) */}
              <svg
                viewBox="0 0 200 100"
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.15 }}
              >
                {/* North America */}
                <path
                  d="M15,25 Q25,18 40,20 L55,22 Q60,30 55,40 L45,48 Q35,50 25,45 L18,35 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
                {/* South America */}
                <path
                  d="M45,55 Q50,52 55,55 L58,65 Q55,75 50,80 L45,75 Q42,65 45,55 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
                {/* Europe */}
                <path
                  d="M48,25 Q55,22 62,25 L65,32 Q62,38 55,38 L50,35 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
                {/* Africa */}
                <path
                  d="M50,40 Q58,38 65,42 L68,55 Q65,65 58,68 L52,60 Q48,50 50,40 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
                {/* Asia */}
                <path
                  d="M65,22 Q80,18 95,22 L105,30 Q100,38 85,40 L70,35 Q62,30 65,22 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
                {/* Australia */}
                <path
                  d="M85,65 Q92,62 98,65 L100,72 Q95,75 88,73 Z"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Crosshair overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="w-8 h-8 text-cyber-accent/10" />
              </div>

              {/* Threat markers */}
              {threats.map((t) => {
                const cfg = severityConfig[t.severity];
                const isActive = active?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onMouseEnter={() => setHovered(t.id)}
                    onClick={() => setHovered(t.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  >
                    {/* Pulse ring */}
                    <span
                      className="absolute inset-0 rounded-full animate-ping-slow"
                      style={{
                        width: isActive ? 28 : 18,
                        height: isActive ? 28 : 18,
                        left: isActive ? -14 : -9,
                        top: isActive ? -14 : -9,
                        border: `1px solid ${cfg.color}`,
                        opacity: 0.6,
                      }}
                    />
                    {/* Core dot */}
                    <span
                      className="block rounded-full transition-all"
                      style={{
                        width: isActive ? 12 : 8,
                        height: isActive ? 12 : 8,
                        background: cfg.color,
                        boxShadow: `0 0 12px ${cfg.color}, 0 0 4px ${cfg.color}`,
                      }}
                    />
                  </button>
                );
              })}

              {/* Scan line */}
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/30 to-transparent animate-scan pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Side panel: threat details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="panel">
            <div className="panel-header">
              <MapPin className="w-3.5 h-3.5" />
              Source Details
            </div>
            {active && (
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">IP Address</p>
                  <p className="text-sm text-cyber-accent font-mono">{active.ip}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Location</p>
                  <p className="text-sm text-gray-200">{active.city}, {active.country}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Latitude</p>
                    <p className="text-xs text-gray-200 font-mono">{active.lat.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Longitude</p>
                    <p className="text-xs text-gray-200 font-mono">{active.lon.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Severity</p>
                  <div className="flex items-center gap-2 mt-1">
                    <AlertOctagon
                      className="w-4 h-4"
                      style={{ color: severityConfig[active.severity].color }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: severityConfig[active.severity].color }}
                    >
                      {severityConfig[active.severity].label}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <Globe className="w-3.5 h-3.5" />
              All Threat Sources
            </div>
            <div className="divide-y divide-cyber-border">
              {threats.map((t) => {
                const cfg = severityConfig[t.severity];
                const isActive = active?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onMouseEnter={() => setHovered(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                      isActive ? 'bg-cyber-panel2' : 'hover:bg-cyber-panel2'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-200 font-mono">{t.ip}</p>
                      <p className="text-[10px] text-cyber-muted">{t.city}, {t.country}</p>
                    </div>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold shrink-0"
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
