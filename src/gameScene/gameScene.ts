import "phaser";
import { MainTitle } from "../objects/mainTitle";
import { Platform } from "../objects/platform";
import { Fluke } from "../player/fluke";
import { Coin } from "../objects/coin";
import { gameOptions } from "./gameOptions";
const _assetsPrefix = 'assets/game_assets';

export class GameScene extends Phaser.Scene {

  fluke: Fluke;
  platform: Platform;
  private mainTitle: MainTitle;
  private coin: Coin;
  score: number = 0;
  counter = 0;
  coinCounter = 0;
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
    this.load.bitmapFont('pixelFont', `${_assetsPrefix}/font/font.png`, `${_assetsPrefix}/font/font.fnt`);
    this.load.image("platform", `${_assetsPrefix}/platform.png`);
    this.load.image("mainTitle", `${_assetsPrefix}/wrikey_dog_title.png`);
    this.load.spritesheet("coin", `${_assetsPrefix}/wrike_coin.png`, { frameWidth: 12, frameHeight: 12 });
    this.load.spritesheet("fluke", `${_assetsPrefix}/fluke.png`,{ frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.platform = new Platform(this);
    this.coin = new Coin(this);
    this.fluke = new Fluke(this);
    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren(), (fluke, pl) => {
      let platform = pl as Phaser.Physics.Arcade.Sprite;

      if (platform.body.touching.left || platform.body.touching.right) {
        this.gameSpeed = 0;
      } else {
        platform.tint = 0x8BC34A;
      }
    });

    this.physics.add.collider(this.fluke.sprite, this.coin.sprite, (fluke, coin) => {
      this.coinCounter += 1;
      coin.destroy();
    });

    this.scoreText = this.add.bitmapText(24, 24, 'pixelFont', `SCORE: ${this.score}`, 16);
    this.mainTitle = new MainTitle(this);
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
    this.mainTitle.update();
    this.fluke.update();
    this.platform.update(this.gameSpeed);
    this.coin.update();
    this.score = (this.counter / 5) ^ 0;
    this.scoreText.setText(`SCORE: ${this.score + (this.coinCounter * 100)}`);

    this.level = this.counter / this.levelFrameThreshold ^ 0;
    this.gameSpeed = gameOptions.platformStartSpeed + this.level * this.levelSpeedIncrease;
  }
}
