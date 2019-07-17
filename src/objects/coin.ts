import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Coin {
  public coinGroup: Phaser.Physics.Arcade.StaticGroup;
  public coinPool: Phaser.Physics.Arcade.StaticGroup;
  public sprite: Phaser.Physics.Arcade.Sprite;
  private nextcoinDistance: number;
  private gameOptions: any = gameOptions;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.coinGroup = this._scene.physics.add.staticGroup({
      removeCallback: function (coin) {
        this.scene.coinPool.add(coin);
      }
    });

    this.coinPool = this._scene.physics.add.staticGroup({
      removeCallback: function (coin) {
        this.scene.coinGroup.add(coin)
      }
    });

    this.addCoin(this._scene.game.config.width, +this._scene.game.config.width / 2, +this._scene.game.config.height * 0.8);
  }

  public update(): void {
    this.animate();

    let minDistance: number = +this._scene.game.config.width;

    this.coinGroup.getChildren().forEach((coin: Phaser.Physics.Arcade.Sprite) => {
      const coinDistance = +this._scene.game.config.width - coin.x - coin.displayWidth / 2;
      minDistance = Math.min(minDistance, coinDistance);

      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    });

    if (minDistance > this.nextcoinDistance) {
      const nextcoinWidth = Phaser.Math.Between(this.gameOptions.coinSizeRange[0], this.gameOptions.coinSizeRange[1]);
      const posX = +this._scene.game.config.width + nextcoinWidth / 2;
      const posY = Phaser.Math.Between(+this._scene.game.config.height - 100, +this._scene.game.config.height) * 0.8;

      this.addCoin(nextcoinWidth, posX, posY);
    }
  }

  private addCoin(coinWidth, posX, posY): void {
    let coin: Phaser.Physics.Arcade.Sprite;

    if (this.coinPool.getLength()) {
      this.sprite = this.coinPool.getFirst();
      this.sprite.x = posX;
      this.sprite.active = true;
      this.sprite.visible = true;
      this.coinPool.remove(coin);
    } else {
      this.sprite = this._scene.physics.add.sprite(posX, posY, "coin");

      this._scene.anims.create({
        key: 'spin',
        frames: this._scene.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
        frameRate: 16,
        repeat: 0,
      });

      coin.setImmovable(true);
      coin.setVelocityX(this.gameOptions.coinStartSpeed * -1);
      this.coinGroup.add(coin);
    }

    coin.displayWidth = coinWidth;
    this.nextcoinDistance = Phaser.Math.Between(this.gameOptions.spawnRange[0], this.gameOptions.spawnRange[1]);
  }

  private animate(): void {
    this.sprite.anims.play('spin', true);
  }
}
