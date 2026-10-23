import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Layers,
  Code2,
  Workflow
} from 'lucide-react';
import { haptics } from '../lib/haptics';

export function BentoShowcase() {
  const [quorumNodes, setQuorumNodes] = useState<number>(5);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Byzantine Fault Tolerance: f = floor((n - 1) / 3)
  const maxFaults = Math.floor((quorumNodes - 1) / 3);
  const requiredVotes = quorumNodes - maxFaults;

  const handleCopyCode = () => {
    haptics.tick();
    navigator.clipboard.writeText(`consensus = gl.ai_consensus_review(pr_diff, criteria, quorum=5)`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-white/[0.08]">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#ff6b00]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GENLAYER ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Engineered for zero human trust.
        </h2>
        <p className="text-[#9499a8] text-base sm:text-lg leading-relaxed">
          Traditional web3 bounties require centralized multisig committees or centralized arbiters. 
          GitProof runs natively on GenLayer to achieve mathematically verifiable autonomous milestone execution.
        </p>
      </div>

      {/* Asymmetric Framer Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Equivalence Principle Engine (Span 7) */}
        <div className="lg:col-span-7 framer-glass-card rounded-2xl p-7 flex flex-col justify-between overflow-hidden relative group">
          <div className="space-y-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">The Equivalence Principle in Motion</h3>
              <p className="text-sm text-[#9499a8] mt-1 leading-relaxed">
                GenLayer transforms non-deterministic AI evaluations into deterministic blockchain state by requiring a Byzantine quorum of independent validator nodes.
              </p>
            </div>

            {/* Interactive Quorum Tolerance Simulator */}
            <div className="p-5 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9499a8]">Validator Quorum Size:</span>
                <span className="text-[#ff6b00] font-bold text-sm">{quorumNodes} Nodes</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="3"
                max="9"
                step="2"
                value={quorumNodes}
                onChange={(e) => {
                  haptics.tick();
                  setQuorumNodes(Number(e.target.value));
                }}
                className="w-full accent-[#ff6b00] cursor-pointer"
              />

              {/* Real-time Math Invariants */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#5e6475] block text-[10px] uppercase">Byzantine Fault Tolerance ($f$)</span>
                  <span className="text-white font-bold text-base mt-0.5 block">Up to {maxFaults} Faulty Node{maxFaults > 1 ? 's' : ''}</span>
                  <span className="text-[10px] text-[#9499a8]">Formula: $\lfloor(N-1)/3\rfloor$</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#5e6475] block text-[10px] uppercase">Required Equivalence Quorum</span>
                  <span className="text-[#10b981] font-bold text-base mt-0.5 block">{requiredVotes} of {quorumNodes} Votes</span>
                  <span className="text-[10px] text-[#9499a8]">Strict deterministic consensus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9499a8]">
            <span>Studionet 61997 Consensus Rule</span>
            <span className="text-[#ff6b00]">Zero Hallucination Risk</span>
          </div>
        </div>

        {/* Card 2: Zero-Trust GitHub Webhooks (Span 5) */}
        <div className="lg:col-span-5 framer-glass-card rounded-2xl p-7 flex flex-col justify-between overflow-hidden relative">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Zero-Trust GitHub Webhook Read</h3>
              <p className="text-sm text-[#9499a8] mt-1 leading-relaxed">
                Smart contracts fetch pull request diffs directly from the public GitHub REST API using GenVM's native <code className="text-white bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">gl.get_web_data()</code>.
              </p>
            </div>

            {/* Visual Oracle Gateway Box */}
            <div className="p-4 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#9499a8]">
                <span>ORACLE PIPELINE</span>
                <span className="text-[#10b981]">DIRECT HTTPS</span>
              </div>
              <div className="flex items-center space-x-2 text-white p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] truncate">
                <span className="text-[#06b6d4]">GET</span>
                <span className="truncate">api.github.com/repos/.../pulls/104</span>
              </div>
              <div className="text-[10px] text-[#5e6475] leading-relaxed">
                ✓ Non-deterministic HTTP read handled via multi-validator cross-verification. No third-party API key needed.
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9499a8]">
            <span>Oracle Dependency</span>
            <span className="text-[#06b6d4] font-semibold">0% (Native GenVM)</span>
          </div>
        </div>

        {/* Card 3: Pure Python GenVM Contracts (Span 5) */}
        <div className="lg:col-span-5 framer-glass-card rounded-2xl p-7 flex flex-col justify-between overflow-hidden relative">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Pure Python Intelligent Contracts</h3>
              <p className="text-sm text-[#9499a8] mt-1 leading-relaxed">
                No esoteric Solidity tricks. Contracts are authored in standard Python 3. Access LLMs and natural language criteria directly in contract methods.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.08] font-mono text-xs relative">
              <pre className="text-[11px] text-[#cfd3dc] overflow-x-auto leading-relaxed">
{`@gl.public.write
def verify_milestone(self, pr_num: int):
    diff = gl.get_web_data(...)
    res = gl.ai_consensus_review(
        diff, self.criteria, quorum=5
    )
    if res.approved:
        gl.transfer(res.author, self.escrow)`}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[10px] text-[#9499a8] hover:text-white transition-colors"
              >
                {copiedCode ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9499a8]">
            <span>Language</span>
            <span className="text-[#8b5cf6] font-semibold">Python 3 (GenVM)</span>
          </div>
        </div>

        {/* Card 4: Non-Custodial Liquidity Vault (Span 7) */}
        <div className="lg:col-span-7 framer-glass-card rounded-2xl p-7 flex flex-col justify-between overflow-hidden relative">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Guaranteed Contributor Payouts</h3>
              <p className="text-sm text-[#9499a8] mt-1 leading-relaxed">
                Escrow funds cannot be clawed back or renegotiated after work begins. When your PR passes GenLayer consensus, the native tokens transfer directly to your wallet in the same transaction block.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06]">
                <span className="text-[#5e6475] block text-[10px] uppercase">Sponsor Protection</span>
                <span className="text-white font-bold block mt-1">Automatic Refund</span>
                <span className="text-[10px] text-[#9499a8]">If milestone reaches expiry epoch</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06]">
                <span className="text-[#5e6475] block text-[10px] uppercase">Dev Protection</span>
                <span className="text-[#10b981] font-bold block mt-1">Locked Vault</span>
                <span className="text-[10px] text-[#9499a8]">Cannot be frozen by sponsor</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06]">
                <span className="text-[#5e6475] block text-[10px] uppercase">Settlement Speed</span>
                <span className="text-[#ff6b00] font-bold block mt-1">1 Consensus Round</span>
                <span className="text-[10px] text-[#9499a8]">Sub-second finality</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9499a8]">
            <span>Security Model</span>
            <span className="text-[#10b981] font-semibold">100% Non-Custodial</span>
          </div>
        </div>

      </div>
    </section>
  );
}
