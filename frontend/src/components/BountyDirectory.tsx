import React, { useState } from 'react';
import { Search, Github, ArrowRight, ExternalLink } from 'lucide-react';
import { SectionMarker, StatusBadge } from './Editorial';
import { Bounty } from '../types';

export function BountyDirectory({
  bounties,
  currentEpoch,
  onSubmitPrClick,
  onRefundClick
}: {
  bounties: Bounty[];
  currentEpoch: number;
  onSubmitPrClick: (bounty: Bounty) => void;
  onRefundClick: (bountyId: number) => void;
}) {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLAIMED' | 'REFUNDED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = bounties.filter(b => {
    const matchStatus = filter === 'ALL' ? true : b.status === filter;
    const matchSearch =
      search === ''
        ? true
        : b.repo_name.toLowerCase().includes(search.toLowerCase()) ||
          b.acceptance_criteria.toLowerCase().includes(search.toLowerCase()) ||
          String(b.issue_number).includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <section id="bounties" className="border-b border-black/[0.1] bg-[#fafafa] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <SectionMarker number="03" label="On-Chain Registry" />
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#090a0f]">
              Protocol Bounty Explorer
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 md:mt-0">
            {/* Filter Buttons */}
            <div className="flex items-center border border-black/[0.1] bg-white divide-x divide-black/[0.1]">
              {(['ALL', 'OPEN', 'CLAIMED', 'REFUNDED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                    filter === st
                      ? 'bg-[#090a0f] text-white font-bold'
                      : 'text-[#64748b] hover:text-[#090a0f]'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH REPO OR ISSUE..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-8 pr-3 py-1.5 border border-black/[0.1] bg-white font-mono text-xs uppercase tracking-wider focus:outline-hidden focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Tabular Rows */}
        <div className="border-t border-black/[0.1]">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono uppercase tracking-widest text-[#64748b]">
              No bounties match current filters.
            </div>
          ) : (
            filtered.map(b => (
              <div
                key={b.id}
                className="py-6 border-b border-black/[0.1] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-black/[0.01] transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#ff4f10]">
                      #{b.issue_number}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#090a0f] flex items-center space-x-1.5">
                      <Github className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>{b.repo_name}</span>
                    </span>
                    <StatusBadge status={b.status} />
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed max-w-3xl">
                    {b.acceptance_criteria}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#64748b]">
                    <span>Sponsor: {b.sponsor.slice(0, 6)}...{b.sponsor.slice(-4)}</span>
                    <span>•</span>
                    <span>Created Epoch #{b.created_epoch}</span>
                    <span>•</span>
                    <span className={currentEpoch >= b.expiry_epoch ? 'text-[#ef4444] font-bold' : ''}>
                      Expires Epoch #{b.expiry_epoch}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 min-w-[170px] pt-4 md:pt-0 border-t md:border-t-0 border-black/[0.06]">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">Escrow Reward</span>
                    <span className="text-xl font-bold font-mono text-[#ff4f10]">{b.payout_formatted}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {b.status === 'OPEN' && (
                      <button
                        onClick={() => onSubmitPrClick(b)}
                        className="px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider bg-[#090a0f] hover:bg-[#222] text-white flex items-center space-x-1.5 transition"
                      >
                        <span>Submit PR</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#ff4f10]" />
                      </button>
                    )}

                    {b.status === 'OPEN' && currentEpoch >= b.expiry_epoch && (
                      <button
                        onClick={() => onRefundClick(b.id)}
                        className="px-3 py-2 font-mono text-xs uppercase tracking-wider border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 transition"
                      >
                        Refund
                      </button>
                    )}

                    {b.status === 'CLAIMED' && b.accepted_pr_url && (
                      <a
                        href={b.accepted_pr_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-black/[0.1] hover:border-black text-[#64748b] flex items-center space-x-1.5 transition"
                      >
                        <span>Inspect PR</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
