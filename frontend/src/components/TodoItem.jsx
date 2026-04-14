import { useState } from "react";
import { useToggleTodo } from "../hooks/useToggleTodo";
import { useUpdateTodo } from "../hooks/useUpdateTodo";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import "./TodoItem.css";

/**
 * TodoItem Component
 *
 * Represents a single todo with:
 * - Checkbox to toggle completion
 * - Text that can be edited (double-click)
 * - Delete button
 *
 * Demonstrates:
 * - Multiple blockchain interactions
 * - Edit mode with form submission
 * - Optimistic UI updates
 */
function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const { toggleTodo, isPending: isToggling } = useToggleTodo();
  const { updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { deleteTodo, isPending: isDeleting } = useDeleteTodo();

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() && editText !== todo.text) {
      await updateTodo(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTodo(todo.id);
    }
  };

  const isPending = isToggling || isUpdating || isDeleting;

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isPending}
      />

      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
          {todo.text}
        </span>
      )}

      <button className="delete-btn" onClick={handleDelete} disabled={isPending}>
        ✕
      </button>
    </div>
  );
}

export default TodoItem;
