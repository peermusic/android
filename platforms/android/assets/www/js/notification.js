function createNotification(){
  var song = getSong(state.player.songId, state)
  MusicControls.create({
      track       : song.titel,        // optional, default : ''
      artist      : song.artist,                       // optional, default : ''
      cover       : 'albums/absolution.jpg',      // optional, default : nothing
      isPlaying   : true,                         // optional, default : true
      dismissable : true,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev   : false,      // show previous button, optional, default: true
      hasNext   : false,      // show next button, optional, default: true
      hasClose  : true,       // show close button, optional, default: false

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker    : 'Now playing "Time is Running Out"'
  }, onSuccess, onError);

  // Register callback
  MusicControls.subscribe(events);

  // Start listening for events
  // The plugin will run the events function each time an event is fired
  MusicControls.listen();
}


function events(action) {
    switch(action) {
        case 'music-controls-next':
            // Do something
            break;
        case 'music-controls-previous':
            // Do something
            break;
        case 'music-controls-pause':
            // Do something
            break;
        case 'music-controls-play':
            // Do something
            break;
        case 'music-controls-destroy':
            // Do something
            break;

        // Headset events (Android only)
        case 'music-controls-media-button' :
            // Do something
            break;
        case 'music-controls-headset-unplugged':
            // Do something
            break;
        case 'music-controls-headset-plugged':
            // Do something
            break;
        default:
            break;
    }
}
