function handleButtonClick(event) {
    event.stopPropagation();
    const searchTerm = document.getElementById('searching1').value;
    loadYouTubeVideos(searchTerm);
  }

  function loadYouTubeVideos(searchTerm) {
    const apiKey = 'AIzaSyDV-T0X9AO3mEQQRMXu_pLqDyoEl_3NPwI';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchTerm}&type=video&key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching data:', data.error.message);
          return;
        }

        // Loop through each item and embed the video into the respective container
        data.items.forEach((item, index) => {
          if (index < 20) { // Ensure to match maxResults in API call
            const videoId = item.id.videoId;
            const videosContainer = document.getElementById(`videos${index + 1}`);
            const videoElement = `
              <div class="video">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>`;
            videosContainer.innerHTML = videoElement;
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        for (let i = 1; i <= 20; i++) {
          document.getElementById(`videos${i}`).innerHTML = 'Failed to load videos.';
        }
      });
  }

  function toggleEnlarge(button) {
    const widget = button.parentElement;

    if (widget.classList.contains('enlarged')) {
      widget.classList.remove('enlarged');
      button.innerText = 'Enlarge';
    } else {
      // First, close any previously enlarged widget if exists
      const enlargedWidget = document.querySelector('.YoutubeWidget.enlarged');
      if (enlargedWidget) {
        enlargedWidget.classList.remove('enlarged');
        enlargedWidget.querySelector('.enlarge-button').innerText = 'Enlarge';
      }

      widget.classList.add('enlarged');
      button.innerText = 'Minimize';
    }
  }