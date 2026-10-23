import React from 'react';
import { GitPullRequest, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] py-12 px-4 sm:px-6 select-none">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#9499a8]">
        
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-[#0c0e14] border border-white/[0.08] flex items-center justify-center text-[#ff6b00]">
            <GitPullRequest className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans font-bold text-sm text-white">GitProof</span>
          <span className="text-[#5e6475]">·</span>
          <span>Autonomous Code Milestone Escrow</span>
        </div>

        {/* Right: Clean Resource Links */}
        <div className="flex items-center space-x-6 text-xs">
          <a
            href="https://genlayer.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>Powered by GenLayer</span>
            <ExternalLink className="w-3 h-3 text-[#5e6475]" />
          </a>
          <a
            href="https://github.com/genlayer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
