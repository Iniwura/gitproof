import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BountyStatus, ClaimStatus } from '../types';

export function EditorialLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a8f9d] mb-2 ${className}`.trim()}>
      {children}
    </p>
  );
}

export function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center space-x-3 mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a8f9d]">
      <span className="text-[#ff5500] font-bold">{number}</span>
      <span className="h-3 w-px bg-[#1e2436]" />
      <span>{label}</span>
    </div>
  );
}

export function EditorialButton({
  onClick,
  href,
  children,
  variant = 'orange',
  className = ''
}: {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  variant?: 'orange' | 'dark' | 'light';
  className?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2.5 px-5 py-3 text-xs font-mono uppercase font-bold tracking-widest transition-all cursor-pointer group border';
  const styles = {
    orange: 'bg-[#ff5500] text-white border-[#ff5500] hover:bg-[#ff6e22] shadow-[0_0_15px_rgba(255,85,0,0.25)]',
    dark: 'bg-[#131722] text-[#e8e6df] border-[#1e2436] hover:border-[#e8e6df]',
    light: 'bg-transparent text-[#e8e6df] border-[#1e2436] hover:border-[#ff5500] hover:bg-[#ff5500]/10'
  }[variant];

  if (href) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`.trim()}>
        <span>{children}</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`.trim()}>
      <span>{children}</span>
      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}

export function GridFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1500px] mx-auto px-6 w-full ${className}`.trim()}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: BountyStatus | ClaimStatus | string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',
    CLAIMED: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30',
    REFUNDED: 'bg-[#8a8f9d]/10 text-[#8a8f9d] border-[#8a8f9d]/30',
    DISPUTED: 'bg-[#ff4444]/10 text-[#ff4444] border-[#ff4444]/30',
    PENDING: 'bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/30',
    ACCEPTED: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',
    REJECTED: 'bg-[#ff4444]/10 text-[#ff4444] border-[#ff4444]/30'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border rounded-none ${
        styles[status] || 'bg-[#1e2436] text-[#8a8f9d] border-[#1e2436]'
      }`}
    >
      {status}
    </span>
  );
}
