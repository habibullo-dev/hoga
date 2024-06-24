const client_id = "712292c5a643476cbc61e975095e16fb"; // Spotify Client ID
const client_secret = "ccd9b3c5fe5c4832afd35eb4598398a1"; // Spotify Client Secret
const redirect_uri = "http://localhost:5000"; // Redirect URL

let access_token;
let refresh_token;

// Function to manually set initial tokens
function setInitialTokens(initialAccessToken, initialRefreshToken) {
  access_token = initialAccessToken;
  refresh_token = initialRefreshToken;
  console.log(
    "Initial tokens set. Access token:",
    access_token,
    "Refresh token:",
    refresh_token
  );
  startTokenRefreshTimer();
}

// Function to store tokens
function storeTokens(data) {
  access_token = data.access_token;
  refresh_token = data.refresh_token;
  console.log(
    "Tokens stored. Access token:",
    access_token,
    "Refresh token:",
    refresh_token
  );
}

// Function to get tokens using authorization code
function getTokens(authCode, callback) {
  const url = "https://accounts.spotify.com/api/token";
  const data = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret,
  };

  $.post(url, data, function (response) {
    storeTokens(response);
    if (callback) callback();
    startTokenRefreshTimer();
  });
}

// Function to refresh the access token
function refreshAccessToken() {
  const url = "https://accounts.spotify.com/api/token";
  const data = {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  };

  const authHeader = btoa(`${client_id}:${client_secret}`);

  $.ajax({
    url: url,
    type: "POST",
    data: $.param(data), // Convert data to URL-encoded format
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    success: function (response) {
      console.log("Token refresh response:", response);
      access_token = response.access_token;
      console.log("Access token refreshed:", access_token);
    },
    error: function (error) {
      console.error("Error refreshing access token:", error);
    },
  });
}

// Function to start the refresh timer
function startTokenRefreshTimer() {
  console.log("Starting token refresh timer.");
  setInterval(refreshAccessToken, 55 * 60 * 1000); // Refresh the token every 55 minutes (token expires in 60 minutes)
}

// Function to get the access token
function getAccessToken() {
  console.log("Getting access token:", access_token);
  return access_token;
}

$(document).ready(function () {
  // Set initial tokens
  const initialAccessToken = "BQByshJIMIFYOntCaMTwhAjrHlctRPwOjU5jADjVFpR726GuN0wEsEOsXcawZit1pQFqhkJIol-DBdIRwYJXCu6K6K54Ib0Q_7MSufkvkduHDq1Th8wyZYy9pJvi6Qsp1_-_lDFmzhfnTW2hcbVyjpl5HJus-j0Ugh2UXo7DTOFoUrQf1AU-qcR7hkNn48SXCdKruKCgEI6nfvCcviqoFA";
  const initialRefreshToken = "AQAJILD010tDX904I0DAhM67y6ngi9JGDMFUjHbG3nbUVdhkswoiY2vfSywLAkdxOgL4kq5TMYzcacmgww58RCK98aQkRhKuOst5SOsQQjxoByzSoCL3jO0A0lSXWS5xQog";
  setInitialTokens(initialAccessToken, initialRefreshToken);

  // Function to initialize Spotify functionality
  function initializeSpotifyFunctionality() {
    console.log("Initializing Spotify functionality...");

    // Event listener for search form submission
    $("#search-form").on("submit", function (e) {
      e.preventDefault();
      const query = $("#search-query").val();
      console.log("Search form submitted with query:", query);
      searchSpotify(query);
    });

    // Function to search Spotify playlists
    function searchSpotify(query) {
      console.log("Searching Spotify with query:", query);
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=3`;

      $.ajax({
        url: url,
        headers: {
          Authorization: "Bearer " + getAccessToken(),
        },
        success: function (response) {
          console.log("Search results:", response);
          displayResults(response.playlists.items);
        },
        error: function (xhr, status, error) {
          console.error("Error searching Spotify:", xhr.responseText);
          if (xhr.status === 401) {
            console.log("Access token expired. Refreshing token...");
            refreshAccessToken(function() {
              searchSpotify(query); // Retry the request after refreshing the token
            });
          }
        },
      });
    }

    // Function to display search results
    function displayResults(playlists) {
      console.log("Displaying results:", playlists);
      const resultsContainer = $("#results-container");
      resultsContainer.empty();
      playlists.forEach((playlist) => {
        const resultItem = $(`
          <div class="result-item" data-uri="${playlist.uri}">
            <p><strong>${playlist.name}</strong></p>
            <p>by ${playlist.owner.display_name}</p>
          </div>
        `);
        resultsContainer.append(resultItem);
      });

      topPlaylist();
      resultsContainer.show();

      // Event listener for result items
      $(".result-item").on("click", function () {
        const uri = $(this).data("uri");
        console.log("Result item clicked. URI:", uri);
        updateWidget(uri);
        resultsContainer.hide();
        $("#widget-container").show();
        hidePlaylist();
      });
    }

    // Function to update Spotify widget
    function updateWidget(uri) {
      console.log("Updating widget with URI:", uri);
      const widget = document.getElementById("spotify-widget");
      widget.src = `https://open.spotify.com/embed/playlist/${uri.split(":")[2]}`;
      $("#search-form").hide();
    }

    // Function to show top playlist
    function topPlaylist() {
      console.log("Showing top playlist.");
      document.getElementById("top-text").style.display = "block";
    }

    // Function to hide playlist
    function hidePlaylist() {
      console.log("Hiding playlist.");
      document.getElementById("top-text").style.display = "none";
    }

    // Return necessary functions
    return {
      searchSpotify,
    };
  }

  // Initialize Spotify functionality
  let spotify = initializeSpotifyFunctionality();

  // Function to reset Spotify functionality
  function resetSpotifyFunctionality() {
    console.log("Resetting Spotify functionality...");

    $("#search-query").val("");
    $("#search-form").show();

    // Clear existing results
    const resultsContainer = $("#results-container");
    resultsContainer.empty();

    // Reset widget (replace with your default widget URL)
    const widget = document.getElementById("spotify-widget");
    widget.src = "";

    // Hide widget container and reset visibility
    $("#widget-container").hide();

    // Re-initialize Spotify functionality
    spotify = initializeSpotifyFunctionality();
  }

  // Reset Spotify functionality
  document.getElementById("search-form-reset").addEventListener("click", function () {
    console.log("Reset button clicked.");
    resetSpotifyFunctionality();
  });
});
