'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { shortenAddress } from '@/lib/format';

export function ConnectWallet() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white/50 opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (authenticated && wallets.length > 0) {
    return (
      <button
        onClick={logout}
        className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors"
      >
        {shortenAddress(wallets[0].address)}
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
