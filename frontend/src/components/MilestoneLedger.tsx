import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpRight,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Code2
} from 'lucide-react';
import { Bounty, BountyStatus } from '../types';
import { haptics } from '../lib/haptics';

interface MilestoneLedgerProps {
  bounties: Bounty[];
}

export function MilestoneLedger({ bounties }: MilestoneLedgerProps) {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLAIMED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedBountyId, setSelectedBountyId] = useState<number | null>(bounties[0]?.id || 1);

  const filteredBounties = bounties.filter((b) => {
    if (filter === 'OPEN' && b.status !== 'OPEN') return false;
    if (filter === 'CLAIMED' && b.status !== 'CLAIMED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.repo_name.toLowerCase().includes(q) ||
        b.acceptance_criteria.toLowerCase().includes(q) ||
        String(b.issue_number).includes(q) ||
        String(b.id).includes(q)
      );
    }
    return true;
  });

  const selectedBounty = bounties.find((b) => b.id === selectedBountyId) || bounties[0];

  const handleSelect = (id: number) => {
    haptics.tick();
    setSelectedBountyId(id);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-white/[0.08]">
      {/* Linear Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-wider uppercase text-[#ff6b00] mb-2">
            <span>Live Milestones</span>
          </div>
          <h2 className="font-sans font-semibold text-2xl sm:text-4xl tracking-[-0.038em] text-[#f7f8f8]">
            Active Milestone Bounties
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-1 max-w-xl leading-relaxed font-normal">
            Programmatically escrowed developer incentives. Inspect live GitHub milestone criteria and submit pull requests for automated consensus release.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#62666d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search repo, criteria, #id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0f1011] border border-white/[0.08] focus:border-[#ff6b00]/60 text-xs font-mono text-[#f7f8f8] placeholder:text-[#62666d] outline-none transition-all w-52 sm:w-60 shadow-inner"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-[#0f1011] border border-white/[0.08] text-xs font-mono">
            {(['ALL', 'OPEN', 'CLAIMED'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  haptics.tick();
                  setFilter(mode);
                }}
                className={`px-3 py-1 rounded-md text-[11px] transition-all ${
                  filter === mode
                    ? 'bg-[#161718] text-[#f7f8f8] font-semibold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                    : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                }`}
              >
                {mode} ({bounties.filter((b) => (mode === 'ALL' ? true : b.status === mode)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Density Ledger Workspace */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0f1011] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
        {/* Left Column: Dense Bounty Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#08090a]">
          <div className="divide-y divide-white/[0.08]">
            {filteredBounties.length > 0 ? (
              filteredBounties.map((bounty) => {
                const isSelected = bounty.id === selectedBountyId;
                return (
                  <div
                    key={bounty.id}
                    onClick={() => handleSelect(bounty.id)}
                    className={`p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#121414] border-l-2 border-[#ff6b00]'
                        : 'hover:bg-[#0f1011] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center space-x-2.5 text-xs font-mono">
                        <span className="font-bold text-[#ff6b00]">#{bounty.id}</span>
                        <span className="text-[#8a8f98] font-semibold">{bounty.repo_name}</span>
                        <span className="text-[#62666d]">#{bounty.issue_number}</span>
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                            bounty.status === 'OPEN'
                              ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                              : 'bg-white/[0.06] text-[#8a8f98]'
                          }`}
                        >
                          {bounty.status}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-[#cfd3dc] line-clamp-2 leading-relaxed">
                        {bounty.acceptance_criteria}
                      </p>

                      <div className="flex items-center space-x-4 text-[11px] font-mono text-[#62666d] pt-0.5">
                        <span className="text-[#10b981]">● Active</span>
                        <span>·</span>
                        <span className="text-[#8a8f98]">AI Consensus Verified</span>
                      </div>
                    </div>

                    {/* Escrow Reward Block */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 border-t sm:border-t-0 border-white/[0.08] pt-2 sm:pt-0">
                      <span className="text-[10px] font-mono text-[#8a8f98] uppercase">Escrow Vault</span>
                      <span className="font-mono text-base font-bold text-[#f7f8f8]">
                        {bounty.payout_formatted}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-xs font-mono text-[#8a8f98]">
                No bounties match current filters.
              </div>
            )}
          </div>

          <div className="p-3 bg-[#0f1011] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#8a8f98]">
            <span>Showing {filteredBounties.length} active milestone vaults</span>
            <Link
              to="/bounties/new"
              onClick={() => haptics.click()}
              className="text-[#ff6b00] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>+ Create Milestone</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Active Bounty Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-[#121414] p-5 flex flex-col justify-between">
          {selectedBounty ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider mb-1">
                  <span>SPECIFICATION INSPECTOR</span>
                  <span className="text-[#ff6b00] font-bold">BOUNTY #{selectedBounty.id}</span>
                </div>
                <h3 className="font-sans font-semibold text-lg text-[#f7f8f8] tracking-tight">
                  {selectedBounty.repo_name}
                </h3>
                <span className="text-xs font-mono text-[#8a8f98]">GitHub Issue Milestone #{selectedBounty.issue_number}</span>
              </div>

              {/* Frozen Criteria Block */}
              <div className="p-3.5 rounded-xl bg-[#0f1011] border border-white/[0.06] space-y-1.5 shadow-inner">
                <span className="text-[10px] font-mono text-[#ff6b00] uppercase tracking-wider block font-semibold">
                  Frozen Acceptance Criteria
                </span>
                <p className="font-mono text-xs text-[#cfd3dc] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedBounty.acceptance_criteria}
                </p>
              </div>

              {/* Smart Contract Parameters */}
              <div className="space-y-2 text-xs font-mono text-[#8a8f98] border-t border-white/[0.08] pt-3">
                <div className="flex items-center justify-between">
                  <span>Vault Balance:</span>
                  <strong className="text-[#ff6b00] font-bold text-sm">{selectedBounty.payout_formatted}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sponsor Key:</span>
                  <span className="text-[#f7f8f8] truncate max-w-[150px]">
                    {selectedBounty.sponsor ? `${selectedBounty.sponsor.slice(0, 8)}...${selectedBounty.sponsor.slice(-6)}` : '0x71C849...204B'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Consensus Mode:</span>
                  <span className="text-[#10b981] font-semibold">Equivalence AST Quorum</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/bounties/${selectedBounty.id}`}
                onClick={() => haptics.click()}
                className="w-full py-2.5 rounded-lg bg-[#ff6b00] hover:bg-[#ff8533] text-white font-sans text-xs font-semibold tracking-tight transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
              >
                <span>Inspect Full Dossier & Submit PR</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#8a8f98]">
              Select a milestone from the ledger.
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#8e92a8]">
            <span>Consensus</span>
            <span className="text-[#10b981] font-bold">5/5 AI Validators</span>
          </div>
        </div>
      </div>
    </section>
  );
}
