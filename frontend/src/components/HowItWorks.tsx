import React from 'react';
import { Lock, GitPullRequest, Zap } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Lock Escrow',
    description: 'Back any GitHub milestone with native GEN tokens. Funds are held in a non-custodial smart contract vault.',
    icon: Lock,
    accent: '#ff6b00',
  },
  {
    step: '02',
    title: 'Build & Submit PR',
    description: 'Developers implement the feature or fix, open a pull request on GitHub, and submit the link for review.',
    icon: GitPullRequest,
    accent: '#06b6d4',
  },
  {
    step: '03',
    title: 'Autonomous Payout',
    description: 'GenLayer AI validators evaluate acceptance criteria in consensus. Once approved, the vault unlocks and pays out.',
    icon: Zap,
    accent: '#10b981',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1280px] mx-auto border-t border-white/[0.08]">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          How GitProof works.
        </h2>
        <p className="text-sm sm:text-base text-[#9499a8]">
          Three simple steps to trustless open-source software bounties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="framer-glass-card rounded-2xl p-7 border border-white/[0.08] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#5e6475]">{s.step}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.accent}20`, color: s.accent }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">{s.title}</h3>
              <p className="text-sm text-[#9499a8] leading-relaxed">{s.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
