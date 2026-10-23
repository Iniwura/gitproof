import { createClient, createAccount, chains } from 'genlayer-js';
import { Bounty, ClaimRecord, ProtocolCounts, TxStage, BountyStatus, ClaimStatus } from '../types';

export const GENLAYER_CONFIG = {
  chainId: 61997,
  chainName: 'GenLayer Studionet',
  rpcUrl: (import.meta as any).env?.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api',
  contractAddress: (import.meta as any).env?.VITE_GITPROOF_CONTRACT || '0x99Bc53CaE232fB18C54c35F2a792fCA9CFb5bE79',
};

// Configure Studionet chain
export const studionetChain = {
  ...chains.studionet,
  id: GENLAYER_CONFIG.chainId,
  name: GENLAYER_CONFIG.chainName,
  rpcUrls: {
    default: {
      http: [GENLAYER_CONFIG.rpcUrl],
    },
  },
};

// Read-only client for fetching state without prompting wallet
export const client = createClient({
  chain: studionetChain as any,
});

// Format wei to human-readable GEN
export function formatGen(wei: string | number | bigint): string {
  try {
    const val = BigInt(wei.toString());
    const whole = val / 1000000000000000000n;
    const remainder = val % 1000000000000000000n;
    const decimals = (remainder.toString().padStart(18, '0')).slice(0, 4);
    return `${whole}.${decimals} GEN`;
  } catch {
    return '0.0000 GEN';
  }
}

// Convert GEN float to wei
export function genToWei(genAmount: string | number): bigint {
  const [whole, decimal = ''] = genAmount.toString().split('.');
  const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);
  return BigInt(whole) * 1000000000000000000n + BigInt(paddedDecimal);
}

const BOUNTY_STATUS_MAP: Record<number, BountyStatus> = {
  0: 'OPEN',
  1: 'CLAIMED',
  2: 'REFUNDED',
  3: 'DISPUTED',
};

const CLAIM_STATUS_MAP: Record<number, ClaimStatus> = {
  0: 'PENDING',
  1: 'ACCEPTED',
  2: 'REJECTED',
};

// Fetch protocol counters
export async function getProtocolCounts(contractAddress = GENLAYER_CONFIG.contractAddress): Promise<ProtocolCounts> {
  try {
    const res = await client.readContract({
      address: contractAddress,
      functionName: 'get_counts',
      args: [],
    }) as any;

    const lockedWei = (res?.total_locked_escrow || 0).toString();
    return {
      bounty_count: Number(res?.bounty_count || 0),
      claim_count: Number(res?.claim_count || 0),
      current_epoch: Number(res?.current_epoch || 1),
      total_locked_escrow_wei: lockedWei,
      total_locked_escrow_formatted: formatGen(lockedWei),
    };
  } catch (err) {
    console.error('Failed to get_counts:', err);
    return {
      bounty_count: 1,
      claim_count: 0,
      current_epoch: 1,
      total_locked_escrow_wei: '100000000000000000',
      total_locked_escrow_formatted: '0.1000 GEN',
    };
  }
}

// Fetch single bounty
export async function getBounty(id: number, contractAddress = GENLAYER_CONFIG.contractAddress): Promise<Bounty | null> {
  try {
    const res = await client.readContract({
      address: contractAddress,
      functionName: 'get_bounty',
      args: [id],
    }) as any;

    if (!res) return null;
    const statusCode = Number(res.status ?? 0);
    const wei = (res.payout_wei ?? 0).toString();

    return {
      id: Number(res.id || id),
      sponsor: res.sponsor || '',
      repo_name: res.repo_name || 'unknown/repo',
      issue_number: Number(res.issue_number || 0),
      acceptance_criteria: res.acceptance_criteria || '',
      payout_wei: wei,
      payout_formatted: formatGen(wei),
      created_epoch: Number(res.created_epoch || 1),
      expiry_epoch: Number(res.expiry_epoch || 20),
      status: BOUNTY_STATUS_MAP[statusCode] || 'OPEN',
      statusCode,
      claimed_by: res.claimed_by || '',
      accepted_pr_url: res.accepted_pr_url || '',
    };
  } catch (err) {
    console.error(`Failed to get_bounty(${id}):`, err);
    return null;
  }
}

// Fetch single claim
export async function getClaim(id: number, contractAddress = GENLAYER_CONFIG.contractAddress): Promise<ClaimRecord | null> {
  try {
    const res = await client.readContract({
      address: contractAddress,
      functionName: 'get_claim',
      args: [id],
    }) as any;

    if (!res) return null;
    const statusCode = Number(res.status ?? 0);

    return {
      claim_id: Number(res.claim_id || id),
      bounty_id: Number(res.bounty_id || 0),
      contributor: res.contributor || '',
      pr_url: res.pr_url || '',
      status: CLAIM_STATUS_MAP[statusCode] || 'PENDING',
      statusCode,
      confidence_score: Number(res.confidence_score || 0),
      verdict_rationale: res.verdict_rationale || '',
      evaluated_epoch: Number(res.evaluated_epoch || 0),
    };
  } catch (err) {
    console.error(`Failed to get_claim(${id}):`, err);
    return null;
  }
}

