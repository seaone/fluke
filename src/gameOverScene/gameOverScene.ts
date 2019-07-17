import "phaser";
import {gameOptions} from '../gameScene/gameOptions';
import {GameState} from '../gameState';
const _assetsPrefix = 'assets/game_assets';

export class GameOverScene extends Phaser.Scene {
  score: number;
  highScores: {name: string, score: number}[];
  mockHighScores = [
    {
      name: 'Boryan',
      score: 350,
    },
    {
      name: 'Zheka',
      score: 220,
    },
    {
      name: 'Gleb',
      score: 415,
    },
    {
      name: 'Volodya',
      score: 480,
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
    this.highScores = this.mockHighScores;
    this.cameras.main.setBackgroundColor("#000000");
    this.score = gameOptions.score;

    const restartBtn = this.add.bitmapText(360, 213, 'pixelFont', `RESTART`, 18);
    restartBtn.setInteractive();
    restartBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    const exitGameBtn = this.add.bitmapText(340, 245, 'pixelFont', `EXIT GAME`, 18);
    exitGameBtn.setInteractive();
    exitGameBtn.on('pointerdown', () => {
      console.log('exit game not implemented');
    });

    this.add.image(+this.game.config.width / 2 + 20, 120, 'gameOver');
  }

  update(): void {
    this.renderHighScores(this.score, this.highScores);
  }

  renderHighScores(playerScore, highScores) {
    let allScores = highScores.slice();
    allScores.sort((a, b) => b.score - a.score);

    const nameX = 250;
    const scoreX = 484;
    const startingY = 340;
    const fontSize = 16;

    this.add.bitmapText(nameX, 300, 'pixelFont', `TOP PLAYERS`, fontSize);
    this.add.bitmapText(scoreX, 300, 'pixelFont', `SCORE`, fontSize);

    if (this.score > allScores[4].score) {
      let scores = allScores.slice(0, 4);
      scores.push({name: gameOptions.playerName, score: this.score});
      scores.sort((a, b) => b.score - a.score);

      scores.forEach((data, i) => {
        const name = this.add.bitmapText(nameX, startingY + i * 32, 'pixelFont', `${data.name}`, fontSize);
        const score = this.add.bitmapText(scoreX + 36, startingY + i * 32, 'pixelFont', `${data.score}`, fontSize);

        if (data.name === gameOptions.playerName && data.score === this.score) {
          name.tint = 0xe91e63;
          score.tint = 0xe91e63;
        }
      });
    } else {
      let scores = allScores.slice(0, 5);

      scores.forEach((data, i) => {
        this.add.bitmapText(nameX, startingY + i * 32, 'pixelFont', `${data.name}`, fontSize);
        this.add.bitmapText(scoreX + 36, startingY + i * 32, 'pixelFont', `${data.score}`, fontSize);
      });

      this.add.bitmapText(nameX, startingY + 5 * 32, 'pixelFont', `. . .`, fontSize);

      const name = this.add.bitmapText(nameX, startingY + 6 * 32, 'pixelFont', `${gameOptions.playerName}`, fontSize);
      const score = this.add.bitmapText(scoreX + 36, startingY + 6 * 32, 'pixelFont', `${this.score}`, fontSize);

      name.tint = 0xe91e63;
      score.tint = 0xe91e63;
    }
  }
}