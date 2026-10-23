import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder,
  FolderOpen,
  FileCode2,
  GitPullRequest,
  ArrowUpRight,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal,
  Clock,
  Coins
} from 'lucide-react';
import { Bounty } from '../types';
import { haptics } from '../lib/haptics';

interface BountyLedgerWorkspaceProps {
  bounties: Bounty[];
}

interface RepoFile {
  name: string;
  path: string;
  bountyId?: number;
  statusTag: 'MODIFIED' | 'ADDED' | 'AUDITED';
}

const REPO_FILES: { folder: string; files: RepoFile[] }[] = [
  {
    folder: 'contracts/escrow',
    files: [
      { name: 'bounty_escrow.py', path: 'contracts/escrow/bounty_escrow.py', bountyId: 1, statusTag: 'MODIFIED' },
      { name: 'equivalence_oracle.py', path: 'contracts/escrow/equivalence_oracle.py', bountyId: 2, statusTag: 'AUDITED' }
    ]
  },
  {
    folder: 'engine/consensus',
    files: [
      { name: 'byzantine_quorum.py', path: 'engine/consensus/byzantine_quorum.py', bountyId: 3, statusTag: 'MODIFIED' },
      { name: 'ast_analyzer.py', path: 'engine/consensus/ast_analyzer.py', statusTag: 'AUDITED' }
    ]
  },
  {
    folder: 'tests/studionet',
    files: [
      { name: 'test_memory_leak.py', path: 'tests/studionet/test_memory_leak.py', bountyId: 1, statusTag: 'ADDED' },
      { name: 'test_websocket_reconnect.py', path: 'tests/studionet/test_websocket_reconnect.py', bountyId: 2, statusTag: 'ADDED' }
    ]
  }
];