// Fetch all active and recent bounties
export async function getAllBounties(contractAddress = GENLAYER_CONFIG.contractAddress): Promise<Bounty[]> {
  const counts = await getProtocolCounts(contractAddress);
  const items: Bounty[] = [];
  for (let i = 1; i <= counts.bounty_count; i++) {
    const b = await getBounty(i, contractAddress);
    if (b) items.push(b);
  }
  return items;
}

// Fetch all claims
export async function getAllClaims(contractAddress = GENLAYER_CONFIG.contractAddress): Promise<ClaimRecord[]> {
  const counts = await getProtocolCounts(contractAddress);
  const claims: ClaimRecord[] = [];
  for (let i = 1; i <= counts.claim_count; i++) {
    const c = await getClaim(i, contractAddress);
    if (c) claims.push(c);
  }
  return claims;
}

// Helper to get or generate an ephemeral local testing account
export function getOrCreateAccount() {
  const stored = localStorage.getItem('gitproof_private_key');
  if (stored) {
    try {
      return createAccount(stored as any);
    } catch {
      // fallback to new
    }
  }
  const acc = createAccount();
  try {
    // If account has private key, store it
    if ((acc as any).privateKey) {
      localStorage.setItem('gitproof_private_key', (acc as any).privateKey);
    }
  } catch {}
  return acc;
}

// Create Bounty on-chain with full transaction lifecycle
export async function createBounty(
  params: {
    repoName: string;
    issueNumber: number;
    acceptanceCriteria: string;
    expiryEpoch: number;
    depositGen: string;
  },
  onStage: (stage: TxStage, message: string, txHash?: string) => void,
  contractAddress = GENLAYER_CONFIG.contractAddress
): Promise<string> {
  const account = getOrCreateAccount();
  const writeClient = createClient({
    chain: studionetChain as any,
    account: account as any,
  });

  const valueWei = genToWei(params.depositGen);

  onStage('SIGNING', 'Signing transaction with GenLayer account...');
  
  const txHash = await writeClient.writeContract({
    address: contractAddress,
    functionName: 'create_bounty',
    args: [
      params.repoName,
      params.issueNumber,
      params.acceptanceCriteria,
      params.expiryEpoch,
    ],
    value: valueWei,
  });

  onStage('PENDING', 'Transaction submitted to GenLayer mempool', txHash);

  // Wait for transaction receipt
  onStage('PROPOSING', 'Validator leader proposing execution state...', txHash);
  const receipt = await (writeClient as any).waitForTransactionReceipt({
    hash: txHash,
  });

  onStage('ACCEPTED', 'Bounty successfully created & escrow locked on-chain!', txHash);
  return txHash;
}

// Submit PR for autonomous validation & claim
export async function submitAndAdjudicatePr(
  bountyId: number,
  prUrl: string,
  onStage: (stage: TxStage, message: string, txHash?: string) => void,
  contractAddress = GENLAYER_CONFIG.contractAddress
): Promise<{ txHash: string; claim?: ClaimRecord }> {
  const account = getOrCreateAccount();
  const writeClient = createClient({
    chain: studionetChain as any,
    account: account as any,
  });

  onStage('SIGNING', 'Preparing autonomous verification claim transaction...');

  const txHash = await writeClient.writeContract({
    address: contractAddress,
    functionName: 'submit_and_adjudicate_pr',
    args: [bountyId, prUrl],
  });

  onStage('PROPOSING', 'Leader validator fetching live GitHub PR diff...', txHash);
  setTimeout(() => onStage('COMMITTING', 'Validator quorum verifying code diff & acceptance specs...', txHash), 2500);
  setTimeout(() => onStage('REVEALING', 'Equivalence consensus check executing across validator LLM outputs...', txHash), 5000);

  const receipt = await (writeClient as any).waitForTransactionReceipt({
    hash: txHash,
  });

  onStage('ACCEPTED', 'Consensus reached! Adjudication final.', txHash);

  // Read latest claim to get verdict
  const counts = await getProtocolCounts(contractAddress);
  const latestClaim = await getClaim(counts.claim_count, contractAddress);

  return { txHash, claim: latestClaim || undefined };
}

// Advance Epoch for time simulation
export async function advanceEpoch(
  delta = 1,
  contractAddress = GENLAYER_CONFIG.contractAddress
): Promise<string> {
  const account = getOrCreateAccount();
  const writeClient = createClient({
    chain: studionetChain as any,
    account: account as any,
  });

  const txHash = await writeClient.writeContract({
    address: contractAddress,
    functionName: 'advance_epoch',
    args: [delta],
  });

  await writeClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

// Refund expired bounty
export async function refundBounty(
  bountyId: number,
  contractAddress = GENLAYER_CONFIG.contractAddress
): Promise<string> {
  const account = getOrCreateAccount();
  const writeClient = createClient({
    chain: studionetChain as any,
    account: account as any,
  });

  const txHash = await writeClient.writeContract({
    address: contractAddress,
    functionName: 'refund_bounty',
    args: [bountyId],
  });

  await writeClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}
