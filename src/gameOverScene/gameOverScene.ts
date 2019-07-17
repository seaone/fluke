import "phaser";
import {gameOptions} from '../gameScene/gameOptions';
import {GameState} from '../gameState';
const _assetsPrefix = 'assets/game_assets';

export class GameOverScene extends Phaser.Scene {
  highScores = [
    {
      name: 'Boryan',
      score: 450,
    },
    {
      name: 'Zheka',
      score: 420,
    },
    {
      name: 'Gleb',
      score: 415,
    },
    {
      name: 'Volodya',
      score: 380,
    },
    {
      name: 'Dimasik',
      score: 358,
    }
  ];

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
    const restartBtn = this.add.bitmapText(360, 213, 'pixelFont', `RESTART`, 13);
    restartBtn.setInteractive();
    restartBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    const exitGameBtn = this.add.bitmapText(360, 245, 'pixelFont', `EXIT GAME`, 13);
    exitGameBtn.setInteractive();

    this.add.image(+this.game.config.width / 2, 127, 'gameOver');
  }

  update(): void {
    this.renderHighScores();
  }

  renderHighScores() {
    const nameX = 240;
    const scoreX = 496;
    const startingY = 373;

    this.add.bitmapText(nameX, 333, 'pixelFont', `TOP PLAYERS`, 13);
    this.add.bitmapText(scoreX, 333, 'pixelFont', `SCORE`, 13);

    this.highScores.forEach((score, i) => {
      this.add.bitmapText(nameX, startingY + i * 28, 'pixelFont', `${score.name}`, 13);
      this.add.bitmapText(scoreX + 28, startingY + i * 28, 'pixelFont', `${score.score}`, 13);
    });
  }
}
