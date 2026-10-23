import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  GitPullRequest,
  GitBranch,
  GitCommit,
  CheckCircle2,
  XCircle,
  Play,
  ShieldCheck,
  Code2,
  Search,
  Folder,
  FolderOpen,
  FileCode2,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Cpu,
  Coins,
  ChevronRight,
  Sparkles,
  Command,
  Clock,
  Layers,
  Check,
  Send
} from 'lucide-react';
import { Bounty, ProtocolCounts, ClaimRecord } from '../types';
import { haptics } from '../lib/haptics';

interface GitProofIdeWorkbenchProps {
  counts: ProtocolCounts;
  bounties: Bounty[];
  claims: ClaimRecord[];
  onRefresh: () => void;
}

interface PrItem {
  id: number;
  prNumber: string;
  repo: string;
  branch: string;
  title: string;
  author: string;
  rewardFormatted: string;
  additions: number;
  deletions: number;
  status: 'OPEN' | 'VERIFYING' | 'CLAIMED';
  activeFile: string;
  criteria: string;
  validatorNotes: { node: string; text: string; passed: boolean }[];
  diffLines: { type: 'add' | 'del' | 'ctx'; oldLine?: number; newLine?: number; code: string }[];
}

const PR_ITEMS: PrItem[] = [
  {
    id: 1,
    prNumber: '#104',
    repo: 'genlayer/simulator',
    branch: 'feat/memory-leak-fix',
    title: 'fix(core): heap stabilization under 10k sustained websocket rounds',
    author: '0x71C8...204B',
    rewardFormatted: '0.2500 GEN',
    additions: 142,
    deletions: 18,
    status: 'OPEN',
    activeFile: 'contracts/escrow/bounty_escrow.py',
    criteria: 'Fix memory leak in validator WebSocket stream under sustained load. Must include automated reproduction test verifying heap stabilization across 10,000 simulated rounds.',
    validatorNotes: [
      { node: 'GenVM Node Alpha [Leader]', text: 'Heap allocation remains strictly flat through 10,000 rounds. Zero reentrancy vectors.', passed: true },
      { node: 'GenVM Node Beta', text: 'AST analysis confirms criteria conformity. Unit tests in tests/studionet/ pass without regression.', passed: true },
      { node: 'GenVM Node Gamma', text: 'Deterministic state transition validated. Byzantine threshold 5/5 satisfied.', passed: true }
    ],
    diffLines: [
      { type: 'ctx', oldLine: 41, newLine: 41, code: 'class BountyEscrow(gl.Contract):' },
      { type: 'del', oldLine: 42, code: '-    def manual_arbiter_release(self, arbiter_sig: str):' },
      { type: 'del', oldLine: 43, code: '-        # VULNERABLE: Centralized human arbiter key hazard' },
      { type: 'del', oldLine: 44, code: '-        require(msg.sender == self.arbiter, "Unauthorized")' },
      { type: 'add', newLine: 42, code: '+    def verify_consensus_pr_diff(self, pr_hash: str, criteria: str) -> bool:' },
      { type: 'add', newLine: 43, code: '+        """Deterministic GenVM Equivalence Principle Consensus"""' },
      { type: 'add', newLine: 44, code: '+        pr_diff = gl.get_web_data(f"https://api.github.com/repos/{self.repo}/pulls/{pr_hash}")' },
      { type: 'add', newLine: 45, code: '+        consensus = gl.ai_consensus_review(pr_diff, criteria, quorum=5)' },
      { type: 'add', newLine: 46, code: '+        if consensus.is_equivalent:' },
      { type: 'add', newLine: 47, code: '+            self._disburse_escrow(consensus.contributor, self.bounty_amount)' },
      { type: 'ctx', oldLine: 45, newLine: 48, code: '            return True' }
    ]
  },
  {
    id: 2,
    prNumber: '#88',
    repo: 'genlayer/genlayer-js',
    branch: 'feat/ws-heartbeat-backoff',
    title: 'feat(sdk): real-time websocket client for equivalence validator rounds',
    author: '0x99A3...0B34',
    rewardFormatted: '0.4000 GEN',
    additions: 84,
    deletions: 12,
    status: 'OPEN',
    activeFile: 'src/consensus/WebSocketSubscriber.ts',
    criteria: 'Implement real-time WebSocket subscription client for Equivalence Principle validator round states. Include reconnect backoff and heartbeats.',
    validatorNotes: [
      { node: 'GenVM Node Alpha', text: 'Exponential backoff jitter tested under simulated disconnects. Clean recovery.', passed: true },
      { node: 'GenVM Node Delta', text: 'WebSocket heartbeats fire strictly every 5000ms. Criteria satisfied.', passed: true }
    ],
    diffLines: [
      { type: 'ctx', oldLine: 18, newLine: 18, code: 'export class ValidatorSubscriber {' },
      { type: 'del', oldLine: 19, code: '-    private socket: WebSocket | null = null;' },
      { type: 'add', newLine: 19, code: '+    private socket: ResilientWebSocket | null = null;' },
      { type: 'add', newLine: 20, code: '+    private reconnectAttempts = 0;' },
      { type: 'add', newLine: 21, code: '+    connectWithBackoff(url: string) {' },
      { type: 'add', newLine: 22, code: '+        const delay = Math.min(1000 * (2 ** this.reconnectAttempts), 30000);' },
      { type: 'add', newLine: 23, code: '+        setTimeout(() => this.initSocket(url), delay);' },
      { type: 'ctx', oldLine: 20, newLine: 24, code: '    }' }
    ]
  },
  {
    id: 3,
    prNumber: '#212',
    repo: 'genlayer/consensus-engine',
    branch: 'perf/asyncio-task-pool',
    title: 'refactor: non-blocking asyncio task pool replacing synchronous validator poll',
    author: '0x10B9...1122',
    rewardFormatted: '0.5000 GEN',
    additions: 215,
    deletions: 94,
    status: 'CLAIMED',
    activeFile: 'engine/consensus/byzantine_pool.py',
    criteria: 'Refactor synchronous validator polling into non-blocking asyncio task pool. Measure throughput improvement and ensure 0 race conditions in state transition.',
    validatorNotes: [
      { node: 'GenVM Quorum', text: '5/5 nodes voted EQUIVALENT in epoch #1. Escrow released to 0x63C1...33d.', passed: true }
    ],
    diffLines: [
      { type: 'ctx', oldLine: 50, newLine: 50, code: 'async def poll_validator_quorum(nodes: list[str]):' },
      { type: 'del', oldLine: 51, code: '-    for node in nodes: res = sync_http_get(node)' },
      { type: 'add', newLine: 51, code: '+    tasks = [asyncio.create_task(async_eval(n)) for n in nodes]' },
      { type: 'add', newLine: 52, code: '+    results = await asyncio.gather(*tasks, return_exceptions=False)' },
      { type: 'ctx', oldLine: 52, newLine: 53, code: '    return aggregate_byzantine_votes(results)' }
    ]
  }
];

