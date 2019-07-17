import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class Background extends Phaser.GameObjects.TileSprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 800, 600, 'background');
    scene.add.existing(this);

    this.setOrigin(0.).setScrollFactor(0);
  }

  parallax() {
    this.tilePositionX += 2;
  }
}