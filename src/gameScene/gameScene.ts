import "phaser";
import { GameState } from '../gameState';
import { Background } from "../objects/background";
import { CoinGroup } from "../objects/coinGroup";
import { HintTitle } from "../objects/hintTitle";
import { MainTitle } from "../objects/mainTitle";
import { Platform } from "../objects/platform";
import { Fluke } from "../player/fluke";
import { gameOptions } from "./gameOptions";

const _assetsPrefix = 'assets/game_assets';

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
  private themeSound: Phaser.Sound.BaseSound;
  private hintTitle: HintTitle;
  private background: Background;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.bitmapFont('pixelFont', `${_assetsPrefix}/font/font.png`, `${_assetsPrefix}/font/font.fnt`);
    this.load.image("platform", `${_assetsPrefix}/platform.png`);
    this.load.image("mainTitle", `${_assetsPrefix}/wrikey_dog_title.png`);
    this.load.image("hintTitle", `${_assetsPrefix}/hint_title.png`);
    this.load.image("background", `${_assetsPrefix}/background.png`);
    this.load.spritesheet("coin", `${_assetsPrefix}/wrike_coin.png`, { frameWidth: 12, frameHeight: 12 });
    this.load.spritesheet("fluke", `${_assetsPrefix}/fluke.png`,{ frameWidth: 32, frameHeight: 32 });
    this.load.audio("coinSound1", `${_assetsPrefix}/sound/coin_1.wav`);
    this.load.audio("theme", `${_assetsPrefix}/sound/theme.mp3`);
    this.load.audio("drop", `${_assetsPrefix}/sound/drop.wav`);
  }

  create(): void {
    this.background = new Background(this);
    this.platform = new Platform(this);
    this.fluke = new Fluke(this);
    this.coinGroup = new CoinGroup(this);
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
        this.coinGroup.playCollectSound();
      }

      this.coinGroup.coinGroup.killAndHide(coin);
    });

    this.scoreText = this.add.bitmapText(24, 24, 'pixelFont', `SCORE: ${this.score}`, 16);
    this.mainTitle = new MainTitle(this);
    this.hintTitle = new HintTitle(this);
    this.themeSound = this.sound.add('theme');
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
    gameOptions.gameSpeed = gameOptions.initialGameSpeed;
  }

  update(): void {
    if (gameOptions.gameState === GameState.playing) {
      this.updateCounter();

      if (this.counter % this.coinFrequency === 0) {
        this.coinGroup.addCoin(1000, Phaser.Math.Between(+this.game.config.height - 400, +this.game.config.height - 300));
      }

      if(!this.themeSound.isPlaying) {
        this.themeSound.play('', {
          volume: 0.3,
        });
      }
    } else if (gameOptions.gameState === GameState.initial) {
      this.resetGame();
    } else if (gameOptions.gameState === GameState.over) {
      gameOptions.score = this.score;
      this.themeSound.destroy();
      this.gameOver();
    }

    this.mainTitle.update();
    this.hintTitle.update();
    this.fluke.update();
    this.platform.update();
    this.coinGroup.update();
    this.score = ((this.counter / 5) ^ 0) + (this.coinCounter * this.coinValue);
    this.scoreText.setText(`SCORE: ${this.score}`);

    this.level = (this.counter / this.levelFrameThreshold) ^ 0;
    gameOptions.gameSpeed = gameOptions.initialGameSpeed + this.level * this.levelSpeedIncrease;
    this.background.parallax();
  }
}
