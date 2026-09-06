import { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Mail,
  Clock,
  Server,
  Gauge,
  ChevronDown,
} from 'lucide-react';
import type { Incident } from '@/lib/mockData';

type Props = {
  incidents: Incident[];
};

function AuthBadge({ label, status }: { label: string; status: 'pass' | 'fail' | 'neutral' }) {
  const config = {
    pass: { icon: ShieldCheck, color: 'text-cyber-success', border: 'border-cyber-success/40', bg: 'bg-cyber-success/10', text: 'PASS' },
    fail: { icon: ShieldX, color: 'text-cyber-danger', border: 'border-cyber-danger/40', bg: 'bg-cyber-danger/10', text: 'FAIL' },
    neutral: { icon: ShieldAlert, color: 'text-cyber-warning', border: 'border-cyber-warning/40', bg: 'bg-cyber-warning/10', text: 'NEUTRAL' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded border ${c.border} ${c.bg}`}>
      <Icon className={`w-4 h-4 ${c.color}`} />
      <div>
        <p className="text-[10px] uppercase tracking-widest text-cyber-muted">{label}</p>
        <p className={`text-sm font-bold ${c.color}`}>{c.text}</p>
      </div>
    </div>
  );
}

function ThreatGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#ff2e63' : score >= 50 ? '#ffb800' : '#00ff9f';
  const label = score >= 80 ? 'CRITICAL' : score >= 50 ? 'ELEVATED' : 'LOW';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1b2738" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-cyber-muted">{label}</span>
      </div>
    </div>
  );
}

export default function ForensicDeepDive({ incidents }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [headerOpen, setHeaderOpen] = useState<string | null>(null);
  const incident = incidents[selectedIdx];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-cyber-accent glow-text tracking-wider">
          FORENSIC DEEP-DIVE
        </h2>
        <p className="text-sm text-cyber-muted mt-1">
          Multi-layered analysis of email headers, authentication protocols, and threat sentiment.
        </p>
      </div>

      {/* Incident selector */}
      <div className="panel">
        <div className="panel-header">
          <Search className="w-3.5 h-3.5" />
          Select Incident
        </div>
        <div className="flex flex-wrap gap-2 p-3">
          {incidents.map((inc, idx) => (
            <button
              key={inc.id}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-2 rounded border text-xs transition-all ${
                idx === selectedIdx
                  ? 'border-cyber-accent/50 bg-cyber-accent/10 text-cyber-accent'
                  : 'border-cyber-border bg-cyber-bg text-cyber-muted hover:text-gray-200 hover:border-cyber-muted'
              }`}
            >
              <span className="font-mono">{inc.id}</span>
              <span className="mx-1.5 text-cyber-border">|</span>
              <span className="truncate max-w-[200px] inline-block align-bottom">{inc.subject}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Metadata + Threat Score */}
        <div className="lg:col-span-3 space-y-4">
          <div className="panel">
            <div className="panel-header">
              <Mail className="w-3.5 h-3.5" />
              Incident Metadata
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Incident ID</p>
                <p className="text-sm text-cyber-accent font-mono">{incident.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Subject</p>
                <p className="text-sm text-gray-200">{incident.subject}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Sender</p>
                <p className="text-sm text-gray-200 font-mono break-all">{incident.sender}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyber-muted" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Received</p>
                  <p className="text-xs text-gray-200">{incident.receivedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-cyber-muted" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Source IP</p>
                  <p className="text-xs text-gray-200 font-mono">{incident.sourceIp}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <Gauge className="w-3.5 h-3.5" />
              Threat Score
            </div>
            <div className="p-4 flex flex-col items-center">
              <ThreatGauge score={incident.threatScore} />
            </div>
          </div>
        </div>

        {/* Middle: Auth Badges + Header Parsing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="panel">
            <div className="panel-header">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authentication Protocols
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              <AuthBadge label="SPF" status={incident.spf} />
              <AuthBadge label="DKIM" status={incident.dkim} />
              <AuthBadge label="DMARC" status={incident.dmarc} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <Server className="w-3.5 h-3.5" />
              Header Parsing Metrics
            </div>
            <div className="divide-y divide-cyber-border">
              {incident.headers.map((h) => {
                const isOpen = headerOpen === h.key;
                return (
                  <div key={h.key}>
                    <button
                      onClick={() => setHeaderOpen(isOpen ? null : h.key)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-cyber-panel2 transition-colors text-left"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-cyber-muted shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                      />
                      <span className="text-xs font-medium text-cyber-accent shrink-0 w-32">{h.key}</span>
                      <span className="text-xs text-cyber-muted truncate font-mono">{h.value}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pl-10">
                        <p className="text-xs text-gray-300 font-mono break-all bg-cyber-bg p-2 rounded border border-cyber-border">
                          {h.value}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Sentiment Breakdown */}
        <div className="lg:col-span-4">
          <div className="panel h-full">
            <div className="panel-header">
              <Gauge className="w-3.5 h-3.5" />
              Malicious Sentiment Breakdown
            </div>
            <div className="p-4 space-y-4">
              {incident.sentiment.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-200">{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: s.color }}>
                      {s.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${s.score}%`,
                        background: s.color,
                        boxShadow: `0 0 8px ${s.color}80`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-cyber-border">
                <p className="text-[10px] uppercase tracking-widest text-cyber-muted mb-2">Verdict</p>
                <p
                  className={`text-sm font-bold ${
                    incident.threatScore >= 80
                      ? 'text-cyber-danger'
                      : incident.threatScore >= 50
                      ? 'text-cyber-warning'
                      : 'text-cyber-success'
                  }`}
                >
                  {incident.threatScore >= 80
                    ? 'MALICIOUS — Immediate quarantine recommended'
                    : incident.threatScore >= 50
                    ? 'SUSPICIOUS — Manual review required'
                    : 'BENIGN — No action needed'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
