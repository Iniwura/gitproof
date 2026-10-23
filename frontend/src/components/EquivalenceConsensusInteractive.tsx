import React, { useState } from 'react';
import { ShieldCheck, Cpu, GitCommit, CheckCircle2, XCircle, AlertTriangle, Play, RefreshCw, Zap } from 'lucide-react';
import { haptics } from '../lib/haptics';

interface ValidatorNode {
  id: string;
  name: string;
  gpu: string;
  status: 'READY' | 'ANALYZING' | 'EQUIVALENT' | 'REJECTED';
  confidence: number;
  hash: string;
  verdictNote: string;
}

const SCENARIOS = [
  {
    id: 'pass',
    title: 'Clean PR Implementation',
    desc: 'All criteria satisfied, memory benchmarks pass, zero reentrancy risks.',
    expectedEquivalence: true,
    requiredQuorumPct: 80,
    nodes: [
      { id: 'v-1', name: 'Validator Alpha [Leader]', gpu: 'GenVM H100 Node 1', status: 'EQUIVALENT', confidence: 0.99, hash: '0x3f1a...c8', verdictNote: 'AST & unit tests 100% conform to frozen spec.' },
      { id: 'v-2', name: 'Validator Beta', gpu: 'GenVM H100 Node 2', status: 'EQUIVALENT', confidence: 0.98, hash: '0x99e2...04', verdictNote: 'Diff matches acceptance criteria invariants.' },
      { id: 'v-3', name: 'Validator Gamma', gpu: 'GenVM H100 Node 3', status: 'EQUIVALENT', confidence: 0.96, hash: '0x12bb...fd', verdictNote: 'Zero memory leaks detected across 10k rounds.' },
      { id: 'v-4', name: 'Validator Delta', gpu: 'GenVM H100 Node 4', status: 'EQUIVALENT', confidence: 0.99, hash: '0x77cd...e1', verdictNote: 'Deterministic state transition verified.' },
      { id: 'v-5', name: 'Validator Epsilon', gpu: 'GenVM H100 Node 5', status: 'EQUIVALENT', confidence: 0.97, hash: '0x44aa...bc', verdictNote: 'Clean syntax & cryptographic signature matches.' }
    ]
  },
  {
    id: 'reject_bug',
    title: 'Incomplete PR / Hidden Memory Leak',
    desc: 'PR claims to fix issue #104 but fails stress test round 9,200.',
    expectedEquivalence: false,
    requiredQuorumPct: 80,
    nodes: [
      { id: 'v-1', name: 'Validator Alpha [Leader]', gpu: 'GenVM H100 Node 1', status: 'REJECTED', confidence: 0.94, hash: '0x3f1a...c8', verdictNote: 'Heap allocation continues growing past round 9,000.' },
      { id: 'v-2', name: 'Validator Beta', gpu: 'GenVM H100 Node 2', status: 'REJECTED', confidence: 0.96, hash: '0x99e2...04', verdictNote: 'Failed acceptance criteria: heap stabilization unproven.' },
      { id: 'v-3', name: 'Validator Gamma', gpu: 'GenVM H100 Node 3', status: 'REJECTED', confidence: 0.91, hash: '0x12bb...fd', verdictNote: 'Reproduction test assertion failed on simulated load.' },
      { id: 'v-4', name: 'Validator Delta', gpu: 'GenVM H100 Node 4', status: 'REJECTED', confidence: 0.95, hash: '0x77cd...e1', verdictNote: 'Criteria not fulfilled. Rejection verdict dispatched.' },
      { id: 'v-5', name: 'Validator Epsilon', gpu: 'GenVM H100 Node 5', status: 'EQUIVALENT', confidence: 0.52, hash: '0x44aa...bc', verdictNote: 'Minor syntax match (minority dissenter).' }
    ]
  },
  {
    id: 'reject_malicious',
    title: 'Malicious Backdoor Attempt',
    desc: 'PR injects hidden arbitrary payout redirect in utility module.',
    expectedEquivalence: false,
    requiredQuorumPct: 80,
    nodes: [
      { id: 'v-1', name: 'Validator Alpha [Leader]', gpu: 'GenVM H100 Node 1', status: 'REJECTED', confidence: 0.99, hash: '0x3f1a...c8', verdictNote: 'Unauthorized state mutation detected outside scope.' },
      { id: 'v-2', name: 'Validator Beta', gpu: 'GenVM H100 Node 2', status: 'REJECTED', confidence: 0.99, hash: '0x99e2...04', verdictNote: 'Security invariant violated: suspicious recipient redirect.' },
      { id: 'v-3', name: 'Validator Gamma', gpu: 'GenVM H100 Node 3', status: 'REJECTED', confidence: 0.98, hash: '0x12bb...fd', verdictNote: 'Malicious diff pattern recognized by AST parser.' },
      { id: 'v-4', name: 'Validator Delta', gpu: 'GenVM H100 Node 4', status: 'REJECTED', confidence: 0.99, hash: '0x77cd...e1', verdictNote: 'Consensus rejection: slashing condition flagged.' },
      { id: 'v-5', name: 'Validator Epsilon', gpu: 'GenVM H100 Node 5', status: 'REJECTED', confidence: 0.98, hash: '0x44aa...bc', verdictNote: 'Diff rejected unanimously. Escrow retained.' }
    ]
  }
];

