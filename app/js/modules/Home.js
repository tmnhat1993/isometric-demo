import { TweenMax } from 'gsap';
import { pageListener } from './utils';

import VideoPlayer from './_VideoPlayer';

export default class Common {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    window.PageListener = new pageListener();

    let videoPlayer = new VideoPlayer();

    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    // Smooth Scrolling Setup
    this.SmoothScrollSetup();

    this.InitPage();

    // Setup The Clock
    this.ClockSetup();

    // Setup Time Control
    this.TimeControlSetup();
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

  InitPage() {
    // Elements Variables
    this.$RoomBg = $('#room-bg');
    this.$RoomRug = $('#room-rug');
    this.$RoomDesk = $('#room-desk');
    this.$RoomShelf = $('#room-shelf');
    this.$RoomBed = $('#room-bed');
    this.$RoomClock = $('#room-clock');
    this.$ScreenMonitor = $('#on-screen-monitor');

    // Information Layer
    this.$clockArea = $('#clock-area');
    this.$controlArea = $('#control-area');

    // First State
    TweenMax.set([
      this.$RoomBg,
      this.$RoomRug,
      this.$RoomDesk,
      this.$RoomShelf,
      this.$RoomBed,
      this.$RoomClock,
      this.$clockArea,
      this.$controlArea
    ],{ autoAlpha: 0 });

    // Timeline Build
    this.roomTimeline = new TimelineMax({
      onComplete: () => {
        this.$ScreenMonitor.addClass('active');
      }
    });

    // Room Animation
    this.roomTimeline.add('anim-start');
    this.roomTimeline.fromTo([
      this.$RoomBg,this.$RoomClock
    ],1,{
      autoAlpha: 0,
      y: window.innerHeight * 0.1,
    },{
      autoAlpha: 1,
      y: 0
    },'anim-start');

    this.roomTimeline.staggerFromTo([
      this.$RoomDesk,
      this.$RoomShelf,
      this.$RoomBed,
      this.$RoomRug,
    ],0.6,{
      autoAlpha: 0,
      y: -window.innerHeight * 0.025
    },{
      autoAlpha: 1,
      y: 0,
    },0.2,'anim-start+=0.75');

    // Control And Time
    this.roomTimeline.add('room-show');
    this.roomTimeline.fromTo(this.$clockArea,0.4,{
      autoAlpha: 0,
      y: -window.innerHeight * 0.02,
    },{
      autoAlpha: 1,
      y: 0,
    },'room-show');
    this.roomTimeline.fromTo(this.$controlArea,0.4,{
      autoAlpha: 0,
      x: -window.innerHeight * 0.02,
    },{
      autoAlpha: 1,
      x: 0,
    },'room-show')
  }

  ClockSetup() {
    this.timeHolder = $('#time-holder');
    this.dateHolder = $('#date-holder');

    if (this.clockTimeout) {
      clearInterval(this.clockTimeout);
    }

    this.clockTimeout = setInterval(() => {
      this.timeHolder.html(this.GetCurrentTime())
    },1000);

    this.dateHolder.html(this.GetCurrentDate());

    PageListener.on('new-day',() => {
      this.dateHolder.html(this.GetCurrentDate());
    })
  }

  GetCurrentTime() {
    let timeString = '';
    let now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    timeString = `${hours <= 9 ? '0' + hours : hours}:${minutes <= 9 ? '0' + minutes : minutes}:${seconds <= 9 ? '0' + seconds : seconds}`;

    if (hours == 23 && minutes == 59 && seconds == 59) {
      PageListener.emit('new-day');
    }

    return timeString;
  }

  GetCurrentDate() {
    let dateString = '';
    let now = new Date();

    let dateArray = [
      'Sun','Mon','Tues','Wed','Thu','Fri','Sat'
    ]

    let monthArray = [
      'Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'
    ]

    let day = now.getDay();

    let date = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();

    dateString = `${dateArray[day]} ${date}/${monthArray[month]}/${year}`

    return dateString
  }

  TimeControlSetup() {
    // Control Button
    this.$SwitchTimeBtn = $('.control-time');
    this.$ToOfflineBtn = $('#control-to-offline');
    this.$ToOnlineBtn = $('#control-to-online');

    this.$daytimeBg = $('.background-layer .bg-daytime');
    this.$nighttimeBg = $('.background-layer .bg-nighttime');
    this.$betweenBg = $('.background-layer .bg-between');

    this.$roomLayer = $('.content-layer');

    // Status
    this.currentStatus = {
      time: '',
      status: 'online'
    };
    let currentHours = new Date().getHours();
    switch (currentHours) {
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.currentStatus.time = 'nighttime';
        break;
      case 18:
      case 17:
      case 6:
        this.currentStatus.time = 'between';
        break;
      default:
        this.currentStatus.time = 'daytime';
    }

    this.UpdateTimeBg();

    // To Offline State
    this.$ToOfflineBtn.on('click',() => {
      if (this.currentStatus.status !== 'offline') {
        this.$roomLayer.removeClass('online').addClass('offline');
        this.currentStatus.status = 'offline';
      }
    });

    // To Online State
    this.$ToOnlineBtn.on('click',() => {
      if (this.currentStatus.status !== 'online') {
        this.$roomLayer.removeClass('offline').addClass('online');
        this.currentStatus.status = 'online';
      }
    });

    this.$SwitchTimeBtn.on('click',(e) => {
      let $target = $(e.target);
      let timeData = $target.data('switch-time');

      if (this.currentStatus.time !== timeData) {
        this.currentStatus.time = timeData;
        this.UpdateTimeBg();
      }
    })
  }

  UpdateTimeBg() {
    $('.page-bg.active').removeClass('active');
    $(`.page-bg.bg-${this.currentStatus.time}`).addClass('active')
  }
}
