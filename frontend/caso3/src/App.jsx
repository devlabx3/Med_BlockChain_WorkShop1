// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Interacción con el contrato TodoList
//
// Flujo:
//   1. El usuario conecta su wallet (ConnectButton de RainbowKit)
//   2. La app lee la lista de todos del contrato (getTodos)
//   3. El usuario puede agregar, completar, editar y eliminar todos
//
// Cada acción de escritura sigue el mismo patrón:
//   writeContract() → esperar hash → isSuccess → refetch()
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TODOLIST_CONTRACT_ADDRESS, TODOLIST_ABI } from "./config";

export default function App() {

  // ── Paso 1: saber si hay wallet conectada ──────────────────────────────────
  const { isConnected, address } = useAccount();

  // ── Paso 2: leer la lista de todos del contrato ───────────────────────────
  // getTodos devuelve solo los todos del msg.sender (la wallet conectada).
  // Sin wallet conectada, el contrato devuelve un array vacío.
  const {
    data: todos,      // array de { id, text, completed }
    isLoading,
    refetch,
  } = useReadContract({
    address: TODOLIST_CONTRACT_ADDRESS,
    abi: TODOLIST_ABI,
    functionName: "getTodos",
    account: address, // importante: msg.sender = wallet conectada
  });

  // ── Paso 3: acciones de escritura ─────────────────────────────────────────
  // Cada acción usa su propio writeContract para rastrear su estado por separado.
  // isPending = esperando firma; txHash = transacción enviada.
  const { writeContract, isPending, data: txHash } = useWriteContract();

  // Esperar confirmación de cualquier transacción enviada
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Cuando la tx se confirma, refrescar la lista de todos
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setToast({ type: "success", msg: "¡Transacción confirmada!" });
    }
  }, [isSuccess]);

  // ── Estado local ───────────────────────────────────────────────────────────
  const [newText, setNewText] = useState("");         // input para nuevo todo
  const [editingId, setEditingId] = useState(null);  // id del todo en edición
  const [editText, setEditText] = useState("");       // texto editado
  const [toast, setToast] = useState(null);           // { type, msg }

  // Auto-cerrar el toast después de 3 segundos
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Handlers de acciones del contrato ─────────────────────────────────────

  // Agregar un nuevo todo
  function handleAdd(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    writeContract({
      address: TODOLIST_CONTRACT_ADDRESS,
      abi: TODOLIST_ABI,
      functionName: "addTodo",
      args: [newText.trim()],
    });
    setNewText("");
  }

  // Marcar/desmarcar un todo como completado
  function handleToggle(id) {
    writeContract({
      address: TODOLIST_CONTRACT_ADDRESS,
      abi: TODOLIST_ABI,
      functionName: "toggleTodo",
      args: [id],
    });
  }

  // Guardar el texto editado de un todo
  function handleUpdate(id) {
    if (!editText.trim()) return;
    writeContract({
      address: TODOLIST_CONTRACT_ADDRESS,
      abi: TODOLIST_ABI,
      functionName: "updateTodo",
      args: [id, editText.trim()],
    });
    setEditingId(null);
  }

  // Eliminar un todo
  function handleDelete(id) {
    writeContract({
      address: TODOLIST_CONTRACT_ADDRESS,
      abi: TODOLIST_ABI,
      functionName: "deleteTodo",
      args: [id],
    });
  }

  // Entrar en modo edición de un todo
  function startEdit(todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  // Cancelar edición
  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">TodoList</h1>
        <p className="subtitle">Tu lista de tareas en la blockchain</p>

        {/* Botón de conexión de wallet */}
        <div className="connect-row">
          <ConnectButton />
        </div>

        {/* Sección principal: lista + formulario */}
        {isConnected ? (
          <>
            {/* Formulario para agregar un nuevo todo */}
            <form className="add-form" onSubmit={handleAdd}>
              <input
                className="store-input"
                type="text"
                placeholder="Nueva tarea…"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                disabled={isPending || isConfirming}
              />
              <button
                className="store-button"
                type="submit"
                disabled={isPending || isConfirming || !newText.trim()}
              >
                {isPending || isConfirming ? "…" : "Agregar"}
              </button>
            </form>

            {/* Estado de la transacción actual */}
            {isPending    && <p className="tx-status">⏳ Esperando firma…</p>}
            {isConfirming && <p className="tx-status">⛏️ Confirmando…</p>}

            {/* Lista de todos */}
            <ul className="todo-list">
              {isLoading && (
                <li className="todo-empty">Cargando…</li>
              )}
              {!isLoading && (!todos || todos.length === 0) && (
                <li className="todo-empty">No tienes tareas aún</li>
              )}
              {todos && todos.map((todo) => (
                <li key={todo.id.toString()} className="todo-item">

                  {editingId === todo.id ? (
                    // ── Modo edición ────────────────────────────────────────
                    <div className="edit-row">
                      <input
                        className="store-input"
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="btn-icon btn-save"
                        onClick={() => handleUpdate(todo.id)}
                        disabled={isPending || isConfirming}
                        title="Guardar"
                      >✓</button>
                      <button
                        className="btn-icon btn-cancel"
                        onClick={cancelEdit}
                        title="Cancelar"
                      >✕</button>
                    </div>
                  ) : (
                    // ── Modo normal ─────────────────────────────────────────
                    <>
                      {/* Checkbox para toggle */}
                      <button
                        className={`btn-check ${todo.completed ? "checked" : ""}`}
                        onClick={() => handleToggle(todo.id)}
                        disabled={isPending || isConfirming}
                        title={todo.completed ? "Marcar pendiente" : "Marcar completado"}
                      >
                        {todo.completed ? "✓" : ""}
                      </button>

                      {/* Texto del todo */}
                      <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                        {todo.text}
                      </span>

                      {/* Botones editar y eliminar */}
                      <div className="todo-actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => startEdit(todo)}
                          disabled={isPending || isConfirming}
                          title="Editar"
                        >✏️</button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(todo.id)}
                          disabled={isPending || isConfirming}
                          title="Eliminar"
                        >🗑️</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="subtitle">Conecta tu wallet para ver y gestionar tus tareas</p>
        )}
      </div>

      {/* Toast de notificación */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
          <span className="toast-message">{toast.msg}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </div>
  );
}
