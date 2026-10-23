import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GitPullRequest,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Coins,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { haptics } from '../lib/haptics';

export function Hero({
  totalLockedFormatted,
  bountyCount,
}: {
  totalLockedFormatted: string;
  bountyCount: number;
}) {
  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background Subtle Grid & Ambient Glow */}
      <div className="framer-bg-grid" />
      <div className="framer-ambient-glow" />

      <div className="max-w-[1280px] mx-auto relative z-10 space-y-12">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#9499a8]">
            <span className="w-2 h-2 rounded-full bg-[#ff6b00]" />
            <span className="text-white font-medium">Autonomous GitHub Escrow</span>
            <span className="text-[#5e6475]">·</span>
            <span>Zero Human Arbiters</span>
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.96] text-white">
            Fund code milestones.
            <span className="block bg-gradient-to-r from-[#ff6b00] via-[#ff8833] to-[#ffa35c] bg-clip-text text-transparent">
              Settled by AI consensus.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#9499a8] leading-relaxed max-w-2xl mx-auto font-normal">
            Lock bounties for GitHub issues in non-custodial smart contracts. 
            When developers submit code, decentralized AI validators verify pull requests and disburse payouts directly to their wallets.
          </p>

          {/* Clean 2-Button Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/bounties"
              onClick={() => haptics.click()}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff8533] text-white font-sans text-sm font-semibold tracking-tight shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Bounties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/bounties/new"
              onClick={() => haptics.click()}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] text-white text-sm font-medium tracking-tight backdrop-blur-md transition-all"
            >
              <span>+ Create Bounty</span>
            </Link>
          </div>
        </div>

        {/* Product Preview Cards (Clean, authentic UI preview instead of fake diff terminal) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          
          {/* Card 1: Completed & Paid Bounty */}
          <div className="framer-glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="font-bold text-[#ff6b00]">#1</span>
                <span className="text-white font-semibold">genlayer/simulator</span>
                <span className="text-[#5e6475]">#104</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified & Paid</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#cfd3dc] leading-relaxed">
              Fix memory leak in validator WebSocket stream under sustained load. Automated tests verified heap stabilization across 10k rounds.
            </p>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-[#10b981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>5/5 Quorum Consensus</span>
              </div>
              <span className="font-bold text-white text-sm">0.2500 GEN</span>
            </div>
          </div>

          {/* Card 2: Open Bounty */}
          <div className="framer-glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="font-bold text-[#ff6b00]">#2</span>
                <span className="text-white font-semibold">genlayer/genlayer-js</span>
                <span className="text-[#5e6475]">#88</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Open Escrow</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#cfd3dc] leading-relaxed">
              Implement real-time WebSocket subscription client for Equivalence Principle validator round states with reconnect backoff.
            </p>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-[#9499a8]">Ready for Pull Request</span>
              <span className="font-bold text-[#ff6b00] text-sm">0.4000 GEN</span>
            </div>
          </div>

        </div>

        {/* Clean 3-Metric Protocol Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
          <div className="p-5 rounded-2xl bg-[#0a0c10] border border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-[#9499a8] uppercase block mb-1">Total Escrow Locked</span>
            <span className="text-2xl font-mono font-bold text-[#ff6b00]">{totalLockedFormatted}</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0c10] border border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-[#9499a8] uppercase block mb-1">Active Deliverables</span>
            <span className="text-2xl font-mono font-bold text-white">{bountyCount} Milestones</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0c10] border border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-[#9499a8] uppercase block mb-1">Settlement Speed</span>
            <span className="text-2xl font-mono font-bold text-[#10b981]">Instant on Merge</span>
          </div>
        </div>

      </div>
    </section>
  );
}
