import React, { useEffect, useRef } from 'react';

export function HeroVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const glow = glowRef.current;
    if (!svg || !glow) return;

    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 800;
      const y = ((e.clientY - rect.top) / rect.height) * 560;
      glow.setAttribute('cx', String(Math.max(0, Math.min(800, x))));
      glow.setAttribute('cy', String(Math.max(0, Math.min(560, y))));
    };

    svg.addEventListener('mousemove', onMove);
    return () => svg.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] max-w-[620px] mx-auto border border-[#1e2436] bg-[#080a0e] rounded-xl overflow-hidden shadow-2xl">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2436] bg-[#0c0e14]/90 text-[10px] font-mono tracking-widest text-[#8a8f9d]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
          <span>LIVE CONSENSUS TELEMETRY</span>
        </div>
        <span>QUORUM: 5/5 VALIDATORS</span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 560"
        className="w-full h-full block cursor-crosshair select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Git diffs flowing into GenLayer Equivalence Principle consensus engine"
      >
        <defs>
          <radialGradient id="gp-cursor-glow">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ff5500" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ff5500" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="gp-diff-stream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffaa00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.9" />
          </linearGradient>

          <filter id="gp-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <pattern
            id="gp-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width="800" height="560" fill="url(#gp-grid)" />

        {/* Interactive Ambient Cursor Glow */}
        <circle
          ref={glowRef}
          cx="400"
          cy="280"
          r="240"
          fill="url(#gp-cursor-glow)"
          pointerEvents="none"
        />

        {/* Git Tree Nodes & Diff Terminal (Left) */}
        <g className="git-sources" transform="translate(30, 60)">
          {/* Commit Timeline Spine */}
          <line x1="20" y1="20" x2="20" y2="420" stroke="#1e2436" strokeWidth="2" strokeDasharray="4 4" />

          {[
            { y: 40, commit: '0x8f2a1c', repo: 'genlayer/simulator', pr: '#104', tag: '+48 -12 lines' },
            { y: 130, commit: '0x99a4e2', repo: 'genlayer/js-sdk', pr: '#88', tag: '+124 -30 lines' },
            { y: 220, commit: '0x3c11f0', repo: 'genlayer/consensus', pr: '#212', tag: '+92 -8 lines' },
            { y: 310, commit: '0xaa78d5', repo: 'genlayer/contracts', pr: '#45', tag: '+63 -4 lines' },
            { y: 400, commit: '0x52be99', repo: 'genlayer/runtime', pr: '#19', tag: '+310 -88 lines' }
          ].map((item, i) => (
            <g key={i} transform={`translate(0, ${item.y})`}>
              {/* Commit node dot */}
              <circle cx="20" cy="0" r="5" fill="#ff5500" stroke="#080a0e" strokeWidth="2" />
              
              {/* Terminal code snippet bubble */}
              <rect
                x="38"
                y="-18"
                width="220"
                height="36"
                rx="4"
                fill="#0d111a"
                stroke="#1e2436"
                strokeWidth="1"
              />
              <text
                x="48"
                y="-3"
                fill="#ff5500"
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                fontWeight="700"
              >
                {item.repo} {item.pr}
              </text>
              <text
                x="48"
                y="11"
                fill="#8a8f9d"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
              >
                commit {item.commit} · {item.tag}
              </text>
            </g>
          ))}
        </g>

        {/* Curved Data Diff Streams into Consensus Core */}
        <g fill="none" stroke="url(#gp-diff-stream)" strokeWidth="1.5">
          {[
            'M 290 100 C 420 100, 430 260, 520 270',
            'M 290 190 C 410 190, 440 270, 520 280',
            'M 290 280 C 400 280, 450 280, 520 280',
            'M 290 370 C 410 370, 440 290, 520 290',
            'M 290 460 C 420 460, 430 300, 520 300'
          ].map((pathD, idx) => (
            <path
              key={idx}
              d={pathD}
              strokeDasharray="4 4"
              opacity="0.75"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="20"
                to="0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Animated Packets Moving on Curves */}
        <g fill="#00ff88">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} r="3" filter="url(#gp-soft-glow)">
              <animateMotion
                dur={`${2.2 + (i % 3) * 0.4}s`}
                repeatCount="indefinite"
                path={[
                  'M 290 100 C 420 100, 430 260, 520 270',
                  'M 290 190 C 410 190, 440 270, 520 280',
                  'M 290 280 C 400 280, 450 280, 520 280',
                  'M 290 370 C 410 370, 440 290, 520 290',
                  'M 290 460 C 420 460, 430 300, 520 300'
                ][i]}
              />
            </circle>
          ))}
        </g>

        {/* Consensus Engine Hexagonal Core (Right) */}
        <g transform="translate(540, 190)">
          {/* Outer Rotating Shield */}
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="#1e2436"
            strokeWidth="1.5"
            strokeDasharray="12 6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 90 90"
              to="360 90 90"
              dur="24s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Hexagonal Core Plate */}
          <polygon
            points="90,15 160,55 160,125 90,165 20,125 20,55"
            fill="#0c1018"
            stroke="#ff5500"
            strokeWidth="2"
          />

          {/* Inner Glowing Equivalence Emblem */}
          <circle cx="90" cy="90" r="32" fill="#131722" stroke="#00ff88" strokeWidth="1.5" />
          <text
            x="90"
            y="86"
            textAnchor="middle"
            fill="#e8e6df"
            fontFamily="Anton, Impact, sans-serif"
            fontSize="18"
            letterSpacing="0.08em"
          >
            GEN
          </text>
          <text
            x="90"
            y="102"
            textAnchor="middle"
            fill="#00ff88"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fontWeight="700"
          >
            VERIFIED
          </text>

          {/* Disbursed Escrow Beam */}
          <path
            d="M 160 90 L 220 90"
            stroke="#00ff88"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#gp-soft-glow)"
          />
          <text
            x="225"
            y="94"
            fill="#00ff88"
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            fontWeight="700"
          >
            0.50 GEN ↗
          </text>
        </g>
      </svg>

      {/* Bottom ticker banner */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#1e2436] bg-[#0c0e14]/90 text-[10px] font-mono text-[#8a8f9d]">
        <span>METHOD: EQUIVALENCE_PRINCIPLE()</span>
        <span className="text-[#00ff88]">ZERO HUMAN INTERMEDIARIES</span>
      </div>
    </div>
  );
}
