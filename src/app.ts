import "phaser";
import {GameScene} from "./gameScene/gameScene";
import GameConfig = Phaser.Types.Core.GameConfig;
import {GameOverScene} from './gameOverScene/gameOverScene';

console.log('Hello, Dima!');

const config: GameConfig = {
  type: Phaser.AUTO,
  title: 'Fluke',
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: "arcade",
  },
  scene: [GameScene, GameOverScene],
  autoFocus: true,
  backgroundColor: "#003366",
  render: {
    pixelArt: true
  }
};

export class FlukeGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

new FlukeGame(config);