export function GitProofIdeWorkbench({ counts, bounties, claims, onRefresh }: GitProofIdeWorkbenchProps) {
  const [selectedPrId, setSelectedPrId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'DIFF' | 'DAG' | 'CRITERIA'>('DIFF');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<number>(0);
  const [auditSuccess, setAuditSuccess] = useState<boolean>(false);

  // Terminal state
  const [cliInput, setCliInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'gitproof-os v2.4.0 (studionet-61997-x86_64)',
    'Type "help" or click command pills below to run consensus tools.',
    'Ready. Connected to GenVM Studionet Quorum.'
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const activePr = PR_ITEMS.find(p => p.id === selectedPrId) || PR_ITEMS[0];

  const handleSelectPr = (id: number) => {
    haptics.tick();
    setSelectedPrId(id);
    setIsAuditing(false);
    setAuditStep(0);
    setAuditSuccess(false);
  };

  const runByzantineConsensus = () => {
    haptics.click();
    setIsAuditing(true);
    setAuditStep(1);
    setAuditSuccess(false);

    setTimeout(() => {
      haptics.tick(0.2);
      setAuditStep(2);
    }, 700);

    setTimeout(() => {
      haptics.tick(-0.2);
      setAuditStep(3);
    }, 1400);

    setTimeout(() => {
      haptics.success();
      setAuditStep(4);
      setAuditSuccess(true);
      setIsAuditing(false);
      setTerminalHistory(prev => [
        ...prev,
        `[GENVM CONSENSUS] PR ${activePr.prNumber} verified against criteria.`,
        `[STATUS] 5/5 Byzantine validators agreed. Escrow release authorization granted!`
      ]);
    }, 2200);
  };

  const handleCliSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cliInput.trim()) return;

    haptics.tick();
    const cmd = cliInput.trim().toLowerCase();
    const newLogs = [...terminalHistory, `❯ ${cliInput}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available commands:',
        '  verify <#pr>   - Run 5-node GenVM equivalence audit on PR diff',
        '  bounties       - List all active escrow bounties in Studionet',
        '  quorum         - Inspect live Byzantine validator node status',
        '  clear          - Clear terminal logs'
      );
    } else if (cmd.startsWith('verify')) {
      newLogs.push(`Dispatching PR ${activePr.prNumber} to GenVM 5-node quorum...`);
      runByzantineConsensus();
    } else if (cmd === 'bounties') {
      newLogs.push(
        'ACTIVE BOUNTY VAULTS:',
        `  #104: ${counts.total_locked_escrow_formatted} [contracts/escrow/bounty_escrow.py]`,
        '  #88:  0.4000 GEN [src/consensus/WebSocketSubscriber.ts]',
        '  #212: 0.5000 GEN [engine/consensus/byzantine_pool.py] (CLAIMED)'
      );
    } else if (cmd === 'quorum') {
      newLogs.push(
        'GENVM VALIDATOR QUORUM STATUS:',
        '  Node 1 (Alpha):  ONLINE [H100 80GB] Latency: 42ms  Vote: EQUIVALENT',
        '  Node 2 (Beta):   ONLINE [H100 80GB] Latency: 51ms  Vote: EQUIVALENT',
        '  Node 3 (Gamma):  ONLINE [A100 80GB] Latency: 38ms  Vote: EQUIVALENT',
        '  Node 4 (Delta):  ONLINE [H100 80GB] Latency: 46ms  Vote: EQUIVALENT',
        '  Node 5 (Epsilon):ONLINE [H100 80GB] Latency: 49ms  Vote: EQUIVALENT',
        'Quorum condition (5/5 >= 80%): SATISFIED'
      );
    } else if (cmd === 'clear') {
      setTerminalHistory(['gitproof-os terminal cleared.']);
      setCliInput('');
      return;
    } else {
      newLogs.push(`Command not recognized: "${cliInput}". Type "help" for list.`);
    }

    setTerminalHistory(newLogs);
    setCliInput('');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="min-h-screen bg-[#07090e] text-[#e8e6df] font-mono select-none flex flex-col">
      {/* 1. OS-Style Master Workbench Bar */}
      <header className="h-11 border-b border-[#1b2234] bg-[#0c0f18] px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-4">
          {/* OS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>

          <div className="h-4 w-px bg-[#1b2234]" />

          {/* Active Repo & Branch */}
          <div className="flex items-center gap-2 text-[#9da3b4]">
            <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="text-[#e8e6df] font-bold">gitproof-ide</span>
            <span>//</span>
            <span className="text-[#ff5500] font-semibold">{activePr.repo}</span>
            <span>:</span>
            <span className="flex items-center gap-1 text-[#e8e6df] bg-[#141a29] px-2 py-0.5 rounded border border-[#1b2234]">
              <GitBranch className="w-3 h-3 text-[#ff5500]" />
              {activePr.branch}
            </span>
          </div>
        </div>

        {/* Global Network Telemetry */}
        <div className="flex items-center gap-5 text-[11px] text-[#8a8f9d]">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span>QUORUM: <strong className="text-[#00ff88]">5/5 NODES LIVE</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#ffaa00]" />
            <span>LOCKED: <strong className="text-[#e8e6df]">{counts.total_locked_escrow_formatted}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#141a29] px-2.5 py-1 rounded border border-[#1b2234] text-[#ff5500] font-bold text-[10px]">
            <span>STUDIONET 61997</span>
          </div>
        </div>
      </header>

      {/* 2. Main 3-Pane Workbench Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1b2234] overflow-hidden">
        
        {/* LEFT COLUMN: PR Queue & Repository Tree (3 cols) */}
        <div className="lg:col-span-3 bg-[#090b12] flex flex-col justify-between overflow-y-auto">
          <div>
            {/* PR Queue Header */}
            <div className="p-3 border-b border-[#1b2234] bg-[#0c0f18] flex items-center justify-between text-xs">
              <span className="text-[#8a8f9d] uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-[#ff5500]" />
                Pull Request Queue
              </span>
              <span className="px-2 py-0.5 bg-[#ff5500]/15 text-[#ff5500] rounded text-[10px] font-bold">
                {PR_ITEMS.length} IN FLIGHT
              </span>
            </div>

            {/* PR List */}
            <div className="divide-y divide-[#1b2234]">
              {PR_ITEMS.map((pr) => {
                const isSelected = pr.id === activePr.id;
                return (
                  <div
                    key={pr.id}
                    onClick={() => handleSelectPr(pr.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#141b2a] border-l-2 border-[#ff5500]'
                        : 'hover:bg-[#0e121d] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#ff5500] font-bold text-xs flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3" />
                        {pr.prNumber}
                      </span>
                      <span className="text-[11px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.2 rounded border border-[#00ff88]/30">
                        {pr.rewardFormatted}
                      </span>
                    </div>

                    <h4 className="text-xs text-[#e8e6df] font-sans font-medium line-clamp-2 leading-snug mb-2">
                      {pr.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-[#8a8f9d]">
                      <span className="truncate max-w-[120px]">{pr.branch}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#00ff88]">+{pr.additions}</span>
                        <span className="text-[#ff4444]">-{pr.deletions}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action to Fund Bounty */}
            <div className="p-3 border-t border-[#1b2234] bg-[#0c0f18]/80">
              <Link
                to="/bounties/new"
                onClick={() => haptics.click()}
                className="w-full py-2 bg-[#ff5500] hover:bg-[#ff6e22] text-white text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,85,0,0.25)]"
              >
                <span>+ Lock Escrow Bounty</span>
              </Link>
            </div>
          </div>

          {/* Repo Explorer Mini Tree */}
          <div className="p-3 border-t border-[#1b2234] bg-[#07090e] text-[11px]">
            <span className="text-[10px] text-[#8a8f9d] uppercase tracking-wider block mb-2">
              Repository Tree
            </span>
            <div className="space-y-1 text-[#8a8f9d]">
              <div className="flex items-center gap-1.5 text-[#e8e6df]">
                <FolderOpen className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>contracts/escrow</span>
              </div>
              <div className="pl-4 space-y-1">
                <div className="flex items-center justify-between text-[#00ff88] bg-[#141b2a] px-1.5 py-0.5 rounded">
                  <span className="flex items-center gap-1 truncate">
                    <FileCode2 className="w-3 h-3" />
                    <span>bounty_escrow.py</span>
                  </span>
                  <span className="text-[9px] text-[#ffaa00]">ACTIVE</span>
                </div>
                <div className="flex items-center gap-1 text-[#8a8f9d]">
                  <FileCode2 className="w-3 h-3" />
                  <span>verifier_oracle.py</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Full IDE Diff Viewer & Validator Annotations (6 cols) */}
        <div className="lg:col-span-6 bg-[#06080d] flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Editor File Tab Bar */}
            <div className="flex items-center justify-between border-b border-[#1b2234] bg-[#0b0e16] px-3 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#141a29] text-[#e8e6df] rounded border-t-2 border-[#ff5500] text-xs font-medium">
                  <Code2 className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>{activePr.activeFile}</span>
                  <span className="text-[9px] px-1 bg-[#ffaa00]/20 text-[#ffaa00] rounded">MOD</span>
                </div>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { haptics.tick(); setActiveTab('DIFF'); }}
                  className={`px-2.5 py-0.5 rounded text-[11px] ${
                    activeTab === 'DIFF' ? 'bg-[#ff5500] text-white font-bold' : 'text-[#8a8f9d] hover:text-[#e8e6df]'
                  }`}
                >
                  Code Diff
                </button>
                <button
                  type="button"
                  onClick={() => { haptics.tick(); setActiveTab('DAG'); }}
                  className={`px-2.5 py-0.5 rounded text-[11px] ${
                    activeTab === 'DAG' ? 'bg-[#ff5500] text-white font-bold' : 'text-[#8a8f9d] hover:text-[#e8e6df]'
                  }`}
                >
                  Visual Git DAG
                </button>
              </div>
            </div>

            {/* Center Content: Either Diff or Visual DAG */}
            {activeTab === 'DIFF' ? (
              <div className="p-3 text-[11px] leading-relaxed overflow-x-auto">
                {activePr.diffLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 font-mono ${
                      line.type === 'add'
                        ? 'bg-[#00ff88]/[0.08] text-[#00ff88]'
                        : line.type === 'del'
                        ? 'bg-[#ff4444]/[0.08] text-[#ff4444]'
                        : 'text-[#8a8f9d]'
                    }`}
                  >
                    <span className="w-8 select-none text-right pr-3 opacity-40 shrink-0">
                      {line.newLine || line.oldLine || ''}
                    </span>
                    <span className="w-4 select-none font-bold shrink-0">
                      {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                    </span>
                    <pre className="font-mono flex-1 whitespace-pre">{line.code}</pre>
                  </div>
                ))}

                {/* Inline Validator Review Comments (Embedded directly in diff) */}
                <div className="mt-4 space-y-2 border-t border-[#1b2234] pt-4">
                  <span className="text-[10px] text-[#ffaa00] uppercase tracking-wider block font-bold">
                    INLINE GENVM CONSENSUS REVIEW COMMENTS
                  </span>
                  {activePr.validatorNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#0e1320] border border-[#1b2234] rounded-lg text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#ff5500] text-[10px]">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Cpu className="w-3 h-3 text-[#00ff88]" />
                          {note.node}
                        </span>
                        <span className="text-[#00ff88] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED CRITERIA
                        </span>
                      </div>
                      <p className="text-[#e8e6df] text-[11px] font-sans leading-relaxed">
                        "{note.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Visual Git DAG View */
              <div className="p-6 bg-[#04060a] space-y-6">
                <span className="text-[10px] text-[#8a8f9d] uppercase tracking-wider block">
                  Git Branch Commit Graph & Consensus Adjudication
                </span>

                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#3b82f6] shrink-0" />
                    <span className="text-[#8a8f9d]">commit 8a1e2b</span>
                    <span className="text-[#e8e6df]">main (Initial escrow contract deployed)</span>
                  </div>
                  <div className="pl-1.5 border-l-2 border-[#1b2234] ml-1.5 space-y-4 py-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#ff5500] shrink-0" />
                      <span className="text-[#ff5500]">branch {activePr.branch}</span>
                      <span className="text-[#e8e6df]">{activePr.title}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#101726] p-2 rounded border border-[#1b2234]">
                      <span className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse shrink-0" />
                      <span className="text-[#00ff88] font-bold">GenVM Equivalence Quorum (Epoch #11)</span>
                      <span className="text-xs text-[#8a8f9d]">5/5 Nodes confirmed equivalence</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#00ff88] shrink-0" />
                    <span className="text-[#00ff88]">commit e4019a</span>
                    <span className="text-[#e8e6df]">Settlement Disbursed ({activePr.rewardFormatted})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adjudication Action Dock */}
          <div className="p-3 border-t border-[#1b2234] bg-[#0b0e16] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isAuditing}
                onClick={runByzantineConsensus}
                className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6e22] text-white text-xs font-bold uppercase rounded flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,85,0,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAuditing ? 'Evaluating in GenVM...' : 'Run Byzantine Quorum'}</span>
              </button>

              <Link
                to={`/bounties/${activePr.id}`}
                onClick={() => haptics.click()}
                className="px-3 py-2 bg-[#141b2a] hover:bg-[#1a2336] text-[#e8e6df] text-xs font-bold uppercase rounded border border-[#1b2234] flex items-center gap-1.5 transition-colors"
              >
                <span>Full Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8a8f9d]" />
              </Link>
            </div>

            <span className="text-[10px] text-[#8a8f9d]">
              QUORUM THRESHOLD: <strong className="text-[#00ff88]">80% (4/5 NODES)</strong>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Spec Inspector & Validator Quorum Grid (3 cols) */}
        <div className="lg:col-span-3 bg-[#080a10] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-[#8a8f9d] uppercase tracking-wider block mb-1">
                FROZEN CRITERIA SPECIFICATION
              </span>
              <h3 className="text-sm font-bold text-[#e8e6df] mb-2">
                Bounty #{activePr.id} &mdash; {activePr.prNumber}
              </h3>
              <div className="p-3 bg-[#0c0f18] border border-[#1b2234] rounded text-xs text-[#cfd3dc] leading-relaxed max-h-36 overflow-y-auto font-sans">
                {activePr.criteria}
              </div>
            </div>

            {/* Smart Contract Vault State */}
            <div className="border border-[#1b2234] bg-[#0c0f18] rounded-lg p-3 space-y-2 text-xs">
              <span className="text-[10px] text-[#ffaa00] uppercase tracking-wider block font-bold">
                VAULT SPECIFICATION
              </span>
              <div className="flex items-center justify-between text-[#8a8f9d]">
                <span>Escrow Payout:</span>
                <strong className="text-sm text-[#ff5500]">{activePr.rewardFormatted}</strong>
              </div>
              <div className="flex items-center justify-between text-[#8a8f9d]">
                <span>Sponsor Key:</span>
                <span className="text-[#e8e6df] truncate max-w-[130px]">{activePr.author}</span>
              </div>
              <div className="flex items-center justify-between text-[#8a8f9d]">
                <span>Timelock Expiry:</span>
                <span className="text-[#e8e6df]">Epoch #30</span>
              </div>
            </div>

            {/* Live Quorum State machine */}
            <div className="border border-[#1b2234] bg-[#0c0f18] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#8a8f9d] uppercase">Consensus Stage</span>
                <span className={auditStep === 4 ? 'text-[#00ff88] font-bold' : 'text-[#ffaa00]'}>
                  {auditStep === 0 && 'STANDBY'}
                  {auditStep === 1 && 'FETCHING GITHUB DIFF...'}
                  {auditStep === 2 && 'ANALYZING AST & TESTS...'}
                  {auditStep === 3 && 'COMPUTING EQUIVALENCE...'}
                  {auditStep === 4 && 'CONSENSUS SEALED (5/5)'}
                </span>
              </div>

              <div className="h-1.5 w-full bg-[#141b2a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff5500] via-[#ffaa00] to-[#00ff88] transition-all duration-300"
                  style={{ width: `${(auditStep / 4) * 100}%` }}
                />
              </div>

              {auditSuccess && (
                <div className="p-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded text-[#00ff88] text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Byzantine quorum achieved. Smart contract escrow released to contributor.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1b2234] text-[10px] text-[#8a8f9d] flex items-center justify-between">
            <span>ZERO HUMAN ARBITERS</span>
            <span className="text-[#00ff88] font-bold">GENLAYER STUDIONET</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Interactive CLI Terminal Console */}
      <div className="h-44 border-t border-[#1b2234] bg-[#05070b] flex flex-col justify-between shrink-0 font-mono text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#090c14] border-b border-[#1b2234] text-[11px] text-[#8a8f9d]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="text-[#e8e6df] font-bold">gitproof-shell</span>
            <span>· session active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8a8f9d]">Try:</span>
            <button
              type="button"
              onClick={() => { setCliInput('verify 104'); }}
              className="px-1.5 py-0.5 bg-[#141b2a] hover:bg-[#1f293d] text-[#ff5500] rounded text-[10px]"
            >
              verify 104
            </button>
            <button
              type="button"
              onClick={() => { setCliInput('bounties'); }}
              className="px-1.5 py-0.5 bg-[#141b2a] hover:bg-[#1f293d] text-[#ffaa00] rounded text-[10px]"
            >
              bounties
            </button>
            <button
              type="button"
              onClick={() => { setCliInput('quorum'); }}
              className="px-1.5 py-0.5 bg-[#141b2a] hover:bg-[#1f293d] text-[#00ff88] rounded text-[10px]"
            >
              quorum
            </button>
          </div>
        </div>

        {/* Terminal Stdout Logs */}
        <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[11px]">
          {terminalHistory.map((line, i) => (
            <div
              key={i}
              className={`${
                line.startsWith('❯')
                  ? 'text-[#ff5500] font-bold'
                  : line.includes('EQUIVALENT') || line.includes('verified')
                  ? 'text-[#00ff88]'
                  : 'text-[#8a8f9d]'
              }`}
            >
              {line}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleCliSubmit} className="flex items-center px-3 py-1.5 bg-[#080b12] border-t border-[#1b2234]">
          <span className="text-[#ff5500] font-bold mr-2">❯</span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder='Type command (e.g. "verify 104", "bounties", "quorum", "help")...'
            className="flex-1 bg-transparent text-[#e8e6df] outline-none text-xs font-mono placeholder:text-[#8a8f9d]/40"
          />
          <button type="submit" className="text-[#ff5500] hover:text-[#ff6e22] ml-2">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
