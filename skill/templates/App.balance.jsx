// App.balance.jsx — Patrón: Wallet Connect + Balance nativo
//
// Caso de uso: mostrar el saldo nativo del usuario en la chain configurada.
// Hooks usados: useAccount, useBalance

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { monadTestnet } from "./config"; // <- sustituir por tu chain

// Balance lee el saldo nativo de la address dada.
// Se pasa chainId para forzar la consulta a la chain correcta
// aunque el usuario tenga otra red seleccionada en su wallet.
function Balance({ address }) {
  const { data, isLoading } = useBalance({
    address,
    chainId: monadTestnet.id,
  });

  if (isLoading) return <span className="balance-value">...</span>;
  if (!data) return null;

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

export default function App() {
  const { address, isConnected } = useAccount();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Mi dApp</h1>
        <p className="subtitle">Conecta tu wallet para ver tu saldo</p>

        <div className="connect-row">
          <ConnectButton />
        </div>

        {isConnected && <Balance address={address} />}
      </div>
    </div>
  );
}
