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

    const restartBtn = this.add.bitmapText(360, 213, 'pixelFont', `RESTART`, 13);
    restartBtn.setInteractive();
    restartBtn.on('pointerover', () => {
      if(!restartBtn.isTinted) restartBtn.tint = 0x8BC34A;
    });
    restartBtn.on('pointerout', () => {
      restartBtn.clearTint();
    });
    restartBtn.on('pointerup', () => {
      this.scene.stop();
      this.scene.start('GameScene');
      gameOptions.gameState = GameState.initial;
    });

    const exitGameBtn = this.add.bitmapText(360, 245, 'pixelFont', `EXIT GAME`, 13);
    exitGameBtn.setInteractive();
    exitGameBtn.on('pointerover', () => {
      if(!exitGameBtn.isTinted) exitGameBtn.tint = 0xe91e63;
    });
    exitGameBtn.on('pointerout', () => {
      exitGameBtn.clearTint();
    });
    exitGameBtn.on('pointerup', () => {
      console.log('exit game not implemented');
    });

    this.add.image(+this.game.config.width / 2, 127, 'gameOver');
  }

  update(): void {
    this.renderHighScores(this.score, this.highScores);
  }

  renderHighScores(playerScore, highScores) {
    let allScores = highScores.slice();
    allScores.sort((a, b) => b.score - a.score);

    const nameX = 240;
    const scoreX = 496;
    const startingY = 373;
    const fontSize = 13;

    this.add.bitmapText(nameX, 336, 'pixelFont', `TOP PLAYERS`, fontSize);
    this.add.bitmapText(scoreX, 336, 'pixelFont', `SCORE`, fontSize);

    if (this.score > allScores[4].score) {
      let scores = allScores.slice(0, 4);
      scores.push({name: gameOptions.playerName, score: this.score});
      scores.sort((a, b) => b.score - a.score);

      scores.forEach((data, i) => {
        const name = this.add.bitmapText(nameX, startingY + i * 28, 'pixelFont', `${data.name.toUpperCase()}`, fontSize);
        const score = this.add.bitmapText(scoreX + 28, startingY + i * 28, 'pixelFont', `${data.score}`, fontSize);

        if (data.name === gameOptions.playerName && data.score === this.score) {
          name.tint = 0xe91e63;
          score.tint = 0xe91e63;
        }
      });
    } else {
      let scores = allScores.slice(0, 5);

      scores.forEach((data, i) => {
        this.add.bitmapText(nameX, startingY + i * 28, 'pixelFont', `${data.name.toUpperCase()}`, fontSize);
        this.add.bitmapText(scoreX + 28, startingY + i * 28, 'pixelFont', `${data.score}`, fontSize);
      });

      this.add.bitmapText(nameX, startingY + 5 * 28, 'pixelFont', `. . .`, fontSize);

      const name = this.add.bitmapText(nameX, startingY + 6 * 28, 'pixelFont', `${gameOptions.playerName.toUpperCase()}`, fontSize);
      const score = this.add.bitmapText(scoreX + 28, startingY + 6 * 28, 'pixelFont', `${this.score}`, fontSize);

      name.tint = 0xe91e63;
      score.tint = 0xe91e63;
    }
  }
}
