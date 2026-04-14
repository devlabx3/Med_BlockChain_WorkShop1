import { useTodos } from "../hooks/useTodos";
import TodoItem from "./TodoItem";
import "./TodoList.css";

/**
 * TodoList Component
 *
 * Displays all todos for the connected wallet.
 * Filters out soft-deleted items (exists=false).
 * Demonstrates:
 * - Reading data from blockchain
 * - Loading states
 * - Rendering lists
 */
function TodoList() {
  const { data: todos = [], isLoading } = useTodos();

  // Filter out deleted todos (soft delete)
  const activeTodos = todos.filter((todo) => todo.exists);

  if (isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (activeTodos.length === 0) {
    return <div className="empty-list">No tasks yet. Create one to get started!</div>;
  }

  return (
    <div className="todo-list">
      {activeTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;
