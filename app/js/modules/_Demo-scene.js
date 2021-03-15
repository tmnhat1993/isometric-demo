// Ultils
import {
  LoadImage,
  SoundEffect,
  DrawScreen,
  ClearScreen,
  pageListener,
} from "./utils";

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

    // Main Animation Timeline Build
    this.Screen_Init();
  }

  Screen_Init() {
    this.DRAW_DATA = DRAW_DATA.DEMO_SCENE;
  }
}
