// Function to check music player width and apply styles
function checkMusicPlayerSize() {
  const musicPlayer = $(".widget-w-spotify");

  if (musicPlayer.length > 0) {
    const width = musicPlayer.width();
    const height = musicPlayer.height();
    // console.log("Music Player Width:", width);
    // console.log("Music Player Height:", height);

    // Reset classes before applying new ones
    musicPlayer.removeClass(
      "super-small-music-player small-music-player medium-music-player large-music-player"
    );

    // Check multiple conditions
    if (width < 151 && height < 151) {
      musicPlayer.addClass("super-small-music-player");
      console.log("Added super small-music-player class");
    } else if (width < 200 && height < 250) {
      musicPlayer.addClass("small-music-player");
      console.log("Added small-music-player class");
    } else if (width < 300 && height < 400) {
      musicPlayer.addClass("medium-music-player");
      console.log("Added medium-music-player class");
    } else {
      musicPlayer.addClass("large-music-player");
      console.log("Added large-music-player class");
    }
  }
}

// Initial check on document ready
checkMusicPlayerSize();

// Check on window resize
$(window).on("resize", checkMusicPlayerSize);

// Restore data 
// function restoreWidgetState(widgetId) {
//     const savedData = localStorage.getItem(`widget-${widgetId}-state`);
//     if (savedData) {
//       const data = JSON.parse(savedData);
//       // Apply the saved data to the widget DOM elements
//       const widget = widgets[widgetId];
//       if (widget) {
//         const playerTitle = widget.querySelector('.player__song-title');
//         const playerArtist = widget.querySelector('.player__artist');
//         const playerAlbumArt = widget.querySelector('.player__album img');
  
//         if (playerTitle) playerTitle.textContent = data.songTitle;
//         if (playerArtist) playerArtist.textContent = data.artistName;
//         if (playerAlbumArt) playerAlbumArt.src = data.albumArtUrl;
//       }
//     }
//   }