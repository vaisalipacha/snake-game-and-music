/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  return (
    <div className="glass-morphism p-6 rounded-2xl neon-border-magenta w-full max-w-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 neon-glow-cyan"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Music className="text-neon-cyan animate-pulse" size={32} />
              </div>
            )}
          </motion.div>
          
          <div className="flex flex-col">
            <h3 className="text-xl font-bold neon-text-cyan truncate max-w-[200px]">
              {currentTrack.title}
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="h-1 bg-gray-800 rounded-full w-full overflow-hidden">
            <motion.div
              className="h-full bg-neon-magenta shadow-[0_0_10px_rgba(255,0,255,0.8)]"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevTrack}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-neon-magenta text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,0,255,0.6)]"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
          >
            <SkipForward size={24} />
          </button>

          <div className="flex items-center gap-2 text-gray-400">
            <Volume2 size={20} />
            <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
