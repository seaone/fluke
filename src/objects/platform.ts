import "phaser";
import {gameOptions} from "../gameScene/gameOptions";
import {platformColors} from "./platformColors";
import {GameState} from '../gameState';

export class Platform {
  public platformGroup: Phaser.Physics.Arcade.StaticGroup;
  private platformPool: Phaser.Physics.Arcade.StaticGroup;
  private nextPlatformDistance: number;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.platformGroup = this._scene.physics.add.staticGroup({
      removeCallback: function (platform) {
        this.scene.platformPool.add(platform);
      }
    });

    this.platformPool = this._scene.physics.add.staticGroup({
      removeCallback: function (platform) {
        this.scene.platformGroup.add(platform)
      }
    });

    this.addPlatform(+this._scene.game.config.width, +this._scene.game.config.width / 2, +this._scene.game.config.height * 0.8);
  }

  public update(gameSpeed: number): void {
    let minDistance: number = +this._scene.game.config.width;

    this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
      const platformDistance = +this._scene.game.config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);

      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    });

    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth;

      if (gameOptions.gameState === GameState.playing) {
        nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
      } else {
        nextPlatformWidth = gameOptions.platformSizeRange[1];
      }

      const posX = +this._scene.game.config.width + nextPlatformWidth / 2;
      const posY = Phaser.Math.Between(+this._scene.game.config.height - 100, +this._scene.game.config.height) * 0.8;

      this.addPlatform(nextPlatformWidth, posX, posY, gameSpeed);
    }
  }

  private addPlatform(platformWidth: number, posX: number, posY: number, gameSpeed = gameOptions.platformStartSpeed): void {
    let platform: Phaser.Physics.Arcade.Sprite;

    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this._scene.physics.add.sprite(posX, posY, "platform").setScale(4);

      if(platform.isTinted) {
        platform.clearTint();
      }

      platform.tint = platformColors[Phaser.Math.Between(0, platformColors.length - 1)];
      platform.setImmovable(true);
      platform.setVelocityX(gameSpeed * -1);
      this.platformGroup.add(platform);
    }

    platform.displayWidth = platformWidth;

    if(gameOptions.gameState === GameState.playing) {
      this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    } else {
      this.nextPlatformDistance = gameOptions.spawnRange[0];
    }
  }
}
