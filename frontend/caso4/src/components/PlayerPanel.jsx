import React, { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CULEBRITA_CONTRACT_ADDRESS, CULEBRITA_ABI } from "../config";
import "./PlayerPanel.css";

export default function PlayerPanel({ address, score }) {
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Read player data
  const { data: playerData, refetch: refetchPlayer } = useReadContract({
    address: CULEBRITA_CONTRACT_ADDRESS,
    abi: CULEBRITA_ABI,
    functionName: "getPlayer",
    args: [address],
    account: address,
  });

  // Check if player exists
  const { data: playerExists } = useReadContract({
    address: CULEBRITA_CONTRACT_ADDRESS,
    abi: CULEBRITA_ABI,
    functionName: "playerExists",
    args: [address],
  });

  // Register player
  const { writeContract: registerPlayer, isPending: isRegisterPending, data: registerTxHash } =
    useWriteContract();
  const { isLoading: isRegisterConfirming, isSuccess: isRegisterSuccess } =
    useWaitForTransactionReceipt({
      hash: registerTxHash,
    });

  // Update score
  const { writeContract: updateScore, isPending: isUpdatePending, data: updateTxHash } =
    useWriteContract();
  const { isLoading: isUpdateConfirming, isSuccess: isUpdateSuccess } =
    useWaitForTransactionReceipt({
      hash: updateTxHash,
    });

  // Refetch after registration
  useEffect(() => {
    if (isRegisterSuccess) {
      refetchPlayer();
    }
  }, [isRegisterSuccess, refetchPlayer]);

  // Refetch after score update
  useEffect(() => {
    if (isUpdateSuccess) {
      refetchPlayer();
    }
  }, [isUpdateSuccess, refetchPlayer]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("Por favor ingresa un nickname");
      return;
    }

    registerPlayer({
      address: CULEBRITA_CONTRACT_ADDRESS,
      abi: CULEBRITA_ABI,
      functionName: "registerPlayer",
      args: [nickname],
    });

    setNickname("");
  };

  const handleUpdateScore = () => {
    if (score > 0 && playerData && score > Number(playerData[1])) {
      updateScore({
        address: CULEBRITA_CONTRACT_ADDRESS,
        abi: CULEBRITA_ABI,
        functionName: "updateScore",
        args: [BigInt(score)],
      });
    }
  };

  return (
    <div className="player-panel">
      <div className="panel-header">
        <h3>👤 Mi Perfil</h3>
        <p className="wallet-address">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      {!playerExists ? (
        <div className="registration-form">
          <h4>Registrate para jugar</h4>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Tu nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength="20"
              disabled={isRegisterPending || isRegisterConfirming}
            />
            <button
              type="submit"
              disabled={isRegisterPending || isRegisterConfirming}
              className="btn-register"
            >
              {isRegisterPending && "Firmando..."}
              {isRegisterConfirming && "Registrando..."}
              {!isRegisterPending && !isRegisterConfirming && "Registrarse"}
            </button>
          </form>
        </div>
      ) : (
        <div className="player-info">
          <div className="info-row">
            <span>Nickname:</span>
            <span className="nickname">{playerData?.[0] || "---"}</span>
          </div>
          <div className="info-row">
            <span>Top Score:</span>
            <span className="top-score">{Number(playerData?.[1] || 0)}</span>
          </div>
          <div className="info-row">
            <span>Current Score:</span>
            <span className={`current-score ${score > Number(playerData?.[1] || 0) ? "new-record" : ""}`}>
              {score}
            </span>
          </div>

          {score > 0 && score > Number(playerData?.[1] || 0) && (
            <button
              className="btn-save-score"
              onClick={handleUpdateScore}
              disabled={isUpdatePending || isUpdateConfirming}
            >
              {isUpdatePending && "Firmando..."}
              {isUpdateConfirming && "Guardando..."}
              {!isUpdatePending && !isUpdateConfirming && "💾 Guardar Score"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
