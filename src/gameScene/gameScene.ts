import "phaser";
import { SoundToggleButton } from "../controls/soundToggleButton";
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
  score: number = gameOptions.score;
  counter = 0;
  coinCounter = 0;
  scoreText: Phaser.GameObjects.BitmapText;
  level = 1;
  levelFrameThreshold = 500;
  levelSpeedIncrease = 50;
  coinValue = 50;
  coinFrequency = 150;
  private hiscoreText: Phaser.GameObjects.BitmapText;
  private themeSound: Phaser.Sound.BaseSound;
  private hintTitle: HintTitle;
  private background: Background;
  private soundToggleButton: SoundToggleButton;

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
    this.load.image("background", `${_assetsPrefix}/background_snow-forest.png`);
    this.load.spritesheet("coin", `${_assetsPrefix}/wrike_coin.png`, {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet("fluke", `${_assetsPrefix}/fluke.png`, {frameWidth: 128, frameHeight: 128});
    this.load.spritesheet("soundIcon", `${_assetsPrefix}/sound_icon.png`, {frameWidth: 32, frameHeight: 32});
    this.load.audio("coinSound", `${_assetsPrefix}/sound/coin.wav`);
    this.load.audio("platformSound", `${_assetsPrefix}/sound/platform.wav`);
    this.load.audio("theme", `${_assetsPrefix}/sound/theme.mp3`);
    this.load.audio("drop", `${_assetsPrefix}/sound/drop.wav`);
  }

  create(): void {
    this.background = new Background(this);
    this.platform = new Platform(this);
    this.fluke = new Fluke(this);
    this.coinGroup = new CoinGroup(this);
    this.soundToggleButton = new SoundToggleButton(this);

    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren(), (fluke, pl) => {
      let platform = pl as Phaser.Physics.Arcade.Sprite;

      if (this.fluke.sprite.body.touching.left || this.fluke.sprite.body.touching.right || this.fluke.sprite.body.touching.up) {
        this.fluke.isTouchPlatformEdge = true;
      } else {
        this.fluke.isTouchPlatformEdge = false;

        if (platform.active) {
          platform.tint = 0x8BC34A;
          this.platform.playCollisionSound();
          platform.active = false;
        }
      }
    });

    this.physics.add.overlap(this.fluke.sprite, this.coinGroup.coinGroup.getChildren(), (player, coin) => {
      let c = coin as Phaser.Physics.Arcade.Sprite;
      c.disableBody();

      if (c.active) {
        this.coinCounter++;
        this.coinGroup.playCollectSound();
      }

      this.coinGroup.coinGroup.killAndHide(c);
    });

    this.soundToggleButton.sprite.setInteractive();
    this.soundToggleButton.sprite.on('pointerup', () => {
      this.soundToggleButton.toggle();
    }, this);

    this.scoreText = this.add.bitmapText(24, 24, 'pixelFont', `SCORE: ${this.score}`, 16);
    this.hiscoreText = this.add.bitmapText(this.scoreText.width + 48, 28, 'pixelFont', `HISCORE: ${gameOptions.hiscore}`, 12);
    this.hiscoreText.alpha = 0.5;
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

      if (gameOptions.soundIsOn) {
        if (!this.themeSound.isPlaying) {
          this.themeSound.play('', {
            volume: 0.33,
          });
        }
      } else {
        this.themeSound.pause();
      }
    } else if (gameOptions.gameState === GameState.initial) {
      this.resetGame();
    } else if (gameOptions.gameState === GameState.over) {
      gameOptions.score = this.score;

      if (this.score > gameOptions.hiscore) {
        gameOptions.hiscore = this.score;
      }

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
    this.hiscoreText.setText(`HISCORE: ${gameOptions.hiscore}`);
    this.hiscoreText.x = this.scoreText.width + 48;

    this.level = (this.counter / this.levelFrameThreshold) ^ 0;
    gameOptions.gameSpeed = gameOptions.initialGameSpeed + this.level * this.levelSpeedIncrease;
    this.background.parallax();
  }
}
