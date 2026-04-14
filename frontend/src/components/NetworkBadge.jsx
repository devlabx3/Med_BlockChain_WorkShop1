import { useChainId, useChains } from "wagmi";
import "./NetworkBadge.css";

/**
 * NetworkBadge Component
 *
 * Shows which blockchain network the user is currently connected to.
 * Educational: helps beginners understand that blockchain interactions
 * are network-specific.
 */
function NetworkBadge() {
  const chainId = useChainId();
  const chains = useChains();

  const currentChain = chains.find((c) => c.id === chainId);

  return (
    <div className="network-badge">
      {currentChain ? (
        <>
          <span className="badge-dot"></span>
          Connected to <strong>{currentChain.name}</strong>
        </>
      ) : (
        <>
          <span className="badge-dot disconnected"></span>
          Not connected
        </>
      )}
    </div>
  );
}

export default NetworkBadge;
