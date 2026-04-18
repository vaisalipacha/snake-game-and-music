/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Gen - SynthWave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '2',
    title: 'Cybernetic Echoes',
    artist: 'AI Gen - Ambient Tech',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400'
  },
  {
    id: '3',
    title: 'Digital Midnight',
    artist: 'AI Gen - Cyberpunk',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/midnight/400/400'
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
