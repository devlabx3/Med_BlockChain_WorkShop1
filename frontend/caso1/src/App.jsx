// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Componente principal
//
// Contiene dos componentes:
//   Balance  → lee el saldo nativo (MON) de una address en Monad Testnet
//   App      → layout principal con el botón de conexión y el saldo
// ─────────────────────────────────────────────────────────────────────────────

// ConnectButton: botón listo de RainbowKit que maneja todo el flujo de conexión,
// muestra la address abreviada y permite desconectarse. Sin código extra.
import { ConnectButton } from "@rainbow-me/rainbowkit";

// useAccount: hook de wagmi que devuelve el estado de la wallet conectada.
//   - address   → dirección hex de la cuenta (undefined si no hay conexión)
//   - isConnected → boolean: true cuando hay wallet conectada
//
// useBalance: hook de wagmi para leer el saldo nativo de una dirección.
//   Hace una llamada eth_getBalance al RPC configurado en wagmiConfig.
import { useAccount, useBalance } from "wagmi";

import { monadTestnet } from "./config";

// ─── Componente Balance ───────────────────────────────────────────────────────
// Recibe la `address` del padre y consulta su saldo en Monad Testnet.
// Se renderiza solo cuando hay wallet conectada (ver App más abajo).
function Balance({ address }) {
  const { data, isLoading } = useBalance({
    address,
    // chainId fuerza la consulta a Monad Testnet aunque el usuario tenga
    // otra red seleccionada en su wallet.
    chainId: monadTestnet.id,
  });

  // Mientras llega la respuesta del RPC mostramos puntos suspensivos
  if (isLoading) return <span className="balance-value">...</span>;

  // Si por algún motivo no hay data (error de red, etc.) no renderizamos nada
  if (!data) return null;

  // data.formatted → saldo en unidades legibles (ej: "1.234567891234567890")
  // data.symbol    → símbolo de la moneda nativa ("MON")
  // toFixed(4)     → recortamos a 4 decimales para mejor legibilidad
  return (
    <div className="balance-card">
      <span className="balance-label">Balance</span>
      <span className="balance-value">
        {parseFloat(data.formatted).toFixed(4)}{" "}
        <span className="balance-symbol">{data.symbol}</span>
      </span>
    </div>
  );
}

// ─── Componente App ───────────────────────────────────────────────────────────
export default function App() {
  // Leemos el estado de la wallet desde el contexto de wagmi.
  // Estos valores se actualizan automáticamente cuando el usuario
  // conecta, desconecta o cambia de cuenta.
  const { address, isConnected } = useAccount();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Monad Testnet</h1>
        <p className="subtitle">Connect your wallet to see your balance</p>

        <div className="connect-row">
          {/* ConnectButton maneja todos los estados:
              - Desconectado: muestra "Connect Wallet"
              - Conectado:    muestra address + avatar + menú de desconexión
              - Red incorrecta: muestra "Wrong Network" */}
          <ConnectButton />
        </div>

        {/* Renderizado condicional: Balance solo aparece cuando hay wallet conectada.
            Pasamos la address para que el hook useBalance sepa a quién consultar. */}
        {isConnected && <Balance address={address} />}
      </div>
    </div>
  );
}
