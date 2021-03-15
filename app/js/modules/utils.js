import DRAW_DATA from "../data/draw-data";
import PIXI_SOUND from "pixi-sound";

// Custom Event Listener
function pageListener() {
  this.events = {};
}

pageListener.prototype.on = function (eventType, listener) {
  // If the eventType Property not exist yet, create an empty aray of that property
  this.events[eventType] = this.events[eventType] || [];
  this.events[eventType].push(listener);
};

pageListener.prototype.emit = function (eventType, params) {
  if (this.events[eventType] && this.events[eventType].length > 0) {
    // Loop through the events[eventType] array of function and invoke each of them
    this.events[eventType].forEach(function (item) {
      item(params);
    });
  }
};

// Load Single Image From Its Path
let LoadImage = (imagePath) => {
  if (typeof imagePath == "string") {
    return new PIXI.Sprite(app.loader.resources[imagePath].texture);
  } else {
    if (window.innerWidth <= 860 && imagePath.pathMb !== undefined) {
      return new PIXI.Sprite(app.loader.resources[imagePath.pathMb].texture);
    } else {
      return new PIXI.Sprite(app.loader.resources[imagePath.path].texture);
    }
  }
};

let LoadText = (context, style) => {
  let trueStyle = Object.assign({}, style);
  if (IS_MOBILE) {
    trueStyle.fontSize = (trueStyle.fontSize * DRAW_DATA.SCREEN_WIDTH) / 1024;
    trueStyle.lineHeight =
      (trueStyle.lineHeight * DRAW_DATA.SCREEN_WIDTH) / 1024;
  }
  let textStyle = new PIXI.TextStyle(trueStyle);
  return new PIXI.Text(context, textStyle);
};

// Load Sound Effect
let SoundEffect = (soundName, action = "play") => {
  const EFFECT_SOUNDS = {
    clickButton: "sounds/click_button.wav",
    airPlaneFly: "sounds/airplane_fly.wav",
    haveMail: "sounds/have_mail.wav",
    dropPuzzle: "sounds/drop_puzzle.wav",
    milkCow: "sounds/milk_cow.wav",
    straw: "sounds/straw.wav",
    ablumBook: "sounds/ablum_book.mp3",
    buyFail: "sounds/buy_fail.wav",
    camera: "sounds/camera.wav",
    finishGame: "sounds/finish_game.wav",
    successGame: "sounds/success_game.wav",
  };

  // Init sound name inside PIXI Loader
  for (let name in EFFECT_SOUNDS) {
    try {
      PIXI.Loader.shared.add(name, EFFECT_SOUNDS[name]);
    } catch (error) {}
  }

  // Play sound
  PIXI.Loader.shared.load(function (loader, resources) {
    if (resources[soundName]) {
      return action === "stop"
        ? PIXI_SOUND.stop(soundName)
        : PIXI_SOUND.play(soundName);
    }
  });
};

// * - IMAGE
let DrawImage = (elem, posData) => {
  elem.anchor.x = 0.5;
  elem.anchor.y = 0.5;
  //Change the sprite's position
  elem.x =
    posData.x * GAME_DATA.SCREEN_WIDTH +
    posData.width * 0.5 * GAME_DATA.SCREEN_WIDTH;
  elem.y =
    posData.y * GAME_DATA.SCREEN_HEIGHT +
    posData.height * 0.5 * GAME_DATA.SCREEN_HEIGHT;

  if (posData.zIndex) {
    elem.zIndex = posData.zIndex;
  }
  elem.alpha = 1;

  //Change the sprite's size
  elem.width = posData.width * GAME_DATA.SCREEN_WIDTH;
  elem.height = posData.height * GAME_DATA.SCREEN_HEIGHT;
};

// * - Text
let DrawText = (elem, posData) => {
  //Change the sprite's position
  elem.x = posData.x * GAME_DATA.SCREEN_WIDTH;
  elem.y = posData.y * GAME_DATA.SCREEN_HEIGHT;
  // elem.alpha = 1;

  // elem.zIndex = posData.zIndex;
};

let DrawScreen = (Elements, Container, ScreenNo = 1) => {
  for (const [key, value] of Object.entries(Elements)) {
    // Move the elements to its correct position and size
    switch (DRAW_DATA[`SCREEN_${ScreenNo}_ELEMENT_SIZE`][key].type) {
      case "image":
        DrawImage(value, DRAW_DATA[`SCREEN_${ScreenNo}_ELEMENT_SIZE`][key]);
        break;
      case "text":
        DrawText(value, DRAW_DATA[`SCREEN_${ScreenNo}_ELEMENT_SIZE`][key]);
        break;
    }

    // Add element into the Container
    Container.addChild(value);
  }

  // Interaction Area Of The Scene
  appScenes[`Scene_${ScreenNo}`].hitArea = new PIXI.Rectangle(
    0,
    0.074 * GAME_DATA.SCREEN_HEIGHT,
    GAME_DATA.SCREEN_WIDTH,
    0.94 * GAME_DATA.SCREEN_HEIGHT
  );

  // Add Screen To the Stage
  window.app.stage.addChild(window.appScenes[`Scene_${ScreenNo}`]);
  window.appState.currentScene = window.appScenes[`Scene_${ScreenNo}`];
};

let ClearScreen = (ScreenNo) => {
  if (window.appState.currentScene) {
    // Remove All Childran From Scene
    window.appState.currentScene.children.forEach((elem) => {
      window.appState.currentScene.removeChild(elem);
    });

    // Remove the scene itself from stage
    window.app.stage.removeChild(window.appState.currentScene);
  }
};

let ShowDebugScene = (SceneNo = 1) => {
  let $debugElements = document.querySelectorAll(".debug-message .debug-scene");

  let $targetDebugScene = document.getElementById(
    `screen-${SceneNo}-message-block`
  );
  $debugElements.forEach((item) => {
    // console.log(item.style);
    item.style.display = "none";
  });
  $targetDebugScene.style.display = "block";
};

let ApplyHoverFilter = (element) => {
  element.tint = 0xc9eeff;
};

let RemoveHoverFilter = (element) => {
  element.tint = 0xffffff;
};

let DrawNumber = (number, type, color, size) => {
  let numberSring = "" + number;
  let numberStyle = {
    x: 0,
    y: 0,
    width: 0.05,
  };

  let tint = color ? color : 0x000000;
  let fontFamily = type == 1 ? "mplus" : "hira";

  let numberContainer = new PIXI.Container();
  numberContainer.tint = tint;

  let ratio = fontFamily == "mplus" ? 1.25 : 1.5;

  let imagePath = IS_MOBILE
    ? "images/common/number/mb/"
    : "images/common/number/";

  if (numberSring.length > 0) {
    for (let i = 0; i < numberSring.length; i++) {
      let digit = numberSring.charAt(i);

      let digitImage = LoadImage(`${imagePath}${digit}-${fontFamily}.png`);
      digitImage.width = size;
      digitImage.height = size * ratio;
      digitImage.y = 0;
      digitImage.x = i * size * 1.25;
      digitImage.tint = tint;
      numberContainer.addChild(digitImage);
    }
  }

  return numberContainer;
};

// Export all utils functions
export {
  pageListener,
  LoadImage,
  LoadText,
  DrawScreen,
  ClearScreen,
  DrawImage,
  DrawText,
  ApplyHoverFilter,
  RemoveHoverFilter,
  DrawNumber,
  SoundEffect,
};
