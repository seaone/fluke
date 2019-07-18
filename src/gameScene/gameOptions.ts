import {GameState} from '../gameState';

export const gameOptions = {
  gameState: GameState.initial,
  soundIsOn: true,
  playerStartPosition: 160,
  jumpForce: 250,
  playerGravity: 900,
  initialGameSpeed: 350,
  gameSpeed: 350,
  platformSpawnRange: [100, 350],
  coinSpawnRange: [200, 300],
  platformSizeRange: [50, 250],
  score: 0,
  playerName: 'Boris Lobanov'
};
