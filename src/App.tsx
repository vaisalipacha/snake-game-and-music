/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Github, Music as MusicIcon, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Sidebar / Left Column */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-1/3 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.6)]">
              <Zap className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white">
                NEON<span className="text-neon-cyan">GROOVE</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Arcade Music Station</p>
            </div>
          </div>

          <MusicPlayer />

          <div className="glass-morphism p-4 rounded-xl border border-white/5">
             <div className="flex items-center gap-2 mb-2">
                <MusicIcon size={14} className="text-neon-cyan" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Track Info</span>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed">
               Immerse yourself in AI-generated soundscapes while mastering the classic arena. 
               The music syncs with your heartbeat. Or it should.
             </p>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex gap-4">
               <button className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                 <Github size={18} />
               </button>
            </div>
            <span className="text-[10px] font-mono text-gray-600">v1.2.4-BETA</span>
          </div>
        </motion.div>

        {/* Main Center Column */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-2/3 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
            <Gamepad2 size={16} className="text-neon-magenta" />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">Neural Snake Instance</span>
          </div>
          
          <SnakeGame />
          
          <div className="mt-8 flex gap-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_rgba(0,243,255,1)]" />
              SNAKE HEAD
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta shadow-[0_0_5px_rgba(255,0,255,1)]" />
              NEURAL DATA (FOOD)
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Visual Glitch Accents */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent animate-pulse" />
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-magenta/20 to-transparent animate-pulse delay-700" />
    </div>
  );
}

