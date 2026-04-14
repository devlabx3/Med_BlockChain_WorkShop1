import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TODO_LIST_ABI, CONTRACT_ADDRESS } from "../config/abi";

/**
 * useUpdateTodo Hook
 *
 * Updates the text of an existing todo.
 *
 * Returns:
 * - updateTodo(id, newText): function to update a todo
 * - isPending: true while transaction is pending
 * - error: any errors
 */
export function useUpdateTodo() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const updateTodo = (id, newText) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: "updateTodo",
      args: [id, newText],
    });
  };

  return { updateTodo, isPending, isConfirming, isSuccess, error };
}
