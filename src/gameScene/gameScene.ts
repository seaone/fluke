import "phaser";
import {Fluke} from "../player/fluke";
import {Platform} from "../objects/platform";
import {gameOptions} from "./gameOptions";

export class GameScene extends Phaser.Scene {
  private fluke: Fluke;
  private platform: Platform;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image("platform", "/assets/platform.png");
    this.load.image("mainTitle", "/assets/wrikey_dog_title.png");
    this.load.spritesheet("fluke", "/assets/fluke.png",{ frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.platform = new Platform(this);

    this.fluke = new Fluke(this);

    this.physics.add.collider(this.fluke.sprite, this.platform.platformGroup.getChildren());
    this.add.image(+this.game.config.width / 2, +this.game.config.height / 4, 'mainTitle');
  }

  update():void {
    this.fluke.update();
    this.platform.update();
  }
}