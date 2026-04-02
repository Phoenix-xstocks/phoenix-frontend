import { useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { inkSepolia } from '@/lib/chains';

export function useEnsureChain() {
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const ensureChain = useCallback(async () => {
    if (chainId !== inkSepolia.id) {
      await switchChainAsync({ chainId: inkSepolia.id });
    }
  }, [chainId, switchChainAsync]);

  const isWrongChain = chainId !== inkSepolia.id;

  return { ensureChain, isWrongChain };
}
