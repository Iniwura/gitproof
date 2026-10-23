import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, GitPullRequest, ShieldCheck, Filter, Plus, CheckCircle2, Lock, Coins, ArrowRight } from 'lucide-react';
import { Bounty, BountyStatus } from '../types';
import { useWallet } from '../context/WalletContext';
import { haptics } from '../lib/haptics';

interface BountyRegistryProps {
  bounties: Bounty[];
}

export function BountyRegistry({ bounties }: BountyRegistryProps) {
  const { isConnected, setShowModal } = useWallet();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLAIMED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = bounties.filter((b) => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : b.status === filter;

    const matchesSearch =
      search === ''
        ? true
        : b.repo_name.toLowerCase().includes(search.toLowerCase()) ||
          b.acceptance_criteria.toLowerCase().includes(search.toLowerCase()) ||
          String(b.issue_number).includes(search) ||
          String(b.id).includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-[#f7f8fa] py-12 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/[0.08] gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#ff6b00] uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Open Bounties</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              Milestone Registry.
            </h1>
            <p className="text-sm font-sans text-[#9499a8] mt-2 max-w-2xl leading-relaxed">
              Explore open milestone escrows secured by GenLayer intelligent contracts. 
              Submit pull requests directly to trigger decentralized AI validator adjudication.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/bounties/new"
              onClick={() => haptics.click()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff8533] text-white font-sans text-xs font-semibold tracking-tight shadow-[0_0_20px_rgba(255,107,0,0.35)] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Lock New Escrow</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c0e14] border border-white/[0.08]">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#5e6475] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search repository, criteria, #id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#06070a] border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-[#5e6475] focus:outline-none focus:border-[#ff6b00]/60 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 font-mono text-xs">
            {(['ALL', 'OPEN', 'CLAIMED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  haptics.tick();
                  setFilter(tab);
                }}
                className={`px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  filter === tab
                    ? 'bg-[#ff6b00] text-white font-bold shadow-sm'
                    : 'bg-white/[0.03] text-[#9499a8] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {tab} ({bounties.filter(b => tab === 'ALL' ? true : b.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Registry Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-[#0c0e14] border border-white/[0.08] rounded-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-[#9499a8]">
              No bounties match current filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((bounty) => (
              <div
                key={bounty.id}
                className="framer-glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                    <span className="font-bold text-[#ff6b00]">#{bounty.id}</span>
                    <span className="text-white font-bold text-sm tracking-tight">{bounty.repo_name}</span>
                    <span className="text-[#5e6475]">Issue #{bounty.issue_number}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        bounty.status === 'OPEN'
                          ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                          : 'bg-white/[0.08] text-[#9499a8]'
                      }`}
                    >
                      {bounty.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-[#cfd3dc] leading-relaxed">
                    {bounty.acceptance_criteria}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] font-mono text-[#5e6475] pt-1">
                    <span>Sponsor: {bounty.sponsor ? `${bounty.sponsor.slice(0, 6)}...${bounty.sponsor.slice(-4)}` : '0x71C8...204B'}</span>
                    <span>·</span>
                    <span className="text-[#10b981]">Byzantine Quorum Verified</span>
                  </div>
                </div>

                {/* Right: Reward & Action */}
                <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.06] gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#9499a8] uppercase block">Bounty Payout</span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-white">
                      {bounty.payout_formatted}
                    </span>
                  </div>

                  <Link
                    to={`/bounties/${bounty.id}`}
                    onClick={() => haptics.click()}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#ff6b00] hover:text-white text-white text-xs font-sans font-semibold transition-all shadow-sm"
                  >
                    <span>View Dossier & Submit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
