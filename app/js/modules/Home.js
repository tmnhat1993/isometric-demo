export default class Common {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    // Elements
    this.$body = $("body");

    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    // Smooth Scrolling Setup
    this.SmoothScrollSetup();
  }

  /* ===================================
   *  METHODS
   * =================================== */
  SmoothScrollSetup() {
    // Select all links with hashes
    $('a[href*="#"]')
      // Remove links that don't actually link to anything
      .not('[href="#"]')
      .not('[href="#0"]')
      .click(function (event) {
        // On-page links
        if (
          location.pathname.replace(/^\//,"") == this.pathname.replace(/^\//,"") &&
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();

            // get height menu for scroll exactly position of div
            var getHeightMenu = 52;
            if ($(window).width() < 767) {
              getHeightMenu = 62;
            }

            $("html, body").animate(
              {
                scrollTop: target.offset().top - getHeightMenu,
              },
              1000
            );
          }
        }
      });
  }
}
