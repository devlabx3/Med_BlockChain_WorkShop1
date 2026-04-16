import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load from localStorage (in a real app, this would come from a backend/subgraph)
    const stored = localStorage.getItem("culebrita-leaderboard");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const sorted = data.sort((a, b) => b.score - a.score).slice(0, 10);
        setLeaderboard(sorted);
      } catch (e) {
        console.error("Error loading leaderboard:", e);
      }
    }
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>🏆 Top 10</h3>
      </div>
      {leaderboard.length === 0 ? (
        <p className="empty-message">Sin datos disponibles</p>
      ) : (
        <table className="leaderboard-table">
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className="leaderboard-row">
                <td className="rank">#{index + 1}</td>
                <td className="name">{player.name}</td>
                <td className="score">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
