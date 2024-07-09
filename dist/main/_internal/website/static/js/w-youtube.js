let currentPage = 1;
const resultsPerPage = 4; // Limiting to 4 results per page initially
let searchResults = [];
let nextPageToken = "";
let prevPageToken = "";

function toggleEnlarge(button) {
  let widget = button.closest(".YoutubeWidget");

  // Check if widget is already enlarged
  if (!widget.classList.contains("enlarged")) {
    // Enlarge the widget
    widget.classList.add("enlarged");

    // Hide other widgets and pagination
    hideOtherWidgets(widget);

    // Change button text and manage video playback
    button.innerText = "Minimize";
    autoplayVideo(widget);
    fetchVideoDetails(widget);
  } else {
    // Minimize the widget
    widget.classList.remove("enlarged");

    // Show all widgets and pagination
    showAllWidgets();

    // Reset button text and stop video playback
    button.innerText = "Enlarge";
    stopVideo(widget);
    resetVideoDetails(widget);
  }
}

function hideOtherWidgets(widget) {
  let allWidgets = document.querySelectorAll(".YoutubeWidget");
  let pagination = document.getElementById("pagination");

  allWidgets.forEach((w) => {
    if (w !== widget) {
      w.style.display = "none";
    }
  });

  pagination.style.display = "none";
}

function showAllWidgets() {
  let allWidgets = document.querySelectorAll(".YoutubeWidget");
  let pagination = document.getElementById("pagination");

  allWidgets.forEach((w) => {
    w.style.display = "flex";
  });

  pagination.style.display = "flex";
}

function autoplayVideo(widget) {
  let iframe = widget.querySelector("iframe");
  let videoId = iframe.src.split("/").pop();
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  iframe.setAttribute("allow", "autoplay; encrypted-media");
}

function stopVideo(widget) {
  let iframe = widget.querySelector("iframe");
  let videoId = iframe.src.split("/").pop();
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
}

function fetchVideoDetails(widget) {
  let iframe = widget.querySelector("iframe");
  let videoId = iframe.src.split("/").pop();

  fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=AIzaSyDV-T0X9AO3mEQQRMXu_pLqDyoEl_3NPwI`
  )
    .then((response) => response.json())
    .then((data) => {
      let videoDetails = data.items[0];
      displayVideoDetails(widget, videoDetails); // Display video details when enlarging
    })
    .catch((error) => console.error("Error fetching video details:", error));
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

function resetVideoDetails(widget) {
  let videoInfo = widget.querySelector(".video-info");
  videoInfo.innerHTML = "";
  videoInfo.style.display = "none";
}

// Event listeners
document
  .getElementById("searching1")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

document
  .getElementById("prevPage")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("nextPage")
  .addEventListener("click", () => changePage(1));

function handleSearch() {
  let searchTerm = document.getElementById("searching1").value.trim();
  if (searchTerm !== "") {
    loadClient().then(() => execute(searchTerm));
  }
}

function execute(searchTerm, pageToken = "") {
  return gapi.client.youtube.search
    .list({
      part: "snippet",
      maxResults: 4, // Limiting to 4 results per page initially
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

function displayResults() {
  const container = document.getElementById("YouTubeWidgets");
  container.innerHTML = "";
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, searchResults.length);

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

    const enlargeButton = document.createElement("button");
    enlargeButton.className = "enlarge-button";
    enlargeButton.innerText = "Enlarge";
    enlargeButton.onclick = () => toggleEnlarge(enlargeButton);

    widget.appendChild(iframe);
    widget.appendChild(videoInfo);
    widget.appendChild(enlargeButton);

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

function loadClient() {
  gapi.client.setApiKey("AIzaSyANSSSvYA_jmlHaPsGmTzvTJUVuDl11rgs");
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      // function () {
      //   console.log("Loaded");
      //   execute("study music"); // Call execute with a default search term
      // },
      function (err) {
        console.error("Error loading", err);
      }
    );
}

gapi.load("client");
