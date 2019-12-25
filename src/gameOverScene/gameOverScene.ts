import "phaser";
import { gameOptions } from '../gameScene/gameOptions';
import { GameState } from '../gameState';
const _assetsPrefix = 'assets';

export class GameOverScene extends Phaser.Scene {
  score: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({
      key: "GameOverScene"
    });
  }

  preload(): void {
    this.load.bitmapFont('pixelFont', `${_assetsPrefix}/font/font.png`, `${_assetsPrefix}/font/font.fnt`);
    this.load.image("gameOver", `${_assetsPrefix}/game_over.png`);
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#000000");
    this.score = gameOptions.score;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.bitmapText(257, 536, 'pixelFont', `PRESS SPACE TO RESTART`, 13);

    const spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    spacebar.on('up', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    const arrowUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    arrowUp.on('up', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    this.add.image(+this.game.config.width / 2, 271, 'gameOver');
  }

  update(): void {
    this.renderHighScores(this.score);
  }

  renderHighScores(playerScore) {
    const fontSize = 13;
    const scoreSize = playerScore.toString().split('').length * 8;

    this.add.bitmapText(24, 24, 'pixelFont', `Music by Eric Skiff`, 10);
    this.add.bitmapText(300, 356, 'pixelFont', `YOUR SCORE: ` + playerScore.toString().padStart('4', '0'), fontSize);
  }

  private leftPad(num: number) {
    return num.toString().padStart(5, '0');
  }
}
