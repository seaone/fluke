import "phaser";
import {gameOptions} from "../gameScene/gameOptions";

export class SoundToggleButton {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private isOn: boolean = gameOptions.soundIsOn;

  constructor(private _scene: Phaser.Scene) {
    this.create(this._scene);
  }

  private create(scene: Phaser.Scene): void {
    this.sprite = scene.physics.add.sprite(+scene.game.config.width - 24, 24, "soundIcon");
  }

  public toggle(): void {
    this.isOn = !this.isOn;

    if (this.isOn) {
      this.sprite.setFrame(0);
      this.sprite.clearTint();
    } else {
      this.sprite.setFrame(1);
      this.sprite.tint = 0xe91d63;
    }
  }
}