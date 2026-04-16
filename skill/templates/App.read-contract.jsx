// App.read-contract.jsx — Patrón: Lectura de contrato
//
// Caso de uso: mostrar datos de un contrato sin necesidad de wallet.
// Las funciones `view` no requieren firma ni gas.
// Hooks usados: useReadContract
//
// Si la función depende de msg.sender (ej. datos del usuario logueado),
// añadir `account: address` y usar useAccount para obtener la address.

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

export default function App() {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "retrieve",     // <- nombre de tu función view
    // account: address            // <- descomentar si depende de msg.sender
  });

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Mi dApp</h1>

        <div className="connect-row">
          <ConnectButton />
        </div>

        {/* Los datos del contrato se muestran incluso sin wallet conectada */}
        <div className="balance-card">
          <span className="balance-label">Valor en contrato</span>
          <span className="balance-value">
            {isLoading ? "..." : (data?.toString() ?? "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
