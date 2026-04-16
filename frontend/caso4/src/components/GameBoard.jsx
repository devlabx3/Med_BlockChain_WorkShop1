import React from "react";
import "./GameBoard.css";

export default function GameBoard({ snake, food, gridWidth, gridHeight }) {
  return (
    <div className="game-board">
      <div className="grid-container">
        {/* Render grid */}
        {Array.from({ length: gridHeight }).map((_, y) =>
          Array.from({ length: gridWidth }).map((_, x) => {
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`grid-cell ${isSnake ? "snake" : ""} ${isHead ? "head" : ""} ${
                  isFood ? "food" : ""
                }`}
              >
                {isHead && <div className="head-eyes"></div>}
                {isFood && <div className="food-glow"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
