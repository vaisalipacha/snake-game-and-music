/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';
import { soundManager } from '../services/soundManager';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    soundManager.playStart();
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const currentDir = nextDirection;
        setDirection(currentDir);
        
        switch (currentDir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          soundManager.playGameOver();
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          soundManager.playGameOver();
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          soundManager.playEat();
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED - Math.min(100, score / 2));
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, nextDirection, food, score, generateFood, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : '#0097ff';
      if (index === 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f3ff';
      } else {
        ctx.shadowBlur = 0;
      }
      
      const padding = index === 0 ? 0 : 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      <div className="flex justify-between w-full glass-morphism p-4 rounded-xl neon-border-cyan">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Score</span>
          <span className="text-2xl font-bold neon-text-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">High Score</span>
          <span className="text-2xl font-bold neon-text-magenta">{highScore}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.15)] bg-black"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-black neon-text-magenta mb-2">GAME OVER</h2>
                  <p className="text-gray-400 mb-6 font-mono">FINAL SCORE: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-magenta text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <RefreshCw size={20} /> RESTART
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-black neon-text-cyan mb-6">READY?</h2>
                  <button
                    onClick={() => {
                      soundManager.playStart();
                      setIsPaused(false);
                    }}
                    className="flex items-center gap-2 px-8 py-4 bg-neon-cyan text-black rounded-full font-bold hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                  >
                    <Play size={24} fill="currentColor" /> START GAME
                  </button>
                  <p className="mt-4 text-xs text-gray-500 font-mono italic">
                    Use Arrow Keys to Move
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="glass-morphism p-3 rounded-lg border border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">SPEED</span>
            <span className="text-neon-lime text-sm font-mono">{Math.floor(100 - (INITIAL_SPEED - Math.min(100, score / 2))/2)}%</span>
         </div>
         <button 
          onClick={() => setIsPaused(p => !p)}
          disabled={isGameOver}
          className="glass-morphism p-3 rounded-lg border border-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
         >
            {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            <span className="text-xs font-mono">{isPaused ? 'RESUME' : 'PAUSE'}</span>
         </button>
      </div>
    </div>
  );
}
