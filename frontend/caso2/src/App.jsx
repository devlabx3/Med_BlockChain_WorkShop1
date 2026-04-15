// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Interacción básica con un contrato inteligente
//
// Flujo:
//   1. El usuario conecta su wallet (ConnectButton de RainbowKit)
//   2. La app lee el valor guardado en el contrato (retrieve)
//   3. El usuario escribe un número y lo guarda en el contrato (store)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ConnectButton: botón listo para conectar/desconectar wallet
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Hooks de wagmi para interactuar con el contrato y la wallet
import {
  useAccount,           // saber si hay wallet conectada y su dirección
  useReadContract,      // leer datos del contrato (sin gastar gas)
  useWriteContract,     // enviar una transacción al contrato (gasta gas)
  useWaitForTransactionReceipt, // esperar a que la transacción sea confirmada
} from "wagmi";

// Configuración del contrato: dirección y ABI
import { STORAGE_CONTRACT_ADDRESS, STORAGE_ABI } from "./config";

export default function App() {

  // ── Paso 1: saber si hay wallet conectada ──────────────────────────────────
  // address: la dirección de la wallet (ej. 0xAbc...)
  // isConnected: true/false
  const { isConnected } = useAccount();

  // ── Paso 2: leer el valor guardado en el contrato ─────────────────────────
  // useReadContract llama a una función "view" del contrato.
  // Las funciones view NO gastan gas, solo consultan el estado.
  const {
    data: storedValue,   // el número guardado en el contrato
    isLoading,           // true mientras espera la respuesta
    refetch,             // función para volver a leer después de escribir
  } = useReadContract({
    address: STORAGE_CONTRACT_ADDRESS,
    abi: STORAGE_ABI,
    functionName: "retrieve",  // función del contrato que queremos llamar
  });

  // ── Paso 3: escribir un nuevo valor en el contrato ────────────────────────
  // useWriteContract envía una transacción que modifica el estado.
  // Requiere wallet conectada y gas para pagar la operación.
  const { writeContract, isPending, data: txHash } = useWriteContract();

  // useWaitForTransactionReceipt espera a que la transacción sea minada.
  // Cuando isSuccess es true, la cadena ya confirmó el cambio.
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Cuando la transacción es confirmada, volvemos a leer el contrato
  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess]);

  // Estado local para el input del usuario
  const [inputValue, setInputValue] = useState("");

  // Función que se ejecuta al hacer submit del formulario
  function handleStore(e) {
    e.preventDefault();
    writeContract({
      address: STORAGE_CONTRACT_ADDRESS,
      abi: STORAGE_ABI,
      functionName: "store",      // función del contrato a llamar
      args: [BigInt(inputValue)], // argumentos (el número a guardar)
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Storage Contract</h1>
        <p className="subtitle">Guarda y lee un número en la blockchain</p>

        {/* Botón de conexión de wallet */}
        <div className="connect-row">
          <ConnectButton />
        </div>

        {/* Valor guardado en el contrato (visible sin wallet) */}
        <div className="balance-card">
          <span className="balance-label">Valor en el contrato</span>
          <span className="balance-value">
            {isLoading ? "..." : (storedValue?.toString() ?? "0")}
          </span>
        </div>

        {/* Formulario para guardar un nuevo valor (solo si hay wallet) */}
        {isConnected && (
          <div className="store-form-wrapper">
            <form className="store-form" onSubmit={handleStore}>
              <input
                className="store-input"
                type="number"
                placeholder="Escribe un número"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="store-button"
                type="submit"
                disabled={isPending || isConfirming || !inputValue}
              >
                {isPending    ? "Firmando…"    :
                 isConfirming ? "Confirmando…" : "Guardar"}
              </button>
            </form>

            {/* Mensajes de estado de la transacción */}
            {isPending    && <p>⏳ Esperando firma en la wallet…</p>}
            {isConfirming && <p>⛏️ Transacción enviada, esperando confirmación…</p>}
            {isSuccess    && <p>✅ ¡Valor guardado correctamente!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
