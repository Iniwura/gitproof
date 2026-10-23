import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Cpu, 
  ShieldCheck, 
  Coins, 
  Terminal, 
  ArrowRight, 
  Sparkles,
  Check,
  Lock,
  Unlock,
  FileCode
} from 'lucide-react';
import { haptics } from '../lib/haptics';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Milestone Escrow Created',
    actor: 'Project Sponsor',
    icon: Lock,
    accent: '#ff6b00',
    summary: 'Sponsor funds milestone with criteria',
    detail: 'Sponsor locks 0.25 to 5.0 GEN in the GitProof smart contract. Acceptance criteria and repository coordinates are permanently immutabilized on-chain.'
  },
  {
    step: '02',
    title: 'Pull Request Submitted',
    actor: 'Open Source Contributor',
    icon: GitPullRequest,
    accent: '#06b6d4',
    summary: 'Contributor links GitHub PR',
    detail: 'Developer implements the milestone feature or bugfix and opens a GitHub PR. They trigger GitProof adjudication by providing the PR hash.'
  },
  {
    step: '03',
    title: 'GenVM Webhook Ingestion',
    actor: 'Intelligent Contract',
    icon: Terminal,
    accent: '#8b5cf6',
    summary: 'Direct REST API fetch via gl.get_web_data()',
    detail: 'The GenLayer intelligent contract queries the GitHub API directly. Multi-validator cross-verification ensures data integrity without centralized oracle middleware.'
  },
  {
    step: '04',
    title: 'Byzantine AI Quorum',
    actor: '5 Decentralized Validators',
    icon: Cpu,
    accent: '#ec4899',
    summary: 'Equivalence Principle consensus',
    detail: '5 independent nodes evaluate diff against frozen criteria. Even if one node fails or hallucinates, Byzantine tolerance ensures deterministic agreement.'
  },
  {
    step: '05',
    title: 'Autonomous Settlement',
    actor: 'Smart Vault Contract',
    icon: Unlock,
    accent: '#10b981',
    summary: 'Funds released directly to dev',
    detail: 'Upon reaching quorum threshold, the escrow vault unlocks automatically. The contributor receives native GEN tokens in their connected wallet.'
  }
];

export function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="py-24 px-4 sm:px-6 max-w-[1400px] mx-auto border-t border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#06b6d4] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROTOCOL DATAFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            How GitProof settles code.
          </h2>
          <p className="text-[#9499a8] text-base sm:text-lg mt-2 max-w-xl leading-relaxed">
            The end-to-end cryptographic and consensus pipeline bridging Web2 GitHub repositories with Web3 GenLayer execution.
          </p>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          {PIPELINE_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                haptics.tick();
                setActiveStep(idx);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeStep === idx
                  ? 'bg-white/[0.1] text-white border border-white/[0.2] font-bold shadow-md'
                  : 'text-[#5e6475] hover:text-[#9499a8] bg-white/[0.02]'
              }`}
            >
              {s.step}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {PIPELINE_STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <div
              key={s.step}
              onClick={() => {
                haptics.tick();
                setActiveStep(idx);
              }}
              className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                isActive
                  ? 'bg-[#0f1117] border-white/[0.2] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transform -translate-y-1'
                  : 'bg-[#080a0f] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#0c0e14]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#5e6475]">{s.step}</span>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: `${s.accent}20`, color: s.accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white tracking-tight">{s.title}</h4>
                <p className="text-xs text-[#9499a8] line-clamp-2 leading-relaxed">{s.summary}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.04] text-[10px] font-mono text-[#5e6475]">
                {s.actor}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Banner */}
      <div className="framer-glass-card rounded-2xl p-7 border border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#ff6b00] font-bold">PHASE {PIPELINE_STEPS[activeStep].step}</span>
            <span className="text-[#5e6475]">·</span>
            <span className="text-white font-semibold">{PIPELINE_STEPS[activeStep].title}</span>
          </div>
          <p className="text-sm sm:text-base text-[#cfd3dc] leading-relaxed">
            {PIPELINE_STEPS[activeStep].detail}
          </p>
        </div>

        <button
          onClick={() => {
            haptics.tick();
            setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs font-mono transition-all shrink-0"
        >
          <span>Next Phase</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
