import React from 'react';
import { X, Sparkles, Activity, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Bounty, TxProgress } from '../types';

export function CreateBountyModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    repoName: string;
    issueNumber: number;
    acceptanceCriteria: string;
    expiryEpoch: number;
    depositGen: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-black shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.1]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff4f10] block">New Protocol Escrow</span>
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-[#090a0f]">Create Milestone Bounty</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/[0.05] text-[#64748b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-[#64748b] uppercase tracking-wider block mb-1">GitHub Repository Slug</label>
            <input
              type="text"
              value={form.repoName}
              onChange={e => setForm({ ...form, repoName: e.target.value })}
              className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] focus:outline-hidden focus:border-black"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#64748b] uppercase tracking-wider block mb-1">Issue Number</label>
              <input
                type="number"
                value={form.issueNumber}
                onChange={e => setForm({ ...form, issueNumber: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] focus:outline-hidden focus:border-black"
                required
              />
            </div>
            <div>
              <label className="text-[#64748b] uppercase tracking-wider block mb-1">Expiry Epoch</label>
              <input
                type="number"
                value={form.expiryEpoch}
                onChange={e => setForm({ ...form, expiryEpoch: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] focus:outline-hidden focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#64748b] uppercase tracking-wider block mb-1">Acceptance Criteria Spec</label>
            <textarea
              rows={3}
              value={form.acceptanceCriteria}
              onChange={e => setForm({ ...form, acceptanceCriteria: e.target.value })}
              className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] text-xs font-sans focus:outline-hidden focus:border-black"
              required
            />
          </div>

          <div>
            <label className="text-[#64748b] uppercase tracking-wider block mb-1">Escrow Deposit (GEN)</label>
            <input
              type="text"
              value={form.depositGen}
              onChange={e => setForm({ ...form, depositGen: e.target.value })}
              className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] font-bold text-[#ff4f10] focus:outline-hidden focus:border-black"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-black/[0.1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 uppercase tracking-wider text-[#64748b] hover:text-black font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 uppercase font-bold tracking-widest bg-[#ff4f10] text-white hover:bg-[#e04209] transition-all"
            >
              Deposit &amp; Lock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SubmitPrModal({
  isOpen,
  onClose,
  onSubmit,
  bounty,
  form,
  setForm
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  bounty: Bounty | null;
  form: { prUrl: string };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (!isOpen || !bounty) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-black shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.1]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff4f10] block">Deliverable Submission</span>
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-[#090a0f]">
              Submit Pull Request &mdash; Bounty #{bounty.id}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/[0.05] text-[#64748b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#fafafa] border border-black/[0.1] text-xs space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] block">Target Criteria</span>
          <p className="text-[#334155]">{bounty.acceptance_criteria}</p>
          <div className="flex items-center justify-between font-mono pt-1 text-[11px]">
            <span className="text-[#64748b]">Reward: <span className="text-[#ff4f10] font-bold">{bounty.payout_formatted}</span></span>
            <span className="text-[#64748b]">Expiry: Epoch #{bounty.expiry_epoch}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-[#64748b] uppercase tracking-wider block mb-1">GitHub Pull Request URL</label>
            <input
              type="url"
              value={form.prUrl}
              onChange={e => setForm({ ...form, prUrl: e.target.value })}
              placeholder="https://github.com/org/repo/pull/123"
              className="w-full px-3 py-2 border border-black/[0.15] bg-[#fafafa] focus:outline-hidden focus:border-black"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-black/[0.1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 uppercase tracking-wider text-[#64748b] hover:text-black font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 uppercase font-bold tracking-widest bg-[#090a0f] text-white hover:bg-[#222] transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff4f10]" />
              <span>Initiate Quorum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TransactionBanner({
  progress,
  onDismiss
}: {
  progress: TxProgress;
  onDismiss: () => void;
}) {
  if (progress.stage === 'IDLE') return null;

  return (
    <div className="p-6 border-b border-black/[0.1] bg-white relative">
      <div className="max-w-6xl mx-auto flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-2 border border-black/[0.1] bg-[#fafafa] mt-0.5">
            {progress.stage === 'ACCEPTED' ? (
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            ) : progress.stage === 'FAILED' ? (
              <XCircle className="w-5 h-5 text-[#ef4444]" />
            ) : (
              <Activity className="w-5 h-5 animate-spin text-[#ff4f10]" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-black/[0.1] bg-[#fafafa]">
                {progress.stage}
              </span>
              <h4 className="font-bold text-sm text-[#090a0f]">{progress.message}</h4>
            </div>
            {progress.txHash && (
              <p className="font-mono text-xs text-[#64748b] flex items-center space-x-1.5">
                <span>Tx: {progress.txHash}</span>
                <a
                  href={`https://studio-next.genlayer.com/transactions/${progress.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ff4f10] hover:underline inline-flex items-center"
                >
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </p>
            )}
            {progress.error && (
              <p className="text-xs font-mono text-[#ef4444] bg-[#fef2f2] p-2 border border-[#fecaca] max-w-xl">
                {progress.error}
              </p>
            )}
          </div>
        </div>
        <button onClick={onDismiss} className="text-[#64748b] hover:text-black p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
