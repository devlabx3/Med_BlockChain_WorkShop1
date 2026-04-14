import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TODO_LIST_ABI, CONTRACT_ADDRESS } from "../config/abi";

/**
 * useAddTodo Hook
 *
 * Writes a new todo to the smart contract.
 * Handles the full transaction lifecycle: pending → confirmed.
 *
 * Returns:
 * - addTodo(text): function to add a todo
 * - isPending: true while transaction is being sent
 * - isConfirming: true while waiting for blockchain confirmation
 * - isSuccess: true after transaction confirmed
 * - error: any errors
 */
export function useAddTodo() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash });

  const addTodo = (text) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: "addTodo",
      args: [text],
    });
  };

  return { addTodo, isPending, isConfirming, isSuccess, error };
}
