import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TODO_LIST_ABI, CONTRACT_ADDRESS } from "../config/abi";

/**
 * useToggleTodo Hook
 *
 * Toggles the completed status of a todo.
 * Same pattern as useAddTodo but with different function.
 *
 * Returns:
 * - toggleTodo(id): function to toggle a todo
 * - isPending: true while transaction is pending
 * - error: any errors
 */
export function useToggleTodo() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const toggleTodo = (id) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: "toggleTodo",
      args: [id],
    });
  };

  return { toggleTodo, isPending, isConfirming, isSuccess, error };
}
