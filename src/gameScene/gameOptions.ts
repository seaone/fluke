import {GameState} from '../gameState';

export const gameOptions = {
  gameState: GameState.initial,
  playerStartPosition: 160,
  jumpForce: 250,
  playerGravity: 900,
  platformStartSpeed: 350,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  score: 0,
  playerName: 'Boris Lobanov'
};
