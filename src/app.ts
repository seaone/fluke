import "phaser";
import { GameOverScene } from './gameOverScene/gameOverScene';
import { GameScene } from "./gameScene/gameScene";
import onMessage from './services/ws_bus';
import GameConfig = Phaser.Types.Core.GameConfig;

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
    // arcade: {onMessage
    //   debug: true
    // }
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

window.onmessage = (ev: MessageEvent) => onMessage(ev.data)