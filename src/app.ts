import "phaser";
import { GameScene } from "./gameScene/gameScene";
import GameConfig = Phaser.Types.Core.GameConfig;

console.log('Hello, Dima!');

const config: GameConfig = {
  type: Phaser.AUTO,
  title: 'Fluke',
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: "arcade",
    // arcade: {
    //   debug: true,
    // }
  },
  scene: [GameScene],
  autoFocus: true,
  backgroundColor: "#18216D",
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