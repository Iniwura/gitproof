import React from 'react';
import { SectionMarker } from './Editorial';

export function FaqSection() {
  const faqs = [
    {
      q: 'How does GenLayer evaluate code without human arbitrators?',
      a: 'GenLayer uses the Equivalence Principle. When a pull request URL is submitted, independent validator nodes independently fetch the raw git diff from GitHub, run it through their GenVM LLM execution environment with the sponsor\'s acceptance criteria, and reach consensus on whether the criteria were met.'
    },
    {
      q: 'Can a sponsor withdraw their bounty escrow before expiry?',
      a: 'No. Bounties are strictly non-custodial and time-locked until their specified expiration epoch. This guarantees that contributors who put in the work will not have the rug pulled from under them.'
    },
    {
      q: 'What happens if a pull request fails to satisfy the criteria?',
      a: 'Validators vote MAJORITY_DISAGREE. The escrow remains locked in the contract, and the contributor receives the exact audit reasoning. The bounty remains open for revisions or for another contributor until the expiration epoch.'
    },
    {
      q: 'How are refunds handled once a bounty expires unfulfilled?',
      a: 'Once the current protocol epoch exceeds the bounty\'s expiry epoch, the contract\'s refund_bounty method unlocks. Anyone or the sponsor can trigger the refund, and 100% of the locked deposit returns directly to the sponsor wallet.'
    }
  ];

  return (
    <section id="faq" className="border-b border-[#1e2436] bg-[#0c0e14] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <SectionMarker number="05" label="Protocol Facts" />
          <h2 className="text-3xl sm:text-5xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-[#1e2436]">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="border-b border-[#1e2436] group py-5"
            >
              <summary className="flex items-center justify-between cursor-pointer font-sans font-medium text-base text-[#e8e6df] group-hover:text-white list-none select-none transition-colors">
                <span>{faq.q}</span>
                <span className="text-[#ff5500] text-xl font-mono ml-4 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm font-sans text-[#8a8f9d] leading-relaxed max-w-2xl">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