export function BountyLedgerWorkspace({ bounties }: BountyLedgerWorkspaceProps) {
  const [selectedBountyId, setSelectedBountyId] = useState<number>(bounties[0]?.id || 1);
  const [filterState, setFilterState] = useState<'ALL' | 'OPEN' | 'CLAIMED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'contracts/escrow': true,
    'engine/consensus': true,
    'tests/studionet': true
  });

  const toggleFolder = (folder: string) => {
    haptics.tick();
    setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const selectedBounty = bounties.find(b => b.id === selectedBountyId) || bounties[0];

  const filteredBounties = bounties.filter(b => {
    if (filterState === 'OPEN' && b.status !== 'OPEN') return false;
    if (filterState === 'CLAIMED' && b.status !== 'CLAIMED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.repo_name.toLowerCase().includes(q) ||
        b.acceptance_criteria.toLowerCase().includes(q) ||
        b.id.toString().includes(q)
      );
    }
    return true;
  });

  const handleSelectBounty = (id: number) => {
    haptics.tick();
    setSelectedBountyId(id);
  };

  return (
    <section className="py-20 border-b border-[#1e2436] bg-[#07090e]">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#131722] border border-[#1e2436] text-[10px] font-mono tracking-widest text-[#ff5500] uppercase mb-2">
              <span>SECTION 01 // HIGH-DENSITY LEDGER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
              Repository Milestones & Live Bounties
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#8a8f9d] mt-1">
              Deterministic escrowed deliverables bound to GitHub pull requests and verified in GenVM quorum.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8a8f9d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search repo, criteria, id..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0e111a] border border-[#1e2436] focus:border-[#ff5500] text-xs font-mono text-[#e8e6df] rounded outline-none placeholder:text-[#8a8f9d]/50 w-56 transition-colors"
              />
            </div>

            <div className="inline-flex border border-[#1e2436] bg-[#0e111a] rounded p-0.5 text-xs font-mono">
              {(['ALL', 'OPEN', 'CLAIMED'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    haptics.tick();
                    setFilterState(mode);
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    filterState === mode
                      ? 'bg-[#ff5500] text-white font-bold'
                      : 'text-[#8a8f9d] hover:text-[#e8e6df]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Workspace Frame */}
        <div className="border border-[#1e2436] rounded-xl bg-[#090b10] overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1e2436] shadow-2xl">
          {/* Left Column: Interactive File Tree (3 cols) */}
          <div className="lg:col-span-3 bg-[#08090d] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2436] mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#ff5500]" />
                  Repo File Tree
                </span>
                <span className="text-[10px] font-mono text-[#ffaa00] font-bold">GENLAYER / CORE</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {REPO_FILES.map((group) => {
                  const isOpen = !!openFolders[group.folder];
                  return (
                    <div key={group.folder} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleFolder(group.folder)}
                        className="w-full flex items-center gap-1.5 text-left text-[#8a8f9d] hover:text-[#e8e6df] py-1 px-1.5 rounded transition-colors"
                      >
                        {isOpen ? (
                          <FolderOpen className="w-3.5 h-3.5 text-[#ff5500]" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-[#8a8f9d]" />
                        )}
                        <span className="text-[11px] font-medium">{group.folder}</span>
                      </button>

                      {isOpen && (
                        <div className="pl-4 space-y-0.5 border-l border-[#1e2436]/60 ml-2">
                          {group.files.map((file) => {
                            const isLinked = file.bountyId === selectedBountyId;
                            return (
                              <button
                                key={file.path}
                                type="button"
                                onClick={() => file.bountyId && handleSelectBounty(file.bountyId)}
                                className={`w-full flex items-center justify-between py-1 px-2 rounded text-[11px] text-left transition-colors ${
                                  isLinked
                                    ? 'bg-[#ff5500]/15 text-[#ff5500] font-bold'
                                    : 'text-[#9da3b4] hover:bg-[#131722] hover:text-[#e8e6df]'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <FileCode2 className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </span>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                    file.statusTag === 'MODIFIED'
                                      ? 'text-[#ffaa00] bg-[#ffaa00]/10'
                                      : file.statusTag === 'ADDED'
                                      ? 'text-[#00ff88] bg-[#00ff88]/10'
                                      : 'text-[#8a8f9d] bg-[#1e2436]'
                                  }`}
                                >
                                  {file.statusTag === 'MODIFIED' ? 'MOD' : file.statusTag === 'ADDED' ? 'NEW' : 'AUD'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e2436] mt-4 font-mono text-[10px] text-[#8a8f9d]">
              <div className="flex items-center justify-between">
                <span>AST Parser Engine:</span>
                <span className="text-[#00ff88]">Python 3.11 GenVM</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Byzantine Tolerance:</span>
                <span className="text-[#e8e6df]">3f + 1 Quorum</span>
              </div>
            </div>
          </div>

          {/* Center Column: Live Bounty Ledger (5 cols) */}
          <div className="lg:col-span-5 bg-[#090b10] flex flex-col justify-between">
            <div>
              <div className="px-4 py-3 border-b border-[#1e2436] bg-[#0c0e14] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8a8f9d]">
                  MATCHING BOUNTIES: <strong className="text-[#e8e6df]">{filteredBounties.length}</strong>
                </span>
                <span className="text-[10px] text-[#8a8f9d]">SELECT ROW TO INSPECT</span>
              </div>

              <div className="divide-y divide-[#1e2436] max-h-[520px] overflow-y-auto">
                {filteredBounties.map((b) => {
                  const isSelected = b.id === selectedBountyId;
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBounty(b.id)}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#131722] border-l-2 border-[#ff5500]'
                          : 'hover:bg-[#0f121a] border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#ff5500]">
                            #{b.id}
                          </span>
                          <span className="font-mono text-xs text-[#8a8f9d] truncate max-w-[140px] sm:max-w-[200px]">
                            {b.repo_name} #{b.issue_number}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                            b.status === 'OPEN'
                              ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30'
                              : 'bg-[#1e2436] text-[#8a8f9d]'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#e8e6df] font-sans line-clamp-2 leading-relaxed mb-3">
                        {b.acceptance_criteria}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#1e2436]/50">
                        <span className="text-[#ff5500] font-bold text-sm">
                          {b.payout_formatted}
                        </span>
                        <span className="text-[#8a8f9d] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#ffaa00]" />
                          Expires Epoch {b.expiry_epoch}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-[#1e2436] bg-[#0c0e14] flex items-center justify-between text-xs font-mono">
              <span className="text-[#8a8f9d]">Need custom issue criteria?</span>
              <Link
                to="/bounties/new"
                onClick={() => haptics.click()}
                className="text-[#ff5500] hover:underline font-bold flex items-center gap-1"
              >
                <span>+ Create Bounty</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Active Dossier & Verification Preview (4 cols) */}
          <div className="lg:col-span-4 bg-[#07080c] p-5 flex flex-col justify-between">
            {selectedBounty ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8f9d] mb-2 uppercase">
                    <span>SPECIFICATION INSPECTOR</span>
                    <span className="text-[#ff5500]">BOUNTY #{selectedBounty.id}</span>
                  </div>

                  <h3 className="text-lg font-display uppercase font-normal text-[#e8e6df] mb-1">
                    {selectedBounty.repo_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f9d]">
                    <span>Issue Milestone: #{selectedBounty.issue_number}</span>
                    <span>·</span>
                    <span className="text-[#00ff88]">Studionet 61997</span>
                  </div>
                </div>

                {/* Frozen Criteria Box */}
                <div className="border border-[#1e2436] bg-[#0c0e14] rounded-lg p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-[#ffaa00] tracking-wider uppercase block font-bold">
                    FROZEN ACCEPTANCE CRITERIA
                  </span>
                  <p className="font-mono text-xs text-[#cfd3dc] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {selectedBounty.acceptance_criteria}
                  </p>
                </div>

                {/* Contract Spec Details */}
                <div className="space-y-2 text-xs font-mono border-t border-[#1e2436] pt-3">
                  <div className="flex items-center justify-between text-[#8a8f9d]">
                    <span>Escrow Amount:</span>
                    <strong className="text-base text-[#ff5500]">{selectedBounty.payout_formatted}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#8a8f9d]">
                    <span>Sponsor Address:</span>
                    <span className="text-[#e8e6df] truncate max-w-[150px]">
                      {selectedBounty.sponsor.slice(0, 8)}...{selectedBounty.sponsor.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#8a8f9d]">
                    <span>Created Epoch:</span>
                    <span className="text-[#e8e6df]">Epoch #{selectedBounty.created_epoch}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8a8f9d]">
                    <span>Verification Mode:</span>
                    <span className="text-[#00ff88]">Deterministic AST Quorum</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <Link
                    to={`/bounties/${selectedBounty.id}`}
                    onClick={() => haptics.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-mono text-xs uppercase font-bold rounded-lg tracking-wider transition-all shadow-[0_0_20px_rgba(255,85,0,0.25)]"
                  >
                    <span>Inspect Full Dossier</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#8a8f9d] font-mono text-xs">
                Select a bounty from the ledger to inspect verification criteria.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#1e2436] flex items-center justify-between text-[10px] font-mono text-[#8a8f9d]">
              <span>ZERO HUMAN ARBITRATION</span>
              <span className="text-[#00ff88] font-bold">GENLAYER NATIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
