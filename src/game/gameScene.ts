import "phaser";

export class GameScene extends Phaser.Scene {

  gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [100, 350],
    platformSizeRange: [50, 250],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2
  };

  player: Phaser.Physics.Arcade.Sprite;
  playerJumps: number;
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  nextPlatformDistance: number;
  private anim: Phaser.Animations.Animation | false;

  constructor() {
    super({
      key: "GameScene"
    });
  }
  init(params): void {
    // TODO
  }
  preload(): void {
    this.load.image("platform", "/assets/platform.png");
    this.load.spritesheet("fluke", "/assets/fluke.png",{ frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.platformGroup = this.add.group({
      removeCallback: function(platform){
        this.scene.platformPool.add(platform);
      }
    });

    this.platformPool = this.add.group({
      removeCallback: function(platform){
        this.scene.platformGroup.add(platform)
      }
    });

    this.playerJumps = 0;

    this.addPlatform(this.game.config.width, +this.game.config.width / 2);

    this.anim = this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('fluke', {start: 0, end: 3}),
      frameRate: 16,
      repeat: -1,
    });

    this.player = this.physics.add.sprite(this.gameOptions.playerStartPosition, +this.game.config.height / 2, "fluke").setScale(4);
    this.player.body.setSize(16, 18);
    this.player.body.setOffset(9, 7);
    this.player.anims.load('run');
    this.player.setGravityY(this.gameOptions.playerGravity);

    this.physics.add.collider(this.player, this.platformGroup);

    this.input.on("pointerdown", this.jump, this);
  }

  update(){
    if(this.player.y > this.game.config.height) {
      this.scene.start("GameScene");
    }

    this.player.x = this.gameOptions.playerStartPosition;

    if(!this.player.body.touching.down) {
      this.player.anims.play('run');
    }

    let minDistance = +this.game.config.width;

    this.platformGroup.getChildren().forEach((platform) => {
      let platformDistance = +this.game.config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);

      if(platform.x < - platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    });

    if(minDistance > this.nextPlatformDistance) {
      var nextPlatformWidth = Phaser.Math.Between(this.gameOptions.platformSizeRange[0], this.gameOptions.platformSizeRange[1]);
      this.addPlatform(nextPlatformWidth, +this.game.config.width + nextPlatformWidth / 2);
    }
  }

  addPlatform(platformWidth, posX){
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(posX, +this.game.config.height * 0.8, "platform");
      platform.setImmovable(true);
      platform.setVelocityX(this.gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(this.gameOptions.spawnRange[0], this.gameOptions.spawnRange[1]);
  }

  jump(): void {
    if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < this.gameOptions.jumps)) {
      if(this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(this.gameOptions.jumpForce * -1);
      this.playerJumps ++;
    }
  }
}