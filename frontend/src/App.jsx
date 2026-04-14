import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NetworkBadge from "./components/NetworkBadge";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

/**
 * App Component
 *
 * Root component that:
 * 1. Shows wallet connection button
 * 2. Displays network info
 * 3. Conditionally renders TodoForm + TodoList only when wallet is connected
 */
function App() {
  const { isConnected } = useAccount();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 TodoList DApp</h1>
        <NetworkBadge />
      </header>

      <div className="connect-section">
        <ConnectButton label="Connect Wallet" />
      </div>

      {isConnected ? (
        <main className="app-main">
          <TodoForm />
          <TodoList />
        </main>
      ) : (
        <div className="empty-state">
          <p>Connect your wallet to manage your todos</p>
        </div>
      )}
    </div>
  );
}

export default App;
