import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Background extends Phaser.GameObjects.TileSprite {
  constructor(_scene: Phaser.Scene) {
    super(_scene, 0, 0, 800, 600, 'background');
    _scene.add.existing(this);

    this.setOrigin(0.).setScrollFactor(0);
  }

  parallax() {
    this.tilePositionX += 1;
  }
}