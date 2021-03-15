// Libraries
import DRAW_DATA from "../data/draw-data";
import * as PIXI from "pixi.js";

// Ultils
import { pageListener,ClearScreen } from "./utils";

// Behavior
import Common from "./_Common";

// Scene
import Demo from "./_Demo-scene";

export default class Home {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    window.PIXI = PIXI;
    window.DRAW_DATA = DRAW_DATA;

    // Page Listener
    window.PageListener = new pageListener();
    window.appScenes = {};
    window.appState = {}

    // Event Listeners Object, Detect Device, Global variables
    let common = new Common();

    // Demo Scene
    let demo = new Demo();

    // Bind Event
    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    this.CanvasSetup();
  }

  /* ===================================
   *  METHODS
   * =================================== */
  CanvasSetup() {
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas";
    }

    PIXI.utils.skipHello();

    PIXI.settings.SORTABLE_CHILDREN = true;

    // Allow Blurry but scaled images
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

    let canvasContainer = document.getElementById("gameplay-canvas");

    //Create a Pixi Application
    window.app = new PIXI.Application({
      width: GAME_DATA.SCREEN_WIDTH,
      height: GAME_DATA.SCREEN_HEIGHT,
      backgroundColor: 0x333333,
      // resolution: window.devicePixelRatio || 1,
    });

    window.app.renderer.autoResize = true;

    // Loading Bar
    this.DrawLoadingLayer();

    // Images Loader
    if (!IS_MOBILE) {
      // console.log("is desktop");
      window.app.loader
        .add(DRAW_DATA.COMMON.imagePaths)
        .load(() => {
          PageListener.emit("start-demo");
        });
    } else {
      // console.log("is mobile");
      window.app.loader
        .add(DRAW_DATA.COMMON.imagePathsMobile)
        .load(() => {
          PageListener.emit("start-demo");
        });
    }

    window.app.loader.onLoad.add((e) => {
      // Redraw the progress bar
      this.Loading_Bar_Progress.clear();
      this.Loading_Bar_Progress.beginFill(this.LOADER_DRAW_DATA.color);
      this.Loading_Bar_Progress.drawRect(
        this.LOADER_DRAW_DATA.x,
        this.LOADER_DRAW_DATA.y,
        this.LOADER_DRAW_DATA.width * (e.progress / 100),
        this.LOADER_DRAW_DATA.height
      );
      this.Loading_Bar_Progress.endFill();
      // console.log(e.progress);
    });

    //Add the canvas that Pixi automatically created for you to the HTML document
    canvasContainer.appendChild(window.app.view);

    // Support Main Canvas Function
    // this.ChangeCursor();
  }

  // LOADING FEATURE
  DrawLoadingLayer() {
    // Loading Layer Setup
    ClearScreen();
    appScenes.Loading_Scene = new PIXI.Container();
    gameState.currentSceneName = "loading-scene";
    window.appState.currentScene = appScenes.Loading_Scene;

    app.stage.addChild(appScenes.Loading_Scene);

    // Loading Layer Draw Data
    this.LOADER_DRAW_DATA = {
      x: 0.33 * GAME_DATA.SCREEN_WIDTH,
      y: 0.48 * GAME_DATA.SCREEN_HEIGHT,
      width: 0.333 * GAME_DATA.SCREEN_WIDTH,
      height: 0.04 * GAME_DATA.SCREEN_HEIGHT,
      color: 0x0191da,
    };

    // Drawing Detail
    this.Loading_Container = new PIXI.Container();

    // Background
    this.Loading_Background = new PIXI.Graphics();
    this.Loading_Background.zIndex = 1;
    this.Loading_Background.beginFill(0xffffff);
    this.Loading_Background.drawRect(
      0,
      0,
      GAME_DATA.SCREEN_WIDTH,
      GAME_DATA.SCREEN_HEIGHT
    );
    this.Loading_Background.endFill();

    // Main Loading Bar
    this.Loading_Bar = new PIXI.Container();
    this.Loading_Bar.zIndex = 2;

    // Loading Bar Border
    this.Loading_Bar_Border = new PIXI.Graphics();
    this.Loading_Bar_Border.zIndex = 2;
    this.Loading_Bar_Border.lineStyle(2,this.LOADER_DRAW_DATA.color);
    this.Loading_Bar_Border.drawRect(
      this.LOADER_DRAW_DATA.x,
      this.LOADER_DRAW_DATA.y,
      this.LOADER_DRAW_DATA.width,
      this.LOADER_DRAW_DATA.height
    );

    // Loading Bar Progress
    this.Loading_Bar_Progress = new PIXI.Graphics();
    this.Loading_Bar_Progress.zIndex = 2;
    this.Loading_Bar_Progress.beginFill(this.LOADER_DRAW_DATA.color);
    this.Loading_Bar_Progress.drawRect(
      this.LOADER_DRAW_DATA.x,
      this.LOADER_DRAW_DATA.y,
      0,
      this.LOADER_DRAW_DATA.height
    );
    this.Loading_Bar_Progress.endFill();

    // Add everything into Loading bar container
    this.Loading_Bar.addChild(
      this.Loading_Bar_Border,
      this.Loading_Bar_Progress
    );

    // Add everything into Loading Container
    this.Loading_Container.addChild(this.Loading_Background,this.Loading_Bar);

    // Add Content into main layer
    appScenes.Loading_Scene.addChild(this.Loading_Container);
  }

  // CHANGE THE DEFAULT CURSOR
  ChangeCursor() {
    const defaultCursor = "url('images/common/cursor.png'), auto";
    app.renderer.plugins.interaction.cursorStyles.default = defaultCursor;
  }
}
