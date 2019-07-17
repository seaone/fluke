import "phaser";
import {Fluke} from "../player/fluke";
import {Platform} from "../objects/platform";
import {Coin} from '../objects/coin';

export class GameScene extends Phaser.Scene {
  private fluke: Fluke;
  private platform: Platform;
  // private coin: Coin;
  private score = 0;
  private counter = 0;
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("platform", "/assets/platform.png");
    // this.load.image("coin", "/assets/wrike_coin.png");
    this.load.image("mainTitle", "/assets/wrikey_dog_title.png");
    this.load.spritesheet("fluke", "/assets/fluke.png",{ frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.platform = new Platform(this);
    // this.coin = new Coin(this);
    this.fluke = new Fluke(this);
    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren(), (fluke, platform) => {
      (platform as Phaser.Physics.Arcade.Sprite).tint = 0x8BC34A;
    });
    // this.physics.add.collider(this.fluke.sprite, this.coin.coinGroup.getChildren(), (fluke, coin) => {
    //   this.score += 100;
    //   coin.destroy();
    // });
    this.scoreText = this.add.text(24, 16, `score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
    this.add.image(+this.game.config.width / 2, +this.game.config.height / 4, 'mainTitle');
  }

  updateCounter(): void {
    this.counter++;
  }

  update(): void {
    this.updateCounter();
    this.score = (this.counter / 5) ^ 0;
    this.fluke.update();
    this.platform.update();
    // this.coin.update();
    this.scoreText.setText(`score: ${this.score}`);
  }
}
