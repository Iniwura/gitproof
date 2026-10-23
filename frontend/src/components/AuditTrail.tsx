import React from 'react';
import { ExternalLink, Activity, RefreshCw } from 'lucide-react';
import { SectionMarker, StatusBadge } from './Editorial';
import { ClaimRecord } from '../types';

export function AuditTrail({
  claims,
  onRefresh
}: {
  claims: ClaimRecord[];
  onRefresh: () => void;
}) {
  return (
    <section id="audits" className="border-b border-[#1e2436] bg-[#0c0e14] py-20">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionMarker number="04" label="Consensus Proof" />
            <h2 className="text-3xl sm:text-5xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
              Validator Audit Trail
            </h2>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 border border-[#1e2436] hover:border-[#ff5500] bg-[#131722] text-[#8a8f9d] hover:text-[#e8e6df] transition-colors"
            title="Refresh on-chain claims"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="border border-[#1e2436] bg-[#090b10] overflow-x-auto">
          {claims.length === 0 ? (
            <div className="text-center py-16 text-xs font-mono uppercase tracking-widest text-[#8a8f9d]">
              <Activity className="w-6 h-6 mx-auto mb-2 text-[#ff5500] opacity-60" />
              <p>No claims evaluated yet on current deployment.</p>
              <p className="text-[10px] mt-1 text-[#8a8f9d]/60">Submit a PR to see live validator quorum audit records appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1e2436] text-[10px] uppercase tracking-wider text-[#8a8f9d] bg-[#131722]/50">
                  <th className="p-4 font-bold">Claim ID</th>
                  <th className="p-4 font-bold">Bounty</th>
                  <th className="p-4 font-bold">Contributor</th>
                  <th className="p-4 font-bold">PR Diff</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Confidence</th>
                  <th className="p-4 font-bold">Epoch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2436]">
                {claims.map(c => (
                  <tr key={c.claim_id} className="hover:bg-[#131722]/30 transition-colors">
                    <td className="p-4 font-bold text-[#ff5500]">#{c.claim_id}</td>
                    <td className="p-4 text-[#e8e6df]">#{c.bounty_id}</td>
                    <td className="p-4 text-[#8a8f9d]">{c.contributor.slice(0, 6)}...{c.contributor.slice(-4)}</td>
                    <td className="p-4">
                      <a
                        href={c.pr_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ff5500] hover:underline flex items-center space-x-1"
                      >
                        <span>GitHub Diff</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 font-bold text-[#00ff88]">{c.confidence_score}%</td>
                    <td className="p-4 text-[#8a8f9d]">Epoch #{c.evaluated_epoch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
