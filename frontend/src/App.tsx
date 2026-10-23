import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Bounty, ClaimRecord, ProtocolCounts, TxStage, TxProgress } from './types';
import {
  getProtocolCounts,
  getAllBounties,
  getAllClaims,
  createBounty,
  submitAndAdjudicatePr,
  refundBounty,
  getOrCreateAccount
} from './services/genlayer';
import { WalletProvider } from './context/WalletContext';
import { WalletModal } from './components/WalletModal';
import { Header } from './components/Header';
import { TransactionBanner } from './components/Modals';

// 3 Main App Views
import { Home } from './pages/Home';
import { BountyRegistry } from './pages/BountyRegistry';
import { BountyDossier } from './pages/BountyDossier';
import { CreateBountyWizard } from './pages/CreateBountyWizard';

// Fallback bounties for quick preview
const SAMPLE_BOUNTIES: Bounty[] = [
  {
    id: 1,
    sponsor: '0x71C849D9455B1917Cbb2b3FE26C2e595304C204B',
    repo_name: 'genlayer/simulator',
    issue_number: 104,
    acceptance_criteria:
      'Fix memory leak in validator WebSocket stream under sustained load. Must include automated reproduction test verifying heap stabilization across 10,000 simulated rounds.',
    payout_wei: '250000000000000000',
    payout_formatted: '0.2500 GEN',
    created_epoch: 1,
    expiry_epoch: 25,
    status: 'OPEN',
    statusCode: 0,
    claimed_by: '',
    accepted_pr_url: ''
  },
  {
    id: 2,
    sponsor: '0x99A31b2859942a17D94e1e86A46cf01844E20B34',
    repo_name: 'genlayer/genlayer-js',
    issue_number: 88,
    acceptance_criteria:
      'Implement real-time WebSocket subscription client for Equivalence Principle validator round states. Include reconnect backoff and heartbeats.',
    payout_wei: '400000000000000000',
    payout_formatted: '0.4000 GEN',
    created_epoch: 2,
    expiry_epoch: 30,
    status: 'OPEN',
    statusCode: 0,
    claimed_by: '',
    accepted_pr_url: ''
  },
  {
    id: 3,
    sponsor: '0x10b981AA7210eE49e1e86A46cf01844E20B11223',
    repo_name: 'genlayer/consensus-engine',
    issue_number: 212,
    acceptance_criteria:
      'Refactor synchronous validator polling into non-blocking asyncio task pool. Measure throughput improvement and ensure 0 race conditions in state transition.',
    payout_wei: '500000000000000000',
    payout_formatted: '0.5000 GEN',
    created_epoch: 1,
    expiry_epoch: 20,
    status: 'CLAIMED',
    statusCode: 1,
    claimed_by: '0x63C15b5921B4b2215e23cf77a8CFCF3a0D62F33d',
    accepted_pr_url: 'https://github.com/genlayer/consensus-engine/pull/182'
  }
];

export default function App() {
  const [counts, setCounts] = useState<ProtocolCounts>({
    bounty_count: 2,
    claim_count: 1,
    current_epoch: 1,
    total_locked_escrow_wei: '650000000000000000',
    total_locked_escrow_formatted: '0.6500 GEN'
  });
  const [bounties, setBounties] = useState<Bounty[]>(SAMPLE_BOUNTIES);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [txProgress, setTxProgress] = useState<TxProgress>({
    stage: 'IDLE',
    message: ''
  });

  useEffect(() => {
    getOrCreateAccount();
    refreshData();
  }, []);

  async function refreshData() {
    try {
      const c = await getProtocolCounts();
      if (c && c.bounty_count > 0) {
        setCounts(c);
      }
      const bList = await getAllBounties();
      if (bList && bList.length > 0) {
        setBounties(bList);
      } else {
        setBounties(SAMPLE_BOUNTIES);
      }

      const cList = await getAllClaims();
      setClaims(cList);
    } catch (e) {
      console.error('Failed to refresh GitProof data:', e);
    }
  }

  async function handleCreateBounty(params: {
    repoName: string;
    issueNumber: number;
    acceptanceCriteria: string;
    expiryEpoch: number;
    depositGen: string;
  }) {
    try {
      setTxProgress({ stage: 'SIGNING', message: 'Broadcasting escrow deposit to GenLayer Studionet...' });
      await createBounty(
        {
          repoName: params.repoName,
          issueNumber: params.issueNumber,
          acceptanceCriteria: params.acceptanceCriteria,
          expiryEpoch: params.expiryEpoch,
          depositGen: params.depositGen
        },
        (stage: TxStage, message: string, hash?: string) => {
          setTxProgress({ stage, message, txHash: hash });
        }
      );
      await refreshData();
    } catch (err: any) {
      setTxProgress({
        stage: 'FAILED',
        message: 'Bounty creation failed',
        error: err.message || String(err)
      });
      throw err;
    }
  }

  async function handleSubmitClaim(bountyId: number, prUrl: string) {
    try {
      setTxProgress({
        stage: 'SIGNING',
        message: 'Broadcasting PR claim for multi-validator review...'
      });
      await submitAndAdjudicatePr(
        bountyId,
        prUrl,
        (stage: TxStage, message: string, hash?: string) => {
          setTxProgress({ stage, message, txHash: hash });
        }
      );
      await refreshData();
    } catch (err: any) {
      setTxProgress({
        stage: 'FAILED',
        message: 'Claim submission failed',
        error: err.message || String(err)
      });
      throw err;
    }
  }

  async function handleReclaim(bountyId: number) {
    try {
      setTxProgress({ stage: 'PENDING', message: `Reclaiming expired bounty #${bountyId}...` });
      await refundBounty(bountyId);
      await refreshData();
      setTxProgress({ stage: 'ACCEPTED', message: `Bounty #${bountyId} escrow refunded to sponsor!` });
    } catch (err: any) {
      setTxProgress({ stage: 'FAILED', message: 'Reclaim failed', error: err.message });
    }
  }

  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050608] text-[#f7f8fa] flex flex-col font-sans">
          <div className="film-grain" aria-hidden="true" />

          {/* Master 3-Tab Header with Live Studionet Wallet */}
          <Header />

          {/* Live Wallet Connection Modal */}
          <WalletModal />

          {/* Global Transaction Status Banner */}
          <TransactionBanner
            progress={txProgress}
            onDismiss={() => setTxProgress({ stage: 'IDLE', message: '' })}
          />

          {/* 3 Main Workflow Routes */}
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Tab 1: Landing Overview */}
              <Route
                path="/"
                element={
                  <Home
                    counts={counts}
                    bounties={bounties}
                  />
                }
              />

              {/* Tab 2: Launch App / Bounty Records */}
              <Route
                path="/bounties"
                element={
                  <BountyRegistry
                    bounties={bounties}
                  />
                }
              />

              {/* Detailed Dossier for a Bounty */}
              <Route
                path="/bounties/:id"
                element={
                  <BountyDossier
                    bounties={bounties}
                    claims={claims}
                    onSubmitClaim={handleSubmitClaim}
                    onReclaim={handleReclaim}
                    txProgress={txProgress}
                  />
                }
              />

              {/* Tab 3: Create New Bounty */}
              <Route
                path="/bounties/new"
                element={
                  <CreateBountyWizard
                    onCreateBounty={handleCreateBounty}
                  />
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}
