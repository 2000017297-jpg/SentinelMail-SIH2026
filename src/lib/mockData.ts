import { simpleHash } from './hash';

export type EmailHeader = {
  key: string;
  value: string;
};

export type SentimentCategory = {
  label: string;
  score: number;
  color: string;
};

export type GeoThreat = {
  id: string;
  ip: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  x: number;
  y: number;
};

export type CustodyRecord = {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  evidence: string;
  hash: string;
  prevHash: string;
};

export type Incident = {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  sourceIp: string;
  spf: 'pass' | 'fail' | 'neutral';
  dkim: 'pass' | 'fail' | 'neutral';
  dmarc: 'pass' | 'fail' | 'neutral';
  threatScore: number;
  headers: EmailHeader[];
  sentiment: SentimentCategory[];
  geo: GeoThreat;
};

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-0941',
    subject: 'Urgent: Account Verification Required Within 24 Hours',
    sender: 'security@arnazon-billing.com',
    receivedAt: '2026-09-06T08:14:22Z',
    sourceIp: '185.220.101.47',
    spf: 'fail',
    dkim: 'fail',
    dmarc: 'fail',
    threatScore: 94,
    headers: [
      { key: 'From', value: 'security@arnazon-billing.com' },
      { key: 'Reply-To', value: 'noreply@secure-verify.xyz' },
      { key: 'Return-Path', value: 'bounce@tor-exit-node.ru' },
      { key: 'Received (1)', value: 'from mx-relay.tor-exit.net (185.220.101.47) by mail.victim.com' },
      { key: 'Received (2)', value: 'from localhost (127.0.0.1) by mx-relay.tor-exit.net with HTTP' },
      { key: 'X-Originating-IP', value: '185.220.101.47' },
      { key: 'Message-ID', value: '<a8f2c1@tor-exit-node.ru>' },
      { key: 'X-Mailer', value: 'PHPMailer 5.2.4 (spoofed)' },
      { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
      { key: 'X-Priority', value: '1 (Highest)' },
    ],
    sentiment: [
      { label: 'Urgency / Pressure', score: 88, color: '#ff2e63' },
      { label: 'Impersonation', score: 95, color: '#ff2e63' },
      { label: 'Deceptive Links', score: 91, color: '#ffb800' },
      { label: 'Credential Harvesting', score: 97, color: '#ff2e63' },
      { label: 'Legitimate Tone', score: 4, color: '#00ff9f' },
    ],
    geo: {
      id: 'g1',
      ip: '185.220.101.47',
      city: 'Amsterdam',
      country: 'Netherlands',
      lat: 52.37,
      lon: 4.90,
      severity: 'critical',
      x: 51,
      y: 32,
    },
  },
  {
    id: 'INC-2026-0938',
    subject: 'Invoice #4471 - Overdue Payment Notice',
    sender: 'billing@duhlbert-financial.net',
    receivedAt: '2026-09-06T03:41:10Z',
    sourceIp: '45.133.1.99',
    spf: 'fail',
    dkim: 'pass',
    dmarc: 'fail',
    threatScore: 78,
    headers: [
      { key: 'From', value: 'billing@duhlbert-financial.net' },
      { key: 'Reply-To', value: 'payments@duhlbert-financial.net' },
      { key: 'Return-Path', value: 'bounce@bulk-sender-hosting.com' },
      { key: 'Received (1)', value: 'from bulk-sender-hosting.com (45.133.1.99) by mail.victim.com' },
      { key: 'X-Originating-IP', value: '45.133.1.99' },
      { key: 'Message-ID', value: '<9c2e1f@bulk-sender-hosting.com>' },
      { key: 'X-Mailer', value: 'Microsoft Outlook 16.0' },
      { key: 'Content-Type', value: 'multipart/mixed; boundary="---boundary"' },
    ],
    sentiment: [
      { label: 'Urgency / Pressure', score: 72, color: '#ffb800' },
      { label: 'Impersonation', score: 80, color: '#ff2e63' },
      { label: 'Deceptive Links', score: 65, color: '#ffb800' },
      { label: 'Credential Harvesting', score: 58, color: '#ffb800' },
      { label: 'Legitimate Tone', score: 22, color: '#00ff9f' },
    ],
    geo: {
      id: 'g2',
      ip: '45.133.1.99',
      city: 'Bucharest',
      country: 'Romania',
      lat: 44.43,
      lon: 26.10,
      severity: 'high',
      x: 55,
      y: 38,
    },
  },
  {
    id: 'INC-2026-0935',
    subject: 'Your package delivery has been rescheduled',
    sender: 'no-reply@post-track-notify.com',
    receivedAt: '2026-09-05T22:09:47Z',
    sourceIp: '203.0.113.55',
    spf: 'neutral',
    dkim: 'fail',
    dmarc: 'fail',
    threatScore: 61,
    headers: [
      { key: 'From', value: 'no-reply@post-track-notify.com' },
      { key: 'Reply-To', value: 'auto@post-track-notify.com' },
      { key: 'Return-Path', value: 'bounce@cloud-mail-relay.io' },
      { key: 'Received (1)', value: 'from cloud-mail-relay.io (203.0.113.55) by mail.victim.com' },
      { key: 'X-Originating-IP', value: '203.0.113.55' },
      { key: 'Message-ID', value: '<3f7a9b@cloud-mail-relay.io>' },
      { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
    ],
    sentiment: [
      { label: 'Urgency / Pressure', score: 45, color: '#ffb800' },
      { label: 'Impersonation', score: 62, color: '#ffb800' },
      { label: 'Deceptive Links', score: 70, color: '#ffb800' },
      { label: 'Credential Harvesting', score: 48, color: '#ffb800' },
      { label: 'Legitimate Tone', score: 38, color: '#00ff9f' },
    ],
    geo: {
      id: 'g3',
      ip: '203.0.113.55',
      city: 'Lagos',
      country: 'Nigeria',
      lat: 6.52,
      lon: 3.38,
      severity: 'medium',
      x: 49,
      y: 58,
    },
  },
  {
    id: 'INC-2026-0930',
    subject: 'Re: Q3 Financial Report - Confidential',
    sender: 'ceo@legitimate-corp.com',
    receivedAt: '2026-09-05T14:22:03Z',
    sourceIp: '192.0.2.10',
    spf: 'pass',
    dkim: 'pass',
    dmarc: 'pass',
    threatScore: 12,
    headers: [
      { key: 'From', value: 'ceo@legitimate-corp.com' },
      { key: 'Reply-To', value: 'ceo@legitimate-corp.com' },
      { key: 'Return-Path', value: 'ceo@legitimate-corp.com' },
      { key: 'Received (1)', value: 'from mail.legitimate-corp.com (192.0.2.10) by mail.victim.com' },
      { key: 'X-Originating-IP', value: '192.0.2.10' },
      { key: 'Message-ID', value: '<7a3c9d@mail.legitimate-corp.com>' },
      { key: 'X-Mailer', value: 'Apple Mail 2.4031' },
      { key: 'Content-Type', value: 'text/plain; charset=UTF-8' },
    ],
    sentiment: [
      { label: 'Urgency / Pressure', score: 8, color: '#00ff9f' },
      { label: 'Impersonation', score: 2, color: '#00ff9f' },
      { label: 'Deceptive Links', score: 0, color: '#00ff9f' },
      { label: 'Credential Harvesting', score: 0, color: '#00ff9f' },
      { label: 'Legitimate Tone', score: 92, color: '#00ff9f' },
    ],
    geo: {
      id: 'g4',
      ip: '192.0.2.10',
      city: 'San Francisco',
      country: 'United States',
      lat: 37.77,
      lon: -122.41,
      severity: 'low',
      x: 16,
      y: 40,
    },
  },
];

