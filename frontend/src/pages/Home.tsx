import React from 'react';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { MilestoneLedger } from '../components/MilestoneLedger';
import { Footer } from '../components/Footer';
import { Bounty, ProtocolCounts } from '../types';

interface HomeProps {
  counts: ProtocolCounts;
  bounties: Bounty[];
}

export function Home({ counts, bounties }: HomeProps) {
  return (
    <div className="bg-[#050608] text-[#f7f8fa] min-h-screen selection:bg-[#ff6b00]/30 selection:text-white">
      {/* 1. Clean, High-Impact Hero with Product Preview */}
      <Hero
        totalLockedFormatted={counts.total_locked_escrow_formatted}
        bountyCount={counts.bounty_count}
      />

      {/* 2. 3-Step "How GitProof Works" */}
      <HowItWorks />

      {/* 3. Live Active Milestone Bounties Ledger */}
      <MilestoneLedger
        bounties={bounties}
      />

      {/* 4. Minimalist Web3 Footer */}
      <Footer />
    </div>
  );
}
