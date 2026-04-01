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
        className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-2 text-muted border border-border opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (authenticated && wallets.length > 0) {
    return (
      <button
        onClick={logout}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-2 text-white border border-border hover:bg-border transition-colors"
      >
        {shortenAddress(wallets[0].address)}
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-accent hover:bg-accent-dim text-white transition-colors"
    >
      Connect Wallet
    </button>
  );
}
