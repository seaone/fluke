import "phaser";
import {gameOptions} from "./gameOptions";
import {Fluke} from "../player/fluke";
import {Platform} from "../objects/platform";
import {MainTitle} from "../objects/mainTitle";
import {Coin} from '../objects/coin';

export class GameScene extends Phaser.Scene {
  private fluke: Fluke;
  private platform: Platform;
  private mainTitle: MainTitle;
  // private coin: Coin;
  private score: number = 0;
  private counter = 0;
  private scoreText: Phaser.GameObjects.Text;
  private fontStyle = {
    font: "16px 'PressStart'",
    fill: "#fff",
  };

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("platform", "/assets/platform.png");
    this.load.image("mainTitle", "/assets/wrikey_dog_title.png");
    this.load.spritesheet("coin", "/assets/wrike_coin.png", { frameWidth: 12, frameHeight: 12 });
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
    this.scoreText = this.add.text(24, 16, `score: ${this.score}`, this.fontStyle);
    this.mainTitle = new MainTitle(this);
  }

  updateCounter(): void {
    if (gameOptions.isStarted) {
      this.counter++;
    } else {
      this.counter = 0;
    }
  }

  update(): void {
    this.updateCounter();
    this.fluke.update();
    this.platform.update();
    this.mainTitle.update();
    // this.coin.update();

    this.score = (this.counter / 5) ^ 0;
    this.scoreText.setText(`score: ${this.score}`);
  }
}
