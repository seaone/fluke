import "phaser";
import {gameOptions} from '../gameScene/gameOptions';
import {GameState} from '../gameState';

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
    this.load.bitmapFont('pixelFont', 'assets/font/font.png', 'assets/font/font.fnt');
    this.load.image("gameOver", "/assets/game_over.png");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#000000");
    const restartBtn = this.add.bitmapText(340, 213, 'pixelFont', `RESTART`, 18);
    restartBtn.setInteractive();
    restartBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    const exitGameBtn = this.add.bitmapText(340, 245, 'pixelFont', `EXIT GAME`, 18);
    exitGameBtn.setInteractive();

    this.add.image(+this.game.config.width / 2 + 20, 120, 'gameOver');
  }

  update(): void {
    this.renderHighScores();
  }

  renderHighScores() {
    const nameX = 250;
    const scoreX = 484;
    const startingY = 373;

    this.add.bitmapText(nameX, 333, 'pixelFont', `TOP PLAYERS`, 18);
    this.add.bitmapText(scoreX, 333, 'pixelFont', `SCORE`, 18);

    this.highScores.forEach((score, i) => {
      this.add.bitmapText(nameX, startingY + i * 32, 'pixelFont', `${score.name}`, 18);
      this.add.bitmapText(scoreX + 36, startingY + i * 32, 'pixelFont', `${score.score}`, 18);
    });
  }
}
