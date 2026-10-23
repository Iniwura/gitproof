import React from 'react';
import { X, Wallet, Shield, ExternalLink, Check, Copy } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { GENLAYER_CONFIG } from '../services/genlayer';
import { haptics } from '../lib/haptics';

export function WalletModal() {
  const {
    isConnected,
    address,
    balance,
    walletType,
    isConnecting,
    connectMetaMask,
    connectGenLayer,
    disconnect,
    showModal,
    setShowModal,
  } = useWallet();

  const [copied, setCopied] = React.useState(false);

  if (!showModal) return null;

  const handleCopy = () => {
    if (!address) return;
    haptics.tick();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a0c10] border border-white/[0.1] rounded-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-white">
                {isConnected ? 'Connected Wallet' : 'Connect to GenLayer'}
              </h3>
              <span className="text-[11px] font-mono text-[#9499a8]">GenLayer Network</span>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.tick();
              setShowModal(false);
            }}
            className="p-1 rounded-lg text-[#9499a8] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isConnected ? (
          <div className="py-5 space-y-4 font-mono text-xs">
            {/* Account Card */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-[#9499a8] text-[11px]">
                <span className="uppercase">Provider: {walletType === 'metamask' ? 'MetaMask' : 'GenLayer Key'}</span>
                <span className="text-[#10b981] font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span>ONLINE</span>
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-white text-xs truncate max-w-[240px] font-mono">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-[#9499a8] hover:text-white flex items-center space-x-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#10b981]" />
                      <span className="text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#9499a8]">Available Balance:</span>
                <span className="text-[#ff6b00] font-bold text-sm">{balance}</span>
              </div>
            </div>

            {/* Links & Faucet */}
            <div className="flex items-center justify-between text-[11px] text-[#9499a8] px-1">
              <a
                href="https://studio.genlayer.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>GenLayer Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://faucet.genlayer.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#ff6b00] hover:underline flex items-center space-x-1"
              >
                <span>Get Testnet GEN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Disconnect */}
            <button
              onClick={() => {
                disconnect();
                setShowModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] text-[#9499a8] font-sans text-xs font-semibold transition-all"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="py-5 space-y-3 font-sans">
            {/* MetaMask Option */}
            <button
              onClick={() => connectMetaMask()}
              disabled={isConnecting}
              className="w-full p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#ff6b00]/50 transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#f6851b]/15 border border-[#f6851b]/30 flex items-center justify-center text-[#f6851b] font-bold text-sm">
                  🦊
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#ff8833] transition-colors">
                    Browser Wallet / MetaMask
                  </div>
                  <div className="text-xs text-[#9499a8]">Connect with MetaMask extension on Studionet</div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#5e6475] group-hover:text-white transition-colors">→</span>
            </button>

            {/* GenLayer Studionet Account Option */}
            <button
              onClick={() => connectGenLayer()}
              disabled={isConnecting}
              className="w-full p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#ff6b00]/50 transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#ff8833] transition-colors">
                    GenLayer Studionet Key
                  </div>
                  <div className="text-xs text-[#9499a8]">Native private key account (zero extension required)</div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#5e6475] group-hover:text-white transition-colors">→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
