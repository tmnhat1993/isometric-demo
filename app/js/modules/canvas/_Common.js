export default class Common {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    // Elements
    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    window.IS_MOBILE = window.innerWidth <= 860;

    // Game State
    window.gameState = {
      showDebug: false,
      orientation: null,
    };

    // After orientation change detect event
    window.orientationChanged = () => {
      const timeout = 120;
      return new window.Promise(function (resolve) {
        const go = (i,height0,width0) => {
          // alert(i + ", " + height0 + ", " + width0);
          (document.querySelector(".mold-element").offsetHeight != height0 &&
            document.documentElement.clientWidth != width0) ||
            i >= timeout
            ? resolve()
            : window.requestAnimationFrame(() => go(i + 1,height0));
        };
        go(
          0,
          document.querySelector(".mold-element").offsetHeight,
          document.documentElement.clientWidth
        );
      });
    };

    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // The element used to measure the window height
    let moldHeight = document.querySelector(".mold-element").offsetHeight;

    // Calculating native inner width and height of the browser, both iOS and others
    let widthIOS = document.documentElement.clientWidth;
    let heightIOS = iOS
      ? moldHeight - 85
      : document.documentElement.clientHeight;
    let ratio = widthIOS / heightIOS;

    // Game Data
    window.GAME_DATA = {
      SCREEN_WIDTH: widthIOS,
      SCREEN_HEIGHT: heightIOS,
      RATIO: ratio,
    };
  }

  /* ===================================
   *  METHODS
   * =================================== */
}
