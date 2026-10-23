import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Shield, Sparkles, Coins, Lock, Wallet } from 'lucide-react';
import { GENLAYER_CONFIG } from '../services/genlayer';
import { useWallet } from '../context/WalletContext';
import { haptics } from '../lib/haptics';

interface CreateBountyWizardProps {
  onCreateBounty: (params: {
    repoName: string;
    issueNumber: number;
    acceptanceCriteria: string;
    expiryEpoch: number;
    depositGen: string;
  }) => Promise<void>;
}

const TEMPLATES = [
  {
    label: 'Bug Fix - Memory Leak',
    repo: 'genlayer/genlayer-simulator',
    issue: 104,
    criteria: 'Fix memory leak in validator WebSocket stream under sustained load. Must include automated reproduction test verifying heap stabilization across 10,000 simulated rounds.',
    deposit: '0.25'
  },
  {
    label: 'Feature - WebSocket Client',
    repo: 'genlayer/genlayer-js',
    issue: 88,
    criteria: 'Implement real-time WebSocket subscription client for Equivalence Principle validator round states. Include reconnect backoff and heartbeats.',
    deposit: '0.40'
  },
  {
    label: 'Refactor - Async Consensus Pool',
    repo: 'genlayer/consensus-engine',
    issue: 212,
    criteria: 'Refactor synchronous validator polling into non-blocking asyncio task pool. Measure throughput improvement and ensure 0 race conditions in state transition.',
    deposit: '0.50'
  }
];

export function CreateBountyWizard({ onCreateBounty }: CreateBountyWizardProps) {
  const navigate = useNavigate();
  const { isConnected, address, setShowModal } = useWallet();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [repoName, setRepoName] = useState('genlayer/genlayer-simulator');
  const [issueNumber, setIssueNumber] = useState(104);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    'Fix memory leak in validator WebSocket stream under sustained load. Must include automated reproduction test verifying heap stabilization.'
  );
  const [depositGen, setDepositGen] = useState('0.25');

  function applyTemplate(tpl: typeof TEMPLATES[0]) {
    haptics.tick();
    setRepoName(tpl.repo);
    setIssueNumber(tpl.issue);
    setAcceptanceCriteria(tpl.criteria);
    setDepositGen(tpl.deposit);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) {
      haptics.tick();
      setShowModal(true);
      return;
    }

    haptics.click();
    setSubmitting(true);
    try {
      await onCreateBounty({
        repoName,
        issueNumber: Number(issueNumber),
        acceptanceCriteria,
        expiryEpoch: 100, // standard default validity
        depositGen
      });
      navigate('/bounties');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050608] text-[#f7f8fa] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <Link
          to="/bounties"
          onClick={() => haptics.tick()}
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#9499a8] hover:text-[#ff6b00] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bounty Records</span>
        </Link>

        {/* Header */}
        <div className="pb-6 border-b border-white/[0.08] space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#ff6b00] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>INTELLIGENT CONTRACT ESCROW CREATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Fund New Milestone Bounty.
          </h1>
          <p className="text-sm font-sans text-[#9499a8] leading-relaxed">
            Lock native GEN tokens into the GitProof intelligent contract. Define clear acceptance criteria that GenLayer AI validators will use to adjudicate pull requests.
          </p>
        </div>

        {/* Quick Presets / Templates */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-[#9499a8] uppercase tracking-wider block">
            Quick Template Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="p-3.5 rounded-xl bg-[#0c0e14] border border-white/[0.06] hover:border-[#ff6b00]/50 hover:bg-white/[0.03] text-left transition-all group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-[#ff8833] transition-colors">
                  {tpl.label}
                </div>
                <div className="text-[11px] font-mono text-[#ff6b00] mt-1 font-bold">
                  {tpl.deposit} GEN
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Creation Form */}
        <form onSubmit={handleSubmit} className="framer-glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-6">
          
          {/* Repository Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-mono text-[#cfd3dc] uppercase block">
                GitHub Repository (owner/repo)
              </label>
              <input
                type="text"
                required
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="e.g. genlayer/simulator"
                className="w-full px-4 py-2.5 rounded-xl bg-[#06070a] border border-white/[0.08] focus:border-[#ff6b00]/60 text-xs font-mono text-white placeholder-[#5e6475] outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#cfd3dc] uppercase block">
                Issue Number
              </label>
              <input
                type="number"
                required
                min="1"
                value={issueNumber}
                onChange={(e) => setIssueNumber(Number(e.target.value))}
                placeholder="104"
                className="w-full px-4 py-2.5 rounded-xl bg-[#06070a] border border-white/[0.08] focus:border-[#ff6b00]/60 text-xs font-mono text-white placeholder-[#5e6475] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#cfd3dc] uppercase block">
                Frozen Acceptance Criteria
              </label>
              <span className="text-[11px] font-mono text-[#ff6b00]">Evaluated by 5 AI Validators</span>
            </div>
            <textarea
              required
              rows={4}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Explicit, verifiable technical specifications the PR must meet (e.g., zero memory leaks, test coverage > 90%)..."
              className="w-full p-4 rounded-xl bg-[#06070a] border border-white/[0.08] focus:border-[#ff6b00]/60 text-xs font-mono text-white placeholder-[#5e6475] outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* Escrow Deposit in GEN */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#cfd3dc] uppercase block">
              Escrow Bounty Amount (GEN)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={depositGen}
                onChange={(e) => setDepositGen(e.target.value)}
                placeholder="0.25"
                className="w-full pl-4 pr-16 py-2.5 rounded-xl bg-[#06070a] border border-white/[0.08] focus:border-[#ff6b00]/60 text-sm font-mono font-bold text-white placeholder-[#5e6475] outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#ff6b00]">
                GEN
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#5e6475] block">
              Non-custodial smart escrow vault
            </span>
          </div>

          {/* Wallet State Alert if Disconnected */}
          {!isConnected && (
            <div className="p-4 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Wallet not connected</span>
                <span className="text-[11px] text-[#cfd3dc]">Connect your MetaMask or GenLayer Studionet key to sign transaction.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6b00] hover:bg-[#ff7d1a] text-white font-sans text-xs font-semibold shrink-0"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff8533] hover:from-[#ff771a] hover:to-[#ff944d] text-white font-sans text-sm font-semibold tracking-tight shadow-[0_0_25px_rgba(255,107,0,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4 stroke-[2.2]" />
            <span>{submitting ? 'Broadcasting Escrow to Studionet...' : `Lock ${depositGen} GEN Escrow Bounty`}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
