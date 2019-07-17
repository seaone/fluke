import "phaser";
import {Fluke} from "../player/fluke";
import {Platform} from "../objects/platform";

export class GameScene extends Phaser.Scene {
  private fluke: Fluke;
  private platform: Platform;
  private score = 0;
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("platform", "/assets/platform.png");
    this.load.spritesheet("fluke", "/assets/fluke.png",{ frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.platform = new Platform(this);
    this.fluke = new Fluke(this);
    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren());
    this.scoreText = this.add.text(24, 16, `score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
  }

  update(): void {
    this.score++;
    this.fluke.update();
    this.platform.update();
    this.scoreText.setText(`score: ${this.score}`);
  }
}