export function buildCustodyLedger(): CustodyRecord[] {
  const actions: { action: string; actor: string; evidence: string; ts: string }[] = [
    { action: 'Ingested', actor: 'auto-collector', evidence: 'INC-2026-0941', ts: '2026-09-06T08:14:30Z' },
    { action: 'Quarantined', actor: 'analyst@soc', evidence: 'INC-2026-0941', ts: '2026-09-06T08:15:12Z' },
    { action: 'Header Extracted', actor: 'forensic-engine', evidence: 'INC-2026-0941', ts: '2026-09-06T08:16:44Z' },
    { action: 'IP Geo-Located', actor: 'geo-module', evidence: 'INC-2026-0941', ts: '2026-09-06T08:17:01Z' },
    { action: 'Sentiment Analyzed', actor: 'forensic-engine', evidence: 'INC-2026-0941', ts: '2026-09-06T08:17:33Z' },
    { action: 'Ingested', actor: 'auto-collector', evidence: 'INC-2026-0938', ts: '2026-09-06T03:41:18Z' },
    { action: 'Quarantined', actor: 'analyst@soc', evidence: 'INC-2026-0938', ts: '2026-09-06T03:42:05Z' },
    { action: 'Ingested', actor: 'auto-collector', evidence: 'INC-2026-0935', ts: '2026-09-05T22:09:55Z' },
    { action: 'Reviewed', actor: 'analyst@soc', evidence: 'INC-2026-0935', ts: '2026-09-05T22:30:11Z' },
    { action: 'Ingested', actor: 'auto-collector', evidence: 'INC-2026-0930', ts: '2026-09-05T14:22:10Z' },
    { action: 'Cleared', actor: 'analyst@soc', evidence: 'INC-2026-0930', ts: '2026-09-05T14:45:22Z' },
  ];

  let prevHash = '0'.repeat(48);
  return actions.map((a, i) => {
    const content = `${a.ts}|${a.action}|${a.actor}|${a.evidence}|${prevHash}|${i}`;
    const hash = simpleHash(content);
    const record: CustodyRecord = {
      id: `CUST-${String(i + 1).padStart(4, '0')}`,
      timestamp: a.ts,
      action: a.action,
      actor: a.actor,
      evidence: a.evidence,
      hash,
      prevHash,
    };
    prevHash = hash;
    return record;
  });
}
