import "phaser";
import { MainTitle } from "../objects/mainTitle";
import { Platform } from "../objects/platform";
import { Fluke } from "../player/fluke";
import {CoinGroup} from "../objects/coinGroup";
import { gameOptions } from "./gameOptions";
const _assetsPrefix = 'assets/game_assets';
import {GameState} from '../gameState';

export class GameScene extends Phaser.Scene {
  fluke: Fluke;
  platform: Platform;
  coinGroup: CoinGroup;
  mainTitle: MainTitle;
  score: number = 0;
  counter = 0;
  coinCounter = 0;
  scoreText: Phaser.GameObjects.BitmapText;
  gameSpeed = gameOptions.gameSpeed;
  level = 1;
  levelFrameThreshold = 500;
  levelSpeedIncrease = 50;
  coinValue = 50;
  coinFrequency = 150;

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
    this.coinGroup = new CoinGroup(this);
    this.platform = new Platform(this);
    this.fluke = new Fluke(this);
    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren(), (fluke, pl) => {
      let platform = pl as Phaser.Physics.Arcade.Sprite;

      if (platform.body.touching.left || platform.body.touching.right) {
        this.gameSpeed = 0;
      } else {
        platform.clearTint();
        if(!platform.isTinted) platform.tint = 0x8BC34A;
      }
    });

    this.physics.add.overlap(this.fluke.sprite, this.coinGroup.coinGroup.getChildren(), (player, coin) => {
      if (coin.active) {
        this.coinCounter++;
      }

      this.coinGroup.coinGroup.killAndHide(coin);
    });

    this.scoreText = this.add.bitmapText(24, 24, 'pixelFont', `SCORE: ${this.score}`, 16);
    this.mainTitle = new MainTitle(this);
  }

  updateCounter(): void {
    this.counter++;
  }

  gameOver() {
    this.scene.stop();
    this.scene.start('GameOverScene');
  }

  resetGame() {
    this.counter = 0;
    this.coinCounter = 0;
    this.level = 1;
    this.gameSpeed = gameOptions.gameSpeed;
  }

  update(): void {
    if (gameOptions.gameState === GameState.playing) {
      this.updateCounter();

      if (this.counter % this.coinFrequency === 0) {
        this.coinGroup.addCoin(1000, Phaser.Math.Between(+this.game.config.height - 400, +this.game.config.height - 300));
      }
    } else if (gameOptions.gameState === GameState.initial) {
      this.resetGame();
    } else if (gameOptions.gameState === GameState.over) {
      gameOptions.score = this.score;
      this.gameOver();
    }

    this.mainTitle.update();
    this.fluke.update();
    this.platform.update();
    this.coinGroup.update();
    this.score = ((this.counter / 5) ^ 0) + (this.coinCounter * this.coinValue);
    this.scoreText.setText(`SCORE: ${this.score}`);

    this.level = this.counter / this.levelFrameThreshold ^ 0;
    this.gameSpeed = gameOptions.gameSpeed + this.level * this.levelSpeedIncrease;
  }
}
