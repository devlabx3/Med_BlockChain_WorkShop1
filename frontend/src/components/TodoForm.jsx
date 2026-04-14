import { useState } from "react";
import { useAddTodo } from "../hooks/useAddTodo";
import "./TodoForm.css";

/**
 * TodoForm Component
 *
 * Form to create a new todo.
 * Demonstrates:
 * - Controlled input (state management)
 * - Calling a blockchain write function
 * - Showing loading state while transaction is pending
 */
function TodoForm() {
  const [text, setText] = useState("");
  const { addTodo, isPending, isSuccess } = useAddTodo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await addTodo(text);
      setText("");
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new task..."
        disabled={isPending}
      />
      <button type="submit" disabled={isPending || !text.trim()}>
        {isPending ? "Adding..." : "Add Task"}
      </button>
      {isSuccess && <p className="success-message">✓ Task added!</p>}
    </form>
  );
}

export default TodoForm;
