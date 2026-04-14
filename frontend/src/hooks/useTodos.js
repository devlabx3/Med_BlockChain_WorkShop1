import { useReadContract, useAccount } from "wagmi";
import { TODO_LIST_ABI, CONTRACT_ADDRESS } from "../config/abi";

/**
 * useTodos Hook
 *
 * Reads all todos for the connected wallet.
 * Re-fetches every 4 seconds to stay in sync with blockchain.
 *
 * Returns:
 * - data: array of todos
 * - isLoading: true while fetching
 * - error: any errors
 */
export function useTodos() {
  const { address, isConnected } = useAccount();

  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTodos",
    query: {
      enabled: isConnected && !!CONTRACT_ADDRESS,
      refetchInterval: 4000, // Refetch every 4 seconds
    },
  });
}