export function EquivalenceConsensusInteractive() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(100);

  const scenario = SCENARIOS[activeScenarioIdx];

  const handleSelectScenario = (idx: number) => {
    haptics.tick();
    setActiveScenarioIdx(idx);
    setIsEvaluating(true);
    setEvaluationProgress(20);

    setTimeout(() => {
      setEvaluationProgress(60);
      haptics.tick(0.2);
    }, 400);

    setTimeout(() => {
      setEvaluationProgress(100);
      setIsEvaluating(false);
      if (SCENARIOS[idx].expectedEquivalence) {
        haptics.success();
      } else {
        haptics.error();
      }
    }, 900);
  };

  const equivalentVotes = scenario.nodes.filter(n => n.status === 'EQUIVALENT').length;
  const agreementPct = Math.round((equivalentVotes / scenario.nodes.length) * 100);
  const isQuorumPassed = agreementPct >= scenario.requiredQuorumPct;

  return (
    <section className="py-20 border-b border-[#1e2436] bg-[#090b10] relative overflow-hidden">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6">
        {/* Section Marker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#131722] border border-[#1e2436] text-[10px] font-mono tracking-widest text-[#ff5500] uppercase mb-2">
              <span>SECTION 02 // BYZANTINE CONSENSUS ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
              GenVM Equivalence Principle Simulator
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#8a8f9d] mt-1 max-w-2xl">
              How non-deterministic LLM evaluation reaches 100% deterministic Byzantine consensus on code diffs without human arbiter risk.
            </p>
          </div>

          {/* Math formulation badge */}
          <div className="p-3 bg-[#0c0e14] border border-[#1e2436] rounded-lg font-mono text-xs text-[#8a8f9d]">
            <span className="text-[#00ff88] font-bold block mb-0.5">THE EQUIVALENCE FORMULA:</span>
            <span>Quorum = (Agreed Nodes / N) ≥ 80% ⇒ Deterministic Release</span>
          </div>
        </div>

        {/* Interactive Scenario Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {SCENARIOS.map((s, idx) => {
            const isSelected = idx === activeScenarioIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectScenario(idx)}
                className={`p-4 rounded-xl border text-left font-mono transition-all relative ${
                  isSelected
                    ? 'bg-[#131722] border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.2)]'
                    : 'bg-[#0c0e14] border-[#1e2436] hover:border-[#8a8f9d]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-[#e8e6df] flex items-center gap-2">
                    <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ff5500]' : 'text-[#8a8f9d]'}`} />
                    {s.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      s.expectedEquivalence
                        ? 'bg-[#00ff88]/10 text-[#00ff88]'
                        : 'bg-[#ff4444]/10 text-[#ff4444]'
                    }`}
                  >
                    {s.expectedEquivalence ? 'PASS' : 'REJECT'}
                  </span>
                </div>
                <p className="text-xs text-[#8a8f9d] font-sans leading-relaxed">
                  {s.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quorum Visualization Panel */}
        <div className="border border-[#1e2436] rounded-xl bg-[#07080c] p-6 lg:p-8 space-y-6 shadow-2xl">
          {/* Quorum Status Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2436]">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a8f9d] block mb-1">
                CONSENSUS QUORUM VERDICT
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-[#e8e6df]">
                  {isEvaluating ? 'EVALUATING QUORUM...' : isQuorumPassed ? 'CONSENSUS REACHED (5/5 EQUIVALENT)' : 'CONSENSUS REJECTED'}
                </span>
                {isQuorumPassed ? (
                  <CheckCircle2 className="w-6 h-6 text-[#00ff88]" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#ff4444]" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[#8a8f9d] block text-[10px] uppercase">Quorum Threshold</span>
                <span className="text-[#e8e6df] font-bold">≥ 80% (4/5 Nodes)</span>
              </div>
              <div>
                <span className="text-[#8a8f9d] block text-[10px] uppercase">Current Agreement</span>
                <span className={`font-bold text-base ${isQuorumPassed ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
                  {agreementPct}%
                </span>
              </div>
            </div>
          </div>

          {/* 5-Node Validator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {scenario.nodes.map((node, i) => {
              const isEquiv = node.status === 'EQUIVALENT';
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border font-mono transition-all ${
                    isEquiv
                      ? 'bg-[#00ff88]/[0.03] border-[#00ff88]/30 hover:border-[#00ff88]/60'
                      : 'bg-[#ff4444]/[0.03] border-[#ff4444]/30 hover:border-[#ff4444]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#e8e6df] truncate">
                      Node #{i + 1}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isEquiv ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#ff4444]/20 text-[#ff4444]'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#8a8f9d] block mb-2">{node.gpu}</span>

                  <p className="text-[10px] text-[#9da3b4] font-sans leading-tight line-clamp-3 mb-3">
                    "{node.verdictNote}"
                  </p>

                  <div className="pt-2 border-t border-[#1e2436]/60 flex items-center justify-between text-[10px]">
                    <span className="text-[#8a8f9d]">Conf:</span>
                    <span className={isEquiv ? 'text-[#00ff88]' : 'text-[#ffaa00]'}>
                      {(node.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Protocol Guarantee Note */}
          <div className="p-4 bg-[#0c0e14] border border-[#1e2436] rounded-lg flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#8a8f9d] gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff5500] shrink-0" />
              <span>
                GenVM guarantees zero human arbiter keys can withhold or redirect deposited bounty funds.
              </span>
            </div>
            <span className="text-[#e8e6df] shrink-0 font-bold">STUDIONET PROTOCOL INVARIANT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
