import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TODO_LIST_ABI, CONTRACT_ADDRESS } from "../config/abi";

/**
 * useDeleteTodo Hook
 *
 * Deletes (soft-delete) a todo from the contract.
 *
 * Returns:
 * - deleteTodo(id): function to delete a todo
 * - isPending: true while transaction is pending
 * - error: any errors
 */
export function useDeleteTodo() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deleteTodo = (id) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: "deleteTodo",
      args: [id],
    });
  };

  return { deleteTodo, isPending, isConfirming, isSuccess, error };
}
