import "phaser";
import {gameOptions} from "../gameScene/gameOptions";
import {GameState} from '../gameState';

export class MainTitle {
  private sprite: Phaser.Physics.Arcade.Sprite;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  create(scene: Phaser.Scene) {
    this.sprite = scene.physics.add.sprite(+scene.game.config.width / 2, +scene.game.config.height / 4, 'mainTitle');
  }

  public update(): void {
    if (this.sprite.body && gameOptions.gameState === GameState.playing) {
      this.sprite.setVelocityX(gameOptions.platformStartSpeed * -1);
    }

    if (this.sprite.x < -this.sprite.displayWidth / 2) {
      this.sprite.destroy();
    }
  }
}
