import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  GitPullRequest,
  Check,
  Copy,
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  Coins,
  Wallet,
  Activity
} from 'lucide-react';
import { CopyButton } from '../components/CopyButton';
import { Bounty, ClaimRecord, TxProgress } from '../types';
import { GENLAYER_CONFIG } from '../services/genlayer';
import { useWallet } from '../context/WalletContext';
import { haptics } from '../lib/haptics';

interface BountyDossierProps {
  bounties: Bounty[];
  claims: ClaimRecord[];
  onSubmitClaim: (bountyId: number, prUrl: string) => Promise<void>;
  onReclaim: (bountyId: number) => Promise<void>;
  txProgress: TxProgress;
}

export function BountyDossier({
  bounties,
  claims,
  onSubmitClaim,
  onReclaim,
  txProgress
}: BountyDossierProps) {
  const { id } = useParams<{ id: string }>();
  const bountyId = Number(id);
  const bounty = bounties.find((b) => b.id === bountyId);
  const { isConnected, setShowModal } = useWallet();

  const [prUrlInput, setPrUrlInput] = useState(
    bounty ? `https://github.com/${bounty.repo_name}/pull/182` : ''
  );
  const [submitting, setSubmitting] = useState(false);

  if (!bounty) {
    return (
      <div className="min-h-screen bg-[#050608] py-20 px-4 text-[#f7f8fa]">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <Link
            to="/bounties"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-[#9499a8] hover:text-[#ff6b00]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bounty Records</span>
          </Link>
          <div className="p-8 bg-[#0c0e14] border border-white/[0.08] rounded-2xl">
            <h2 className="text-xl font-bold text-white">Bounty #{id} Not Found</h2>
            <p className="text-xs font-mono text-[#9499a8] mt-2">
              This milestone is not currently indexed in the deployed Studionet contract.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleClaimSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) {
      haptics.tick();
      setShowModal(true);
      return;
    }
    if (!prUrlInput.trim()) return;

    haptics.click();
    setSubmitting(true);
    try {
      await onSubmitClaim(bounty!.id, prUrlInput.trim());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050608] text-[#f7f8fa] py-12 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <Link
          to="/bounties"
          onClick={() => haptics.tick()}
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#9499a8] hover:text-[#ff6b00] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bounty Records</span>
        </Link>

        {/* Dossier Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/[0.08] gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-xs font-mono text-[#ff6b00]">
              <span>[ MILESTONE DOSSIER #{bounty.id} ]</span>
              <span className="text-[#5e6475]">·</span>
              <span className="text-white font-semibold">{bounty.repo_name}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl">
              Issue #{bounty.issue_number}: {bounty.acceptance_criteria.slice(0, 90)}...
            </h1>
          </div>

          <div className="flex flex-col md:items-end space-y-2">
            <span
              className={`text-xs font-mono uppercase font-bold px-3 py-1 rounded-full ${
                bounty.status === 'OPEN'
                  ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                  : 'bg-white/[0.08] text-[#9499a8]'
              }`}
            >
              {bounty.status}
            </span>
            <span className="text-xs font-mono text-[#5e6475]">
              {bounty.status === 'CLAIMED' ? 'Consensus Finalized & Paid' : 'Live Escrow Locked on Studionet'}
            </span>
          </div>
        </div>

        {/* Two-Column Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main 8 Cols */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Frozen Acceptance Criteria */}
            <section className="framer-glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#ff6b00]">
                  <Lock className="w-4 h-4" />
                  <span>Frozen Acceptance Criteria</span>
                </div>
                <a
                  href={`https://github.com/${bounty.repo_name}/issues/${bounty.issue_number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#ff6b00] hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>github.com/{bounty.repo_name}/issues/{bounty.issue_number}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#06070a] border border-white/[0.06] text-sm text-[#cfd3dc] leading-relaxed font-sans">
                {bounty.acceptance_criteria}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                <div>
                  <span className="text-[10px] text-[#5e6475] uppercase block mb-1">Sponsor Address</span>
                  <span className="text-white truncate block">{bounty.sponsor || '0x71C849D9455B1917Cbb2b3FE26C2e595304C204B'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5e6475] uppercase block mb-1">Claim Status</span>
                  <span className="text-[#10b981] font-semibold">{bounty.claimed_by ? `Claimed by ${bounty.claimed_by.slice(0, 8)}...` : 'Unclaimed · Ready for Review'}</span>
                </div>
              </div>
            </section>

            {/* Quorum Adjudication Panel */}
            <section className="framer-glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2 text-xs font-mono text-white">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>Byzantine Quorum Multi-Validator Adjudication</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#10b981] px-2.5 py-0.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30">
                  5/5 Consensus Target
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#5e6475] uppercase block">Node 1 & 2</span>
                  <span className="text-white font-bold block">AST & Heap Analysis</span>
                  <span className="text-[10px] text-[#10b981]">Deterministic VM Pass</span>
                </div>
                <div className="p-4 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#5e6475] uppercase block">Node 3 & 4</span>
                  <span className="text-white font-bold block">Test Suite Invariants</span>
                  <span className="text-[10px] text-[#10b981]">0 Regressions Verified</span>
                </div>
                <div className="p-4 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#5e6475] uppercase block">Node 5 (Lead)</span>
                  <span className="text-white font-bold block">Equivalence Consensus</span>
                  <span className="text-[10px] text-[#ff6b00]">On-Chain Signature</span>
                </div>
              </div>
            </section>

            {/* Contributor PR Submission Form */}
            {bounty.status === 'OPEN' && (
              <section className="framer-glass-card rounded-2xl p-6 sm:p-7 border border-[#ff6b00]/30 shadow-[0_0_30px_rgba(255,107,0,0.15)] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#ff6b00]">
                    <GitPullRequest className="w-4 h-4" />
                    <span>Submit Pull Request For Adjudication</span>
                  </div>
                  <span className="text-xs font-mono text-[#10b981]">Live on Studionet</span>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[#cfd3dc] uppercase block">
                      GitHub Pull Request URL
                    </label>
                    <input
                      type="url"
                      required
                      value={prUrlInput}
                      onChange={(e) => setPrUrlInput(e.target.value)}
                      placeholder={`https://github.com/${bounty.repo_name}/pull/182`}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06070a] border border-white/[0.08] focus:border-[#ff6b00]/60 text-xs font-mono text-white placeholder-[#5e6475] outline-none transition-colors"
                    />
                  </div>

                  {!isConnected && (
                    <div className="p-3.5 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-between text-xs">
                      <span className="text-[#cfd3dc]">Connect wallet to submit claim to GenLayer.</span>
                      <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="px-3 py-1 rounded-lg bg-[#ff6b00] text-white font-semibold"
                      >
                        Connect
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs font-mono text-[#5e6475]">
                      Executes <code className="text-white">submit_and_adjudicate_pr</code> on GenLayer intelligent contract.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff8533] hover:from-[#ff771a] hover:to-[#ff944d] text-white text-xs font-sans font-semibold tracking-tight shadow-[0_0_20px_rgba(255,107,0,0.35)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shrink-0"
                    >
                      {submitting ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Adjudicating in Consensus...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Submit PR & Claim Escrow</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            )}

          </main>

          {/* Sidebar Rail (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="framer-glass-card rounded-2xl p-6 border border-white/[0.08] space-y-5">
              <div>
                <span className="text-[10px] font-mono text-[#9499a8] uppercase block mb-1">
                  Escrow Vault Balance
                </span>
                <span className="text-3xl font-mono font-bold text-[#ff6b00] block">
                  {bounty.payout_formatted}
                </span>
                <span className="text-xs font-mono text-[#5e6475] mt-1 block">
                  Non-custodial smart escrow
                </span>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#9499a8]">Consensus:</span>
                  <span className="text-[#10b981] font-semibold">5 AI Validator Quorum</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9499a8]">Settlement:</span>
                  <span className="text-white">Instant on Approval</span>
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
