import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({
  value,
  label = 'copy',
  className = ''
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#8a8f9d] hover:text-[#e8e6df] border border-[#1e2436] hover:border-[#e8e6df] bg-[#131722] transition-colors ${className}`}
      title={`Copy: ${value}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-[#00ff88]" />
          <span className="text-[#00ff88]">copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
