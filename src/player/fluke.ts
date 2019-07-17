import "phaser";
import {gameOptions} from "../gameScene/gameOptions";
import {GameState} from '../gameState';

export class Fluke {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private jumpTimer: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  canDoubleJump = true;
  jumpCounter = 0;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.sprite = scene.physics.add.sprite(gameOptions.playerStartPosition, +scene.game.config.height / 2, "fluke").setScale(4);
    this.sprite.body.setSize(16, 18);
    this.sprite.body.setOffset(9, 7);

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
    this.jump();
    this.respawn(this._scene.scene.key);
  }

  private jump(): void {
    const isPressed = this.cursors.space.isDown || this.cursors.up.isDown || this._scene.input.activePointer.leftButtonDown();

    if (isPressed && gameOptions.gameState !== GameState.playing) {
      this.sprite.setGravityY(gameOptions.playerGravity);
      gameOptions.gameState = GameState.playing;
    }

    if (isPressed) {
      if (this.sprite.body.touching.down && this.jumpTimer === 0) {
        this.jumpTimer = 1;
        this.canDoubleJump = true;
      } else if (this.jumpTimer > 0 && this.jumpTimer < 30) {
        this.jumpTimer++;
        this.sprite.setVelocityY(gameOptions.jumpForce * -1 + (this.jumpTimer * 4));
      }
    } else {
      if (this.jumpTimer < 30 && this.canDoubleJump) {
        console.log('can double jump');
        this.canDoubleJump = false;
      }

      this.jumpTimer = 0;
      this.jumpCounter++;
    }
  }

  private respawn(sceneName: string): void {
    if (this.sprite.y > this._scene.game.config.height) {
      this._scene.cameras.main.shake(300, 0.025);

      this._scene.time.addEvent({
        delay: 500,
        callback: () => gameOptions.gameState = GameState.over,
      });
    }

    this.sprite.x = gameOptions.playerStartPosition;
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
