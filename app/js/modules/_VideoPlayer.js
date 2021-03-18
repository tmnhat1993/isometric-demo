import YouTubePlayer from "youtube-player";

export default class VideoPlayer {
 /* ===================================
  *  CONSTRUCTOR
  * =================================== */
 constructor() {
  window.IS_MOBILE = window.innerWidth <= 768;
  $(window).on('resize',() => {
   window.IS_MOBILE = window.innerWidth <= 768;
  });

  // Elements
  this.bindEvents();
 }

 /* ===================================
  *  EVENTS
  * =================================== */
 bindEvents() {
  /* Video Modal Setup */
  if ($("#video-player").length > 0) {
   this.SetupVideoPlayer();
  }
 }

 /* ===================================
  *  METHODS
  * =================================== */
 /* Modal Video Control */
 SetupVideoPlayer() {
  /* === Variables === */
  this.$VideoPlayer = $('#video-player');
  this.$VideoStatusIndicator = this.$VideoPlayer.find('.video-status-indicator');
  this.videoStatus = {
   isPlaying: false,
   videoId: '5qap5aO4i9A', // Default Clip
   blockInteraction: false
  }

  /* === Youtube Player Init === */
  this.playerYT = YouTubePlayer("video-holder",{
   videoId: this.videoStatus.videoId,
   playerVars: {
    disablekb: 1,
    fs: 0,
    modestbranding: 1,
    rel: 0,
    playlist: "",
    loop: 1,
   },
  });

  this.videoEventInterval = setInterval(() => {
   if (this.playerYT) {
    clearInterval(this.videoEventInterval);
    console.log(this.playerYT);

    this.playerYT.addEventListener("onStateChange",(e) => {
     switch (e.data) {
      case 0:
      case 2:
       this.videoStatus.isPlaying = false;
       break;
      case 1: this.videoStatus.isPlaying = true;
       break;
     }
     // Video End, Update Indicator
     this.UpdateVideoIndicator();
    });
   }
  },300);


  /* === Events === */
  $(document).on("click",".play-video-player",(e) => {
   this.videoCode = this.videoStatus.videoId; // Default Youtube Video ID

   if ($(e.target).parents(".play-video-player").length > 0) {
    this.videoCode = $(e.target).parents(".play-video-player").data("video-id");
   } else {
    this.videoCode = $(e.target).data("video-id");
   }

   this.PlayClip(this.videoCode);
  });

  $(document).on("click",".close-video-player-btn",(e) => {
   // Stop then minimize the video player
   this.StopClip();
   this.MinimizePlayer();
  });

  $(document).on("click",".minimize-video-player-btn",(e) => {
   this.MinimizePlayer();
  });

  // Click on Indicator Item
  this.$VideoStatusIndicator.on('click',(e) => {
   if (!this.videoStatus.blockInteraction) {
    if (this.$VideoPlayer.hasClass('minimized')) {
     this.OpenPlayer();
    }
   }
  });
 }

 PlayClip(clipID = "") {
  this.playerYT.cueVideoById(clipID);
  this.playerYT.unMute();
  this.playerYT.playVideo();

  // Update Player Status
  this.videoStatus.isPlaying = true;
  this.videoStatus.videoId = clipID;

  // Update Status Icon
  this.UpdateVideoIndicator();
 }

 StopClip(callback) {
  // Update Player Status
  this.videoStatus.isPlaying = false;

  // Update The Indicator
  this.UpdateVideoIndicator()

  this.playerYT.mute();
  setTimeout(() => {
   this.playerYT.stopVideo();
   if (callback) {
    callback();
   }
  },200);
 }

 MinimizePlayer() {
  this.videoStatus.blockInteraction = true;
  this.$VideoPlayer.addClass('minimized');
  setTimeout(() => {
   this.videoStatus.blockInteraction = false;
  },500)
 }

 OpenPlayer() {
  this.videoStatus.blockInteraction = true;
  this.$VideoPlayer.removeClass('minimized');
  setTimeout(() => {
   this.videoStatus.blockInteraction = false;
  },1000)
 }

 UpdateVideoIndicator() {
  if (this.videoStatus.isPlaying) {
   $('.video-status-indicator').addClass('is-playing').removeClass('is-stopped');
  } else {
   $('.video-status-indicator').removeClass('is-playing').addClass('is-stopped');
  }
 }
}