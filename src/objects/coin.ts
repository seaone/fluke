import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Coin {
  private sprite: Phaser.Physics.Arcade.Sprite;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.sprite = scene.physics.add.sprite(100, 200, "coin").setScale(4);

    this._scene.anims.create({
      key: 'rotate',
      frames: this._scene.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
      frameRate: 12,
      repeat: -1,
    });
  }

  private animate(): void {
    this.sprite.anims.play('rotate', true);
  }

  public update(): void {
    this.animate();
  }
}
