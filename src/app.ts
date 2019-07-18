import "phaser";
import {GameScene} from "./gameScene/gameScene";
import GameConfig = Phaser.Types.Core.GameConfig;
import {GameOverScene} from './gameOverScene/gameOverScene';

const config: GameConfig = {
  type: Phaser.AUTO,
  title: 'Fluke',
  width: 800,
  height: 600,
  parent: 'game',
  scale: {
    expandParent: true,
  },
  physics: {
    default: "arcade",
  },
  scene: [GameScene, GameOverScene],
  autoFocus: true,
  backgroundColor: "#003366",
};

export class FlukeGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

new FlukeGame(config);
