/* global Phaser */

// Copyright (c) 2023 Dominic M. & Mohamad T. All rights reserved
//
// Created by: Dominic M. & Mohamad T.
// Created on: Apr 2023
// This is the Splash Scene

class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: "splashScene" })

    this.splashSceneBackgroundImage = null
  }

  /**
   * Can be defined on your own Scenes.
   * This method is called by the Scene Manager when the scene starts,
   *   before preload() and create().
   *@param {object} data - Data passed via ScenePlugin.add() or ScenePlugin.start().
   */
  init(data) {
    this.cameras.main.setBackgroundColor("#ffffff")
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to load assets.
   */
  preload() {
    console.log("Splash Scene")
    this.load.image("splashSceneBackground", "./assets/splashSceneImage.png")
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to create your game objects.
   * @param {object} data - Data passed via ScenePlugin.add() or ScenePlugin.start().
   */
  create(data) {
    this.splashSceneBackgroundImage = this.add.sprite(
      1920 / 2,
      1080 / 2,
      "splashSceneBackground"
    )
  }

  /**
   * Should be overridden by your own Scenes.
   * This method is called once per game step while the scene is running.
   * @param {number} time - The current time.
   * @param {number} delta - The delta time in ms since the last frame.
   */
  update(time, delta) {
    // wait 3 seconds then move to the next scene
    if (time > 3000) {
      this.scene.switch("titleScene")
    }
  }
}

export default SplashScene
