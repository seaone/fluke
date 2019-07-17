import "phaser";
import {gameOptions} from "./gameOptions";
import {Fluke} from "../player/fluke";
import {Platform} from "../objects/platform";

export class GameScene extends Phaser.Scene {
  fluke: Fluke;
  platform: Platform;
  // private coin: Coin;
  score: number = 0;
  counter = 0;
  scoreText: Phaser.GameObjects.BitmapText;
  gameSpeed = gameOptions.platformStartSpeed;
  level = 1;
  levelFrameThreshold = 500;
  levelSpeedIncrease = 50;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.bitmapFont('pixelFont', 'assets/font/font.png', 'assets/font/font.fnt');
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
    this.scoreText = this.add.bitmapText(24, 24, 'pixelFont', `SCORE: ${this.score}`, 16);
    this.add.image(+this.game.config.width / 2, +this.game.config.height / 4, 'mainTitle');
  }

  updateCounter(): void {
    if (gameOptions.isStarted) {
      this.counter++;
    } else {
      this.resetGame();
    }
  }

  resetGame() {
    this.counter = 0;
    this.level = 1;
    this.gameSpeed = gameOptions.platformStartSpeed;
  }

  update(): void {
    this.updateCounter();
    this.fluke.update();
    this.platform.update(this.gameSpeed);
    // this.coin.update();
    this.score = (this.counter / 5) ^ 0;
    this.scoreText.setText(`SCORE: ${this.score}`);

    this.level = this.counter / this.levelFrameThreshold ^ 0;
    this.gameSpeed = gameOptions.platformStartSpeed + this.level * this.levelSpeedIncrease;
  }
}
