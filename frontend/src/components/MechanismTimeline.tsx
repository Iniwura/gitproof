import React from 'react';
import { SectionMarker } from './Editorial';

export function MechanismTimeline() {
  const steps = [
    {
      number: '01',
      phase: 'Phase · Deposit',
      title: 'Lock Escrow & Define Criteria',
      description:
        'Sponsors specify the target GitHub repository, issue number, and unambiguous natural-language acceptance criteria. The full bounty prize in GEN tokens is locked into the non-custodial smart contract vault.',
      invariant: 'On-chain Invariant: Funds are immutable and cannot be revoked before the expiration epoch.'
    },
    {
      number: '02',
      phase: 'Phase · Contribution',
      title: 'Contributor Pull Request',
      description:
        'Developers globally work on the issue, commit changes, and submit their open pull request URL to the intelligent contract to initiate autonomous evaluation.',
      invariant: 'Zero Tampering: Validators fetch the public git diff directly over HTTP without intermediary tampering.'
    },
    {
      number: '03',
      phase: 'Phase · Adjudication',
      title: 'Multi-Validator LLM Quorum',
      description:
        'Independent GenLayer validator nodes fetch the raw git patch, execute comparative LLM prompts in GenVM against the frozen acceptance criteria, and vote in consensus.',
      invariant: 'Strict Equivalence: Payout requires majority agreement across validator outputs.'
    },
    {
      number: '04',
      phase: 'Phase · Settlement',
      title: 'Deterministic Release or Refund',
      description:
        'Upon majority agreement, the intelligent contract autonomously transfers the full escrow reward to the contributor wallet. If the bounty expires unfulfilled, the sponsor reclaims 100% of the deposit.',
      invariant: 'Zero Dispute: Final settlement executes trustlessly on-chain. Zero Net-90 delays.'
    }
  ];

  return (
    <section id="mechanism" className="border-b border-[#1e2436] bg-[#0c0e14] py-20">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-14">
          <div>
            <SectionMarker number="02" label="Protocol Pipeline" />
            <h2 className="text-3xl sm:text-5xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
              The Mechanism Timeline
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8a8f9d] mt-3 md:mt-0 uppercase tracking-wider">
            Linear, deterministic progression from creation to escrow settlement
          </span>
        </div>

        {/* 12-Column Tabular Grid Rows */}
        <div className="border-t border-[#1e2436]">
          {steps.map(step => (
            <div
              key={step.number}
              className="grid grid-cols-1 lg:grid-cols-12 py-10 border-b border-[#1e2436] gap-6 lg:gap-12 items-baseline hover:bg-[#131722]/30 transition-colors"
            >
              {/* Step & Phase */}
              <div className="lg:col-span-3 flex items-center space-x-4">
                <span className="font-display text-4xl text-[#ff5500]">{step.number}</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8a8f9d]">
                  {step.phase}
                </span>
              </div>

              {/* Title */}
              <div className="lg:col-span-4">
                <h3 className="font-display text-2xl font-normal uppercase tracking-wider text-[#e8e6df]">
                  {step.title}
                </h3>
              </div>

              {/* Description & Invariant */}
              <div className="lg:col-span-5 space-y-3">
                <p className="text-sm font-sans text-[#8a8f9d] leading-relaxed">
                  {step.description}
                </p>
                <div className="font-mono text-[11px] text-[#8a8f9d] flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#00ff88]" />
                  <span>{step.invariant}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
