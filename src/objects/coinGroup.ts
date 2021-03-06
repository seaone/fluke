import "phaser";
import {gameOptions} from "../gameScene/gameOptions";
import {GameState} from '../gameState';

export class CoinGroup {
  public coinGroup: Phaser.Physics.Arcade.StaticGroup;
  private coinPool: Phaser.Physics.Arcade.StaticGroup;
  private nextCoinDistance: number;
  private collectSound: Phaser.Sound.BaseSound;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {

    this.coinPool = this._scene.physics.add.staticGroup({
      removeCallback: function (coin) {
        this.scene.coinGroup?.add(coin)
      }
    });

    this.coinGroup = this._scene.physics.add.staticGroup({
      removeCallback: function (coin) {
        this.scene.coinPool?.add(coin);
      }
    });

    this._scene.anims.create({
      key: 'rotate',
      frames: this._scene.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
      frameRate: 12,
      repeat: -1,
    });

    this.collectSound = this._scene.sound.add('coinSound');
  }

  public update(): void {
    if (gameOptions.gameState !== GameState.playing) {
      return;
    }

    let minDistance: number = +this._scene.game.config.width;

    this.coinGroup.getChildren().forEach((coin: Phaser.Physics.Arcade.Sprite) => {
      const coinDistance = +this._scene.game.config.width - coin.x - coin.displayWidth / 2;
      minDistance = Math.min(minDistance, coinDistance);

      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }

      this.animate(coin);
    });
  }

  public addCoin(posX: number, posY: number): void {
    let coin: Phaser.Physics.Arcade.Sprite;

    if (this.coinPool.getLength()) {
      coin = this.coinPool.getFirst();
      coin.x = posX;
      coin.active = true;
      coin.visible = true;
      this.coinPool.remove(coin);
    } else {
      coin = this._scene.physics.add.sprite(posX, posY, 'coin');
      coin.setImmovable(true);
      coin.setVelocityX(gameOptions.gameSpeed * -1);
      this.coinGroup.add(coin);
    }

    if(gameOptions.gameState === GameState.playing) {
      this.nextCoinDistance = Phaser.Math.Between(gameOptions.coinSpawnRange[0], gameOptions.coinSpawnRange[1]);
    } else {
      this.nextCoinDistance = gameOptions.coinSpawnRange[0];
    }
  }

  private animate(sprite): void {
    if(sprite.body) {
      sprite.anims.play('rotate', true);
    }
  }

  public playCollectSound(): void {
    if(this.collectSound.isPlaying) return;
    if (gameOptions.soundIsOn) this.collectSound.play();
  }
}
