import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, ExternalLink, Code2 } from 'lucide-react';
import { SectionMarker } from './Editorial';
import { Bounty } from '../types';

export function CuratedProjects({
  bounties,
  onSubmitPrClick
}: {
  bounties: Bounty[];
  onSubmitPrClick: (bounty: Bounty) => void;
}) {
  return (
    <section id="projects" className="border-b border-[#1e2436] bg-[#0c0e14] py-20">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <SectionMarker number="03" label="Featured Repositories" />
            <h2 className="text-3xl sm:text-5xl font-display font-normal uppercase tracking-wider text-[#e8e6df]">
              A Selection of Active Projects
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#8a8f9d] mt-3 md:mt-0">
            Real Pull Request Diffs Evaluated On-Chain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-[#1e2436] bg-[#090b10] flex flex-col justify-between group hover:border-[#ff5500] transition-colors">
            {/* Header diff */}
            <div className="bg-[#050608] p-5 font-mono text-[11px] text-[#8a8f9d] space-y-1.5 h-48 flex flex-col justify-between overflow-hidden border-b border-[#1e2436]">
              <div className="flex items-center justify-between text-[#8a8f9d] pb-2 border-b border-[#1e2436]">
                <span className="flex items-center space-x-1.5 text-[#e8e6df]">
                  <Github className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>genlayer-simulator</span>
                </span>
                <span className="text-[#ff5500] font-bold">#104</span>
              </div>
              <div className="space-y-1 opacity-90 text-[10.5px]">
                <div className="text-[#8a8f9d]">@@ -45,6 +45,18 @@</div>
                <div className="text-[#ff4444]">- poll_round_fallback()</div>
                <div className="text-[#00ff88]">+ async def stream_consensus(round_id):</div>
                <div className="text-[#00ff88]">+   ws = await connect_socket()</div>
                <div className="text-[#00ff88]">+   assert ws.is_alive()</div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#8a8f9d] pt-2 border-t border-[#1e2436]">
                <span>3 files changed</span>
                <span className="text-[#00ff88]">+142 / -18</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] mb-2">
                  <span>WebSocket Core</span>
                  <span>•</span>
                  <span>Python</span>
                </div>
                <h3 className="text-base font-sans font-bold text-[#e8e6df] leading-snug group-hover:text-white transition-colors">
                  WebSocket subscription for validator consensus rounds
                </h3>
                <p className="text-xs font-sans text-[#8a8f9d] mt-2 line-clamp-2">
                  Zero memory leaks, persistent heartbeat, and simulated network disconnect test coverage.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2436]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] block">Escrow Reward</span>
                  <span className="text-lg font-bold font-mono text-[#ff5500]">0.2500 GEN</span>
                </div>
                <Link
                  to="/bounties/1"
                  className="px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider bg-[#131722] hover:bg-[#ff5500] hover:text-white text-[#e8e6df] border border-[#1e2436] hover:border-[#ff5500] flex items-center space-x-1.5 transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-[#1e2436] bg-[#090b10] flex flex-col justify-between group hover:border-[#ff5500] transition-colors">
            <div className="bg-[#050608] p-5 font-mono text-[11px] text-[#8a8f9d] space-y-1.5 h-48 flex flex-col justify-between overflow-hidden border-b border-[#1e2436]">
              <div className="flex items-center justify-between text-[#8a8f9d] pb-2 border-b border-[#1e2436]">
                <span className="flex items-center space-x-1.5 text-[#e8e6df]">
                  <Github className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>genlayer-js</span>
                </span>
                <span className="text-[#ff5500] font-bold">#88</span>
              </div>
              <div className="space-y-1 opacity-90 text-[10.5px]">
                <div className="text-[#8a8f9d]">@@ -112,4 +112,12 @@</div>
                <div className="text-[#00ff88]">+ export function subscribeRounds(callback) &#123;</div>
                <div className="text-[#00ff88]">+   return wsClient.connect(callback);</div>
                <div className="text-[#00ff88]">+ &#125;</div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#8a8f9d] pt-2 border-t border-[#1e2436]">
                <span>2 files changed</span>
                <span className="text-[#00ff88]">+64 / -6</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] mb-2">
                  <span>TypeScript SDK</span>
                  <span>•</span>
                  <span>Node / Browser</span>
                </div>
                <h3 className="text-base font-sans font-bold text-[#e8e6df] leading-snug group-hover:text-white transition-colors">
                  Client WebSocket wrapper for Studio Dev rounds
                </h3>
                <p className="text-xs font-sans text-[#8a8f9d] mt-2 line-clamp-2">
                  Reconnect backoff with jitter and heartbeats for long-lived browser sessions.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2436]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] block">Escrow Reward</span>
                  <span className="text-lg font-bold font-mono text-[#ff5500]">0.4000 GEN</span>
                </div>
                <Link
                  to="/bounties/2"
                  className="px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider bg-[#131722] hover:bg-[#ff5500] hover:text-white text-[#e8e6df] border border-[#1e2436] hover:border-[#ff5500] flex items-center space-x-1.5 transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-[#1e2436] bg-[#090b10] flex flex-col justify-between group hover:border-[#ff5500] transition-colors">
            <div className="bg-[#050608] p-5 font-mono text-[11px] text-[#8a8f9d] space-y-1.5 h-48 flex flex-col justify-between overflow-hidden border-b border-[#1e2436]">
              <div className="flex items-center justify-between text-[#8a8f9d] pb-2 border-b border-[#1e2436]">
                <span className="flex items-center space-x-1.5 text-[#e8e6df]">
                  <Github className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>consensus-engine</span>
                </span>
                <span className="text-[#ff5500] font-bold">#212</span>
              </div>
              <div className="space-y-1 opacity-90 text-[10.5px]">
                <div className="text-[#8a8f9d]">@@ -89,5 +89,14 @@</div>
                <div className="text-[#ff4444]">- sync_poll_validators()</div>
                <div className="text-[#00ff88]">+ async def nonblocking_quorum_eval():</div>
                <div className="text-[#00ff88]">+   tasks = [v.eval() for v in quorum]</div>
                <div className="text-[#00ff88]">+   return await asyncio.gather(*tasks)</div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#8a8f9d] pt-2 border-t border-[#1e2436]">
                <span>5 files changed</span>
                <span className="text-[#00ff88]">+210 / -45</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] mb-2">
                  <span>Async IO</span>
                  <span>•</span>
                  <span>Rust / Python</span>
                </div>
                <h3 className="text-base font-sans font-bold text-[#e8e6df] leading-snug group-hover:text-white transition-colors">
                  Refactor synchronous polling into non-blocking asyncio
                </h3>
                <p className="text-xs font-sans text-[#8a8f9d] mt-2 line-clamp-2">
                  Eliminates event loop contention during high-frequency Equivalence Principle rounds.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2436]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f9d] block">Escrow Reward</span>
                  <span className="text-lg font-bold font-mono text-[#ff5500]">0.5000 GEN</span>
                </div>
                <Link
                  to="/bounties/3"
                  className="px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider bg-[#131722] hover:bg-[#ff5500] hover:text-white text-[#e8e6df] border border-[#1e2436] hover:border-[#ff5500] flex items-center space-x-1.5 transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
