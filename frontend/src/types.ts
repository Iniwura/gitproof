export type BountyStatus = 'OPEN' | 'CLAIMED' | 'REFUNDED' | 'DISPUTED';

export type ClaimStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type TxStage = 'IDLE' | 'SIGNING' | 'PENDING' | 'PROPOSING' | 'COMMITTING' | 'REVEALING' | 'ACCEPTED' | 'FAILED';

export interface Bounty {
  id: number;
  sponsor: string;
  repo_name: string;
  issue_number: number;
  acceptance_criteria: string;
  payout_wei: string;
  payout_formatted: string;
  created_epoch: number;
  expiry_epoch: number;
  status: BountyStatus;
  statusCode: number;
  claimed_by: string;
  accepted_pr_url: string;
}

export interface ClaimRecord {
  claim_id: number;
  bounty_id: number;
  contributor: string;
  pr_url: string;
  status: ClaimStatus;
  statusCode: number;
  confidence_score: number;
  verdict_rationale: string;
  evaluated_epoch: number;
}

export interface ProtocolCounts {
  bounty_count: number;
  claim_count: number;
  current_epoch: number;
  total_locked_escrow_wei: string;
  total_locked_escrow_formatted: string;
}

export interface TxProgress {
  stage: TxStage;
  message: string;
  txHash?: string;
  error?: string;
  claimVerdict?: {
    passed: boolean;
    confidence: number;
    rationale: string;
  };
}
