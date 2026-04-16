import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import GameBoard from "./components/GameBoard";
import PlayerPanel from "./components/PlayerPanel";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

export default function App() {
  const { address, isConnected } = useAccount();
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const gameLoopRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize background music
  useEffect(() => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2724/2724-preview.mp3"
    );
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Start music when game starts
  useEffect(() => {
    if (gameState === "playing" && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Browser may block autoplay
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [gameState]);

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      collision = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  }, [snake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") {
        e.preventDefault();
        setNextDirection({ x: 0, y: -1 });
      } else if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        setNextDirection({ x: 0, y: 1 });
      } else if (key === "arrowleft" || key === "a") {
        e.preventDefault();
        setNextDirection({ x: -1, y: 0 });
      } else if (key === "arrowright" || key === "d") {
        e.preventDefault();
        setNextDirection({ x: 1, y: 0 });
      } else if (key === "enter" && gameState !== "playing") {
        startGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        // Prevent reversing into itself
        const newDirection =
          nextDirection.x !== -direction.x || nextDirection.y !== -direction.y
            ? nextDirection
            : direction;

        setDirection(newDirection);

        const head = prevSnake[0];
        const newHead = {
          x: (head.x + newDirection.x + GRID_WIDTH) % GRID_WIDTH,
          y: (head.y + newDirection.y + GRID_HEIGHT) % GRID_HEIGHT,
        };

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState("gameOver");
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
          // Don't pop the tail, snake grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, direction, nextDirection, food, generateFood]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
  };

  return (
    <div className="app-container">
      <div className="stars"></div>
      <div className="stars-secondary"></div>

      <header className="header">
        <h1 className="title">🐍 Culebrita - Monad Edition</h1>
        <ConnectButton />
      </header>

      {!isConnected ? (
        <div className="connect-prompt">
          <div className="glow-box">
            <h2>Conecta tu wallet para jugar</h2>
            <p>Usa RainbowKit para conectarte a Monad Testnet</p>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-main">
            <GameBoard snake={snake} food={food} gridWidth={GRID_WIDTH} gridHeight={GRID_HEIGHT} />

            <div className="game-controls">
              {gameState === "menu" && (
                <button className="btn-primary" onClick={startGame}>
                  Iniciar Juego
                </button>
              )}
              {gameState === "playing" && (
                <div className="controls-info">
                  <p>↑ ↓ ← → o W A S D para mover</p>
                  <p className="score">Score: {score}</p>
                </div>
              )}
              {gameState === "gameOver" && (
                <div className="game-over-panel">
                  <h2>¡Juego Terminado!</h2>
                  <p className="final-score">Score Final: {score}</p>
                  <button className="btn-primary" onClick={resetGame}>
                    Jugar de Nuevo
                  </button>
                  {isConnected && <PlayerPanel address={address} score={score} />}
                </div>
              )}
            </div>
          </div>

          <div className="game-sidebar">
            <PlayerPanel address={address} score={score} />
            <Leaderboard />
          </div>
        </div>
      )}
    </div>
  );
}
