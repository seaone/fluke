import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Fluke {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private jumpTimer: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private gameOptions: any = gameOptions;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.sprite = scene.physics.add.sprite(this.gameOptions.playerStartPosition, +scene.game.config.height / 2, "fluke").setScale(4);
    this.sprite.body.setSize(16, 18);
    this.sprite.body.setOffset(9, 7);
    this.sprite.setGravityY(this.gameOptions.playerGravity);

    this._scene.anims.create({
      key: 'run',
      frames: this._scene.anims.generateFrameNumbers('fluke', {start: 0, end: 3}),
      frameRate: 16,
      repeat: -1,
    });

    this._scene.anims.create({
      key: 'start_jump',
      frames: this._scene.anims.generateFrameNumbers('fluke', {start: 0, end: 0}),
      frameRate: 0,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'hang',
      frames: this._scene.anims.generateFrameNumbers('fluke', {start: 1, end: 1}),
      frameRate: 0,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'end_jump',
      frames: this._scene.anims.generateFrameNumbers('fluke', {start: 2, end: 2}),
      frameRate: 0,
      repeat: 0,
    });

    this.cursors = this._scene.input.keyboard.createCursorKeys();
  }

  public update(): void {
    this.animate();
    this.respawn(this._scene.scene.key);
    this.jump();
  }

  private jump(): void {
    if (this.cursors.space.isDown) {
      if (this.sprite.body.touching.down && this.jumpTimer === 0) {
        this.jumpTimer = 1;
      } else if (this.jumpTimer > 0 && this.jumpTimer < 30) {
        this.jumpTimer++;
        this.sprite.setVelocityY(this.gameOptions.jumpForce * -1 + (this.jumpTimer * 4));
      }
    } else {
      this.jumpTimer = 0;
    }
  }

  private respawn(sceneName: string): void {
    if (this.sprite.y > this._scene.game.config.height) {
      this._scene.scene.start(sceneName);
    }

    this.sprite.x = this.gameOptions.playerStartPosition;
  }

  private animate(): void {
    if (this.sprite.body.touching.down) {
      this.sprite.anims.play('run', true);
    } else {
      if (this.sprite.body.velocity.y < -100) {
        this.sprite.anims.play('start_jump', true);
      }

      if (this.sprite.body.velocity.y > -100 && this.sprite.body.velocity.y < 200) {
        this.sprite.anims.play('hang', true);
      }

      if (this.sprite.body.velocity.y >= 200) {
        this.sprite.anims.play('end_jump', true);
      }
    }
  }
}