import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Coin {
  sprite: Phaser.Physics.Arcade.Sprite;
  initialX: number;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.initialX = +this._scene.game.config.width - 30;
    this.sprite = scene.physics.add.sprite(this.initialX, 380, "coin").setScale(4);
    this.sprite.setVelocityX(gameOptions.gameSpeed * -1);
    this.sprite.setImmovable(true);

    this._scene.anims.create({
      key: 'rotate',
      frames: this._scene.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
      frameRate: 12,
      repeat: -1,
    });
  }

  private animate(): void {
    if(this.sprite.body) {
      this.sprite.anims.play('rotate', true);
    }
  }

  public update(): void {
    if (this.sprite.x < 20) {
      this.destroy();
    }

    this.animate();
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
