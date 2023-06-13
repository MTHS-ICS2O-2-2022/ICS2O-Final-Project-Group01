/* global Phaser */

// Copyright (c) 2023 Dominic M. All rights reserved
//
// Created by: Dominic M.
// Created on: Apr 2023
// This is the game Scene

class GameScene extends Phaser.Scene {

    createFloor () {
      // Generate the floor
      const floor = this.physics.add.sprite(1920 + 300, 1080, 'floor')
      this.floorGroup.add(floor)
      floor.body.immovable = true
      floor.body.velocity.x = -200
      floor.setScale(5.0)
      floor.setDepth(3)
      console.log('Floor created')
    }

    createPipe () {
    // Generate the pipes
    let holePosition = Phaser.Math.Between(150, 1080 - 425)
    const topPipe = this.physics.add.sprite(1920 + 150, holePosition - 330, 'pipe')
    const bottomPipe = this.physics.add.sprite(1920 + 150, holePosition + 330 * 2, 'pipe')
    this.topPipeGroup.add(topPipe)
    this.bottomPipeGroup.add(bottomPipe)
    topPipe.setDepth(2)
    bottomPipe.setDepth(2)
    // Change size
    topPipe.setScale(4.5)
    bottomPipe.setScale(4.5)
    // Make them move
    topPipe.body.velocity.x = -200
    bottomPipe.body.velocity.x = -200
    

    // randomly pick orange or green
    if (Phaser.Math.Between(0, 1) === 0) {
      topPipe.setFrame(0)
      bottomPipe.setFrame(0)
    } else {
      topPipe.setFrame(1)
      bottomPipe.setFrame(1)
    }
    console.log('Pipe created')
  }

  birdJump () {
    const keySpaceObj = this.input.keyboard.addKey('SPACE')
    if (keySpaceObj.isDown === true) {
      if (this.jump === false) {
        // fire missile
        this.jump = true
        this.bird.setVelocityY(-500)
        this.sound.play('wing')
      }
    }

    if (keySpaceObj.isUp === true) {
      this.jump = false
    }
  }
  
    constructor () {
      super({ key:'gameScene'})
  
      this.background = null 
      this.bird = null
      this.jump = null
      this.score = 0
      this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
      this.gameOverScore = { font: '65px Arial', fill: '#ffffff', align: 'center' }
    }
  
    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts,
     *   before preload() and create().
     *@param {object} data - Data passed via ScenePlugin.add() or ScenePlugin.start().
    */
    init (data) {
      this.cameras.main.setBackgroundColor('#ffffff')
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to load assets.
     */
    preload () {
      console.log('Game Scene')
      // Audio
      this.load.image('gameSceneBackground', './assets/background.png')
      this.load.audio('die', './assets/audio/die.wav')
      this.load.audio('hit', './assets/audio/hit.wav')
      this.load.audio('point', './assets/audio/point.wav')
      this.load.audio('wing', './assets/audio/wing.wav')
      // Pipes
      this.load.spritesheet('pipe', './assets/tileset/pipe.png', {
        frameWidth: 32,
        frameHeight: 160
      })
      this.load.spritesheet('bird', './assets/player/bird1.png', {
        frameWidth: 16,
        frameHeight: 15
      })
      this.load.image('floor', './assets/tileset/floor.png')
    }
  
    /**
     * Can be defined on your own Scenes.
     * Use it to create your game objects.
     * @param {object} data - Data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    create (data) {
      // First side of background
      this.menuSceneBackgroundImage = this.add.sprite(1920 - 170, 1080 / 2 - 100, 'menuSceneBackground')
      this.menuSceneBackgroundImage.setScale(5.0)
      this.menuSceneBackgroundImage.setDepth(1)
      // Second side of background
      this.menuSceneBackgroundImage2 = this.add.sprite((1920 / 2) / 2, 1080 / 2 - 100, 'menuSceneBackground')
      this.menuSceneBackgroundImage2.setScale(5.0)
      this.menuSceneBackgroundImage2.setDepth(1)

      // Score
      this.scoreText = this.add.text(16, 16, 'Score: 0', this.scoreTextStyle)

      // Bird group and creation
      this.bird = this.physics.add.sprite(1920 / 2 - 200, 1080 / 2, 'bird').setScale(5.0)
      this.bird.setGravityY(1000)
      this.bird.setFrame(0)
      this.bird.setDepth(4)

      // Pipe groups and creation
      this.topPipeGroup = this.physics.add.group()
      this.bottomPipeGroup = this.physics.add.group()
      this.createPipe()

      // Floor group and creation
      this.floorGroup = this.physics.add.group()
      // Generate first set of floors
      this.floor = this.add.sprite(1920 / 2, 1080, 'floor')
      this.floor2 = this.add.sprite(1920 / 6, 1080, 'floor')
      this.floor3 = this.add.sprite(1920 - (1920 / 6), 1080, 'floor')
      this.floor.setScale(5)
      this.floor2.setScale(5)
      this.floor3.setScale(5)
      this.floorGroup.add(this.floor)
      this.floorGroup.add(this.floor2)
      this.floorGroup.add(this.floor3)
      this.floor.body.velocity.x = -200
      this.floor2.body.velocity.x = -200
      this.floor3.body.velocity.x = -200
      this.floor.setDepth(3)
      this.floor2.setDepth(3)
      this.floor3.setDepth(3)
      this.createFloor()
    }
    
  
    /**
     * Should be overridden by your own Scenes.
     * This method is called once per game step while the scene is running.
     * @param {number} time - The current time.
     * @param {number} delta - The delta time in ms since the last frame.
     */
    update (time, delta) {
        this.birdJump()

        if (this.bird.y > 1080) {
          this.sound.play('hit')
          // this.scene.restart()
        } else if (this.bird.y < 0) {
          this.bird.y = 1
        }

        let rotationAngle = Math.PI / 4 * (this.bird.body.velocity.y * 0.005 )
        this.bird.rotation = rotationAngle
        if (this.bird.rotation > 1) {
          this.bird.rotation = 1
        }

        // Generate more floors
        this.floorGroup.getChildren().forEach((floor) => {
          if (floor.x < -300) {
            floor.destroy()
            this.createFloor()
          }
        })

        // Generate more pipes
        this.topPipeGroup.getChildren().forEach((topPipe) => {
          if (topPipe.x < -70) {
            topPipe.destroy()
          }
        })
        this.bottomPipeGroup.getChildren().forEach((bottomPipe) => {
          if (bottomPipe.x < -70) {
            bottomPipe.destroy()
          }
          if (bottomPipe.x < this.bird.x && bottomPipe.x > this.bird.x - 4) {
            let stop = false
            if (stop === false) {
            stop = true
            this.score += 1
            this.scoreText.setText('Score: ' + this.score)
            this.sound.play('point')
          }
        }
          if (bottomPipe.x < this.bird.x + 675 && bottomPipe.x > this.bird.x + 675 - 4) {
            this.createPipe()
          }
        })
  }
}
export default GameScene
