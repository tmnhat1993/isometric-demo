// Ultils
import {
  LoadImage,
  SoundEffect,
  DrawScreen,
  ClearScreen,
  pageListener,
  CreateGradTexture
} from "../utils";

export default class DemoScene {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    this.Scene1Listener = new pageListener();
    // Bind Event
    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    // All Assets ready, page first load
    PageListener.on("asset-ready",() => {
      // Clear Old Scene
      ClearScreen();

      // Setup New Scene
      this.SetupScene1();
    });

    // Back to Screen 1
    PageListener.on("start-demo",() => {
      // Clear Old Scene
      ClearScreen();

      // Setup New Scene
      this.SetupScene();
    });

    PageListener.on("reset",() => {
      PageListener.emit("start-demo");
    });
  }

  SetupScene() {
    // Screen 1 Main Container
    window.appScenes.DemoScene = new PIXI.Container();

    // Add Demo Scene into stage
    app.stage.addChild(window.appScenes.DemoScene);

    // Draw the demo Screen
    this.DrawScene();

    // Main Animation Timeline Build
    this.ResetScene();
  }

  DrawScene() {
    // Gradient Texture
    this.GradTexture = CreateGradTexture();

    this.SceneBg = new PIXI.Sprite(this.GradTexture);
    this.SceneBg.position.set(0,0);
    this.SceneBg.width = GAME_DATA.SCREEN_WIDTH;
    this.SceneBg.height = GAME_DATA.SCREEN_HEIGHT;

    appScenes.DemoScene.addChild(this.SceneBg);
  }

  ResetScene() {
    this.DRAW_DATA = DRAW_DATA.DEMO_SCENE;
  }
}
