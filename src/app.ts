import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import RenderConfig = Phaser.Types.Core.RenderConfig;
import {GameScene} from "./game/gameScene";

const config: GameConfig = {
  type: Phaser.AUTO,
  title: 'Fluke',
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: "arcade",
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
window.onload = () => {
  const game = new FlukeGame(config);
};