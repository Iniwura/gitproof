import React, { useState } from 'react';
import { GitPullRequest, GitBranch, CheckCircle2, ShieldCheck, Play, Terminal, ArrowRight, Code2 } from 'lucide-react';
import { haptics } from '../lib/haptics';

interface DiffItem {
  id: string;
  prNumber: string;
  title: string;
  repo: string;
  branch: string;
  reward: string;
  additions: number;
  deletions: number;
  status: 'AUDIT_PENDING' | 'CONSENSUS_VERIFYING' | 'MERGED_RELEASED';
  filename: string;
  diffLines: { type: 'add' | 'del' | 'ctx'; oldLine?: number; newLine?: number; code: string }[];
  acceptanceCriteria: string;
}

const SAMPLE_PRS: DiffItem[] = [
  {
    id: 'pr-104',
    prNumber: '#104',
    title: 'feat: zero-knowledge proof verifier in GenVM',
    repo: 'genlayer/contracts',
    branch: 'feat/zk-verifier',
    reward: '2,500 GEN',
    additions: 142,
    deletions: 18,
    status: 'CONSENSUS_VERIFYING',
    filename: 'contracts/escrow/bounty_escrow.py',
    acceptanceCriteria: 'Must verify Groth16 zk-SNARK proof deterministically without external RPC dependencies.',
    diffLines: [
      { type: 'ctx', oldLine: 41, newLine: 41, code: 'class BountyEscrow(gl.Contract):' },
      { type: 'del', oldLine: 42, code: '-    def manual_arbiter_release(self, arbiter_sig: str):' },
      { type: 'del', oldLine: 43, code: '-        # VULNERABLE: Trusted third-party arbiter vulnerability' },
      { type: 'del', oldLine: 44, code: '-        require(msg.sender == self.arbiter, "Unauthorized")' },
      { type: 'add', newLine: 42, code: '+    def verify_consensus_pr_diff(self, pr_hash: str, criteria: str) -> bool:' },
      { type: 'add', newLine: 43, code: '+        """Deterministic GenVM Equivalence Principle Consensus"""' },
      { type: 'add', newLine: 44, code: '+        pr_diff = gl.get_web_data(f"https://api.github.com/repos/{self.repo}/pulls/{pr_hash}")' },
      { type: 'add', newLine: 45, code: '+        consensus_verdict = gl.ai_consensus_review(pr_diff, criteria, quorum=5)' },
      { type: 'add', newLine: 46, code: '+        if consensus_verdict.is_equivalent:' },
      { type: 'add', newLine: 47, code: '+            self._release_escrow_to_contributor(consensus_verdict.contributor)' },
      { type: 'ctx', oldLine: 45, newLine: 48, code: '            return True' }
    ]
  },
  {
    id: 'pr-88',
    prNumber: '#88',
    title: 'fix: reentrancy guard in multi-milestone vault',
    repo: 'genlayer/js-sdk',
    branch: 'fix/reentrancy-vault',
    reward: '1,800 GEN',
    additions: 48,
    deletions: 62,
    status: 'MERGED_RELEASED',
    filename: 'src/vault/ReentrancyGuard.ts',
    acceptanceCriteria: 'Prevent recursive callback exploitation during milestone escrow dispatch.',
    diffLines: [
      { type: 'ctx', oldLine: 12, newLine: 12, code: 'export class VaultDispatcher {' },
      { type: 'del', oldLine: 13, code: '-    private isLocked = false;' },
      { type: 'add', newLine: 13, code: '+    private _status = LockStatus.UNLOCKED;' },
      { type: 'add', newLine: 14, code: '+    nonReentrant() {' },
      { type: 'add', newLine: 15, code: '+        if (this._status === LockStatus.LOCKED) throw new ReentrancyError();' },
      { type: 'add', newLine: 16, code: '+        this._status = LockStatus.LOCKED;' },
      { type: 'ctx', oldLine: 14, newLine: 17, code: '    }' }
    ]
  },
  {
    id: 'pr-212',
    prNumber: '#212',
    title: 'perf: lttb downsampling on canvas telemetry stream',
    repo: 'genlayer/simulator',
    branch: 'perf/lttb-canvas',
    reward: '3,200 GEN',
    additions: 96,
    deletions: 12,
    status: 'AUDIT_PENDING',
    filename: 'src/telemetry/lttb.ts',
    acceptanceCriteria: 'Decimate 50,000 live block events down to viewport width preserving extrema at 60 FPS.',
    diffLines: [
      { type: 'ctx', oldLine: 80, newLine: 80, code: 'export function renderTelemetry(data: [number, number][]) {' },
      { type: 'del', oldLine: 81, code: '-    // Naive render of all 50k points: drops frames' },
      { type: 'add', newLine: 81, code: '+    const optimized = downsampleLTTB(data, canvas.clientWidth);' },
      { type: 'add', newLine: 82, code: '+    ctx.beginPath(); // 60 FPS guaranteed compositor pass' },
      { type: 'ctx', oldLine: 82, newLine: 83, code: '    ctx.stroke();' }
    ]
  }
];

export function GitDiffStudio() {
  const [selectedPrId, setSelectedPrId] = useState<string>('pr-104');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulatedVerdict, setSimulatedVerdict] = useState<string | null>(null);

  const activePr = SAMPLE_PRS.find(p => p.id === selectedPrId) || SAMPLE_PRS[0];

  const handleSelectPr = (pr: DiffItem) => {
    haptics.tick();
    setSelectedPrId(pr.id);
    setIsSimulating(false);
    setSimulationStep(0);
    setSimulatedVerdict(null);
  };

  const runConsensusSimulation = () => {
    haptics.click();
    setIsSimulating(true);
    setSimulationStep(1);
    setSimulatedVerdict(null);

    // Step 1: Query GitHub diff
    setTimeout(() => {
      haptics.tick(-0.3);
      setSimulationStep(2);
    }, 700);

    // Step 2: Dispatch to GenLayer 5 validators
    setTimeout(() => {
      haptics.tick(0.3);
      setSimulationStep(3);
    }, 1400);

    // Step 3: Quorum consensus achieved
    setTimeout(() => {
      haptics.success();
      setSimulationStep(4);
      setSimulatedVerdict('CONSENSUS QUORUM REACHED: 5/5 VALIDATORS CONFIRM EQUIVALENCE. ESCROW RELEASED.');
      setIsSimulating(false);
    }, 2200);
  };

  return (
    <div className="relative border border-[#1e2436] bg-[#080a0e] rounded-xl overflow-hidden shadow-2xl">
      {/* Studio Top Control Seam */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0e111a] border-b border-[#1e2436] text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500]/80 border border-[#ff5500]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffaa00]/60 border border-[#ffaa00]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88]/60 border border-[#00ff88]/80" />
          </div>
          <span className="text-[#8a8f9d] border-l border-[#1e2436] pl-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>gitproof-ide // pr-inspector.v2</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#8a8f9d]">
          <span className="hidden sm:inline">QUORUM: <strong className="text-[#00ff88]">5/5 GENVM NODES</strong></span>
          <span className="px-2 py-0.5 bg-[#131722] border border-[#1e2436] text-[#ff5500] uppercase font-bold text-[10px]">
            STUDIONET 61997
          </span>
        </div>
      </div>

      {/* Dual Pane Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#1e2436] min-h-[460px]">
        {/* Left Column: Git Branches & PR Explorer */}
        <div className="md:col-span-5 bg-[#090b10] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-wider text-[#8a8f9d] uppercase flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#ff5500]" />
                Select Pull Request
              </span>
              <span className="text-[10px] font-mono text-[#8a8f9d]">{SAMPLE_PRS.length} IN FLIGHT</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_PRS.map((pr) => {
                const isSelected = pr.id === activePr.id;
                return (
                  <button
                    key={pr.id}
                    type="button"
                    onClick={() => handleSelectPr(pr)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-mono relative ${
                      isSelected
                        ? 'bg-[#131722] border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.15)]'
                        : 'bg-[#0c0e14] border-[#1e2436] hover:border-[#8a8f9d]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#ff5500] font-bold flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3" />
                        {pr.prNumber}
                      </span>
                      <span className="text-[11px] font-bold text-[#e8e6df]">
                        {pr.reward}
                      </span>
                    </div>

                    <p className="text-[#e8e6df] font-sans text-xs font-medium leading-tight mb-2 line-clamp-1">
                      {pr.title}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#8a8f9d]">
                      <span className="font-mono text-[#8a8f9d]">{pr.branch}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#00ff88]">+{pr.additions}</span>
                        <span className="text-[#ff4444]">-{pr.deletions}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator Trigger */}
          <div className="pt-4 border-t border-[#1e2436] mt-4">
            <button
              type="button"
              disabled={isSimulating}
              onClick={runConsensusSimulation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-mono text-xs uppercase font-bold rounded-md tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,85,0,0.3)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'Evaluating in GenVM...' : 'Run GenVM Consensus'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Code Diff Inspector & Live Terminal Logs */}
        <div className="md:col-span-7 bg-[#07080c] flex flex-col justify-between">
          <div>
            {/* File Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2436] bg-[#0c0e14] text-xs font-mono">
              <span className="text-[#e8e6df] flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#ff5500]" />
                {activePr.filename}
              </span>
              <span className="text-[10px] text-[#8a8f9d]">
                CRITERIA: <strong className="text-[#ffaa00]">STRICT EQUIVALENCE</strong>
              </span>
            </div>

            {/* Code Diff Gutter */}
            <div className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[300px]">
              {activePr.diffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded ${
                    line.type === 'add'
                      ? 'bg-[#00ff88]/[0.08] text-[#00ff88]'
                      : line.type === 'del'
                      ? 'bg-[#ff4444]/[0.08] text-[#ff4444]'
                      : 'text-[#8a8f9d]'
                  }`}
                >
                  <span className="w-8 select-none text-right pr-3 opacity-40">
                    {line.newLine || line.oldLine || ''}
                  </span>
                  <span className="w-4 select-none font-bold">
                    {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                  </span>
                  <pre className="font-mono flex-1 whitespace-pre">{line.code}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* Consensus Verification Terminal Output */}
          <div className="p-3 border-t border-[#1e2436] bg-[#050608] font-mono text-[11px]">
            <div className="flex items-center justify-between text-[#8a8f9d] mb-1.5 text-[10px]">
              <span>GENLAYER CONSENSUS STATUS:</span>
              <span className={simulationStep === 4 ? 'text-[#00ff88]' : 'text-[#ffaa00]'}>
                {simulationStep === 0 && 'STANDBY'}
                {simulationStep === 1 && 'FETCHING GITHUB DIFF...'}
                {simulationStep === 2 && '5 VALIDATOR NODES EVALUATING...'}
                {simulationStep === 3 && 'CHECKING ACCEPTANCE EQUIVALENCE...'}
                {simulationStep === 4 && 'VERIFIED & RELEASED'}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#131722] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#ff5500] via-[#ffaa00] to-[#00ff88] transition-all duration-300"
                style={{ width: `${(simulationStep / 4) * 100}%` }}
              />
            </div>

            {simulatedVerdict ? (
              <div className="p-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded text-[#00ff88] text-[10px] leading-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{simulatedVerdict}</span>
              </div>
            ) : (
              <p className="text-[#8a8f9d] text-[10px] line-clamp-2">
                <strong>Frozen Criteria:</strong> {activePr.acceptanceCriteria}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
