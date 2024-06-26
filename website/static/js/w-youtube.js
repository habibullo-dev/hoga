let currentPage = 1;
      let searchResults = [];
      let nextPageToken = "";
      let prevPageToken = "";

      function loadClient() {
        gapi.client.setApiKey("AIzaSyDV-T0X9AO3mEQQRMXu_pLqDyoEl_3NPwI");
        return gapi.client
          .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
          .then(
            function () {
              console.log("Loaded");
            },
            function (err) {
              console.error("Error loading", err);
            }
          );
      }

      function execute(searchTerm, pageToken = "") {
        return gapi.client.youtube.search
          .list({
            part: "snippet",
            maxResults: resultsPerPage,
            q: searchTerm,
            pageToken: pageToken,
          })
          .then(
            function (response) {
              searchResults = response.result.items;
              nextPageToken = response.result.nextPageToken || "";
              prevPageToken = response.result.prevPageToken || "";
              currentPage = 1;
              displayResults();
              updatePaginationButtons();
            },
            function (err) {
              console.error("Execute error", err);
            }
          );
      }

      const resultsPerPage = 4;

      function displayResults() {
        const container = document.getElementById("YouTubeWidgets");
        container.innerHTML = "";
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(
          startIndex + resultsPerPage,
          searchResults.length
        );

        for (let i = startIndex; i < endIndex; i++) {
          const video = searchResults[i];
          const videoId = video.id.videoId;

          const widget = document.createElement("div");
          widget.className = "YoutubeWidget";

          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.frameBorder = 0;

          const videoInfo = document.createElement("div");
          videoInfo.className = "video-info";
          videoInfo.innerText = video.snippet.title;

          const button = document.createElement("button");
          button.className = "enlarge-button";
          button.innerText = "Enlarge";
          button.onclick = () => toggleEnlarge(button);

          widget.appendChild(iframe);
          widget.appendChild(videoInfo);
          widget.appendChild(button);

          container.appendChild(widget);
        }
      }

      function updatePaginationButtons() {
        const prevButton = document.getElementById("prevPage");
        const nextButton = document.getElementById("nextPage");

        prevButton.classList.toggle("disabled", !prevPageToken);
        nextButton.classList.toggle("disabled", !nextPageToken);
      }

      function changePage(delta) {
        let pageToken = delta === 1 ? nextPageToken : prevPageToken;
        execute(document.getElementById("searching1").value, pageToken);
      }

      gapi.load("client");

      document
        .getElementById("searching1")
        .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
            handleSearch();
          }
        });

      document
        .getElementById("searchButton")
        .addEventListener("click", function () {
          handleSearch();
        });

      function handleSearch() {
        let searchTerm = document.getElementById("searching1").value.trim();
        if (searchTerm !== "") {
          loadClient().then(() => execute(searchTerm));
        }
      }

      function toggleEnlarge(button) {
        let widget = button.closest(".YoutubeWidget");
        let isEnlarged = widget.classList.contains("enlarged");
        let allWidgets = document.querySelectorAll(".YoutubeWidget");
        let pagination = document.getElementById("pagination");

        if (!isEnlarged) {
          // Enlarge the widget
          widget.classList.add("enlarged");

          allWidgets.forEach((w) => {
            if (w !== widget) {
              w.style.display = "none";
            }
          });

          pagination.style.display = "none";
          button.innerText = "Minimize";

          // Autoplay without mute
          let iframe = widget.querySelector("iframe");
          let videoId = iframe.src.split("/").pop();
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
          iframe.setAttribute("allow", "autoplay; encrypted-media");

          fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=AIzaSyDV-T0X9AO3mEQQRMXu_pLqDyoEl_3NPwI`
          )
            .then((response) => response.json())
            .then((data) => {
              let videoDetails = data.items[0];
              displayVideoDetails(widget, videoDetails);
            })
            .catch((error) =>
              console.error("Error fetching video details:", error)
            );
        } else {
          // Minimize the widget
          widget.classList.remove("enlarged");

          allWidgets.forEach((w) => {
            w.style.display = "flex";
          });

          pagination.style.display = "flex";
          button.innerText = "Enlarge";

          // Reset iframe src to stop autoplay
          let iframe = widget.querySelector("iframe");
          let videoId = iframe.src.split("/").pop();
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
        }
      }

      function execute(searchTerm, pageToken = "") {
        return gapi.client.youtube.search
          .list({
            part: "snippet",
            maxResults: 4, // Adjusted to fetch only 4 results per page
            q: searchTerm,
            pageToken: pageToken,
          })
          .then(function (response) {
            searchResults = response.result.items;
            nextPageToken = response.result.nextPageToken; // Store next page token for pagination
            prevPageToken = response.result.prevPageToken; // Store previous page token for pagination
            currentPage = 1;
            displayResults();
            updatePaginationButtons();
          })
          .catch(function (err) {
            console.error("Execute error", err);
          });
      }

      function displayVideoDetails(widget, videoDetails) {
        let videoInfo = widget.querySelector(".video-info");
        if (videoDetails) {
          let title = videoDetails.snippet.title;
          let uploader = videoDetails.snippet.channelTitle;
          let duration = parseDuration(videoDetails.contentDetails.duration);
          videoInfo.innerHTML = `<p><strong>Title:</strong> ${title} | <strong>Uploader:</strong> ${uploader} | <strong>Duration:</strong> ${duration}</p>`;
          videoInfo.style.display = "block";
        }
      }

    //   function resetVideoDetails(widget) {
    //     let videoInfo = widget.querySelector(".video-info");
    //     videoInfo.innerHTML = "";
    //     videoInfo.style.display = "none";
    //   }

      function parseDuration(duration) {
        let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        let hours = match[1] ? parseInt(match[1]) : 0;
        let minutes = match[2] ? parseInt(match[2]) : 0;
        let seconds = match[3] ? parseInt(match[3]) : 0;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          return "Live Stream";
        } else {
          return (
            (hours > 0 ? hours + "h " : "") +
            (minutes > 0 ? minutes + "m " : "") +
            (seconds > 0 ? seconds + "s" : "")
          );
        }
      }
