// App.write-contract.jsx — Patrón: Escritura de contrato + ciclo de vida TX
//
// Caso de uso: leer y escribir un contrato. Incluye el ciclo completo de TX:
//   writeContract() → txHash → isConfirming → isSuccess → refetch()
//
// También incluye un sistema de toast para feedback al usuario.
// Hooks usados: useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

export default function App() {
  const { isConnected } = useAccount();
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg: string }

  // ── Lectura ────────────────────────────────────────────────────────────────
  // Las funciones view no requieren wallet. Se leen al montar el componente.
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "retrieve",      // <- nombre de tu función view
  });

  // ── Escritura ──────────────────────────────────────────────────────────────
  const { writeContract, isPending, data: txHash } = useWriteContract();

  // Esperar confirmación en la chain
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // CRÍTICO: refetch después de confirmación para mostrar el nuevo estado
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setToast({ type: "success", msg: "¡Transacción confirmada!" });
    }
  }, [isSuccess]);

  // Auto-cerrar toast después de 3 segundos
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "store",         // <- nombre de tu función write
      args: [BigInt(inputValue)],    // <- ajustar tipos por contrato:
                                     //    uint256 → BigInt(value)
                                     //    string  → value (sin conversión)
                                     //    address → value (hex string)
    });
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Mi dApp</h1>

        <div className="connect-row">
          <ConnectButton />
        </div>

        {/* Lectura: visible sin wallet */}
        <div className="balance-card">
          <span className="balance-label">Valor almacenado</span>
          <span className="balance-value">
            {isLoading ? "..." : (data?.toString() ?? "0")}
          </span>
        </div>

        {/* Escritura: requiere wallet */}
        {isConnected && (
          <form className="store-form" onSubmit={handleSubmit}>
            <div className="store-input-row">
              <input
                className="store-input"
                type="number"
                placeholder="Ingresa un valor"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isPending || isConfirming}
              />
              <button
                className="store-button"
                type="submit"
                disabled={isPending || isConfirming || !inputValue}
              >
                {isPending
                  ? "Firmando…"
                  : isConfirming
                  ? "Confirmando…"
                  : "Guardar"}
              </button>
            </div>
            {isPending    && <p className="tx-status">⏳ Esperando firma en wallet…</p>}
            {isConfirming && <p className="tx-status">⛏️ Confirmando en la chain…</p>}
          </form>
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
