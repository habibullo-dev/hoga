const apiKey = "1d735e1ab42746265d96032c39b8fe8b"; 
      const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";
      const container = document.getElementById("weatherWidget");
      const viewSelector = document.getElementById("viewSelector");
      const cityCountryElement = document.getElementById("cityCountry");

      // Fetch weather
      async function fetchWeatherData(latitude, longitude) {
        const response = await fetch(
          `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      }

      // Display weather
      function displayWeatherData(data, numDays) {
        container.innerHTML = "";

        const cityName = data.city.name;
        const countryName = data.city.country;
        const forecastList = data.list;

        // Display location
        cityCountryElement.textContent = `${cityName}, ${countryName}`;

        // Display weather cards
        for (let i = 0; i < numDays; i++) {
          const weather = forecastList[i * 8]; // Pick first forecast
          const date = new Date(weather.dt * 1000); // Convert to date object

          const weatherCard = document.createElement("div");
          weatherCard.classList.add("weather-card");

          const dateElement = document.createElement("div");
          dateElement.textContent = date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
          });
          dateElement.classList.add("date");

          const dayElement = document.createElement("div");
          dayElement.textContent = date.toLocaleDateString(undefined, {
            weekday: "short",
          });
          dayElement.classList.add("day");

          const iconElement = document.createElement("img");
          iconElement.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
          iconElement.alt = weather.weather[0].description;
          iconElement.classList.add("icon");

          const temperatureElement = document.createElement("div");
          temperatureElement.textContent = `${Math.round(weather.main.temp)}°C`;
          temperatureElement.classList.add("temperature");

          const descriptionElement = document.createElement("div");
          const capitalizedDescription = capDescription(
            weather.weather[0].description
          );
          descriptionElement.textContent = capitalizedDescription;
          descriptionElement.classList.add("description");

          weatherCard.appendChild(dateElement);
          weatherCard.appendChild(dayElement);
          weatherCard.appendChild(iconElement);
          weatherCard.appendChild(temperatureElement);
          weatherCard.appendChild(descriptionElement);

          container.appendChild(weatherCard);
        }
      }

      // Capitalize Description
      function capDescription(description) {
        return description.replace(/\b\w/g, (char) => char.toUpperCase());
      }

      // Get current position and weather data
      function getCurrentPositionAndFetchWeather(numDays) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const long = pos.coords.longitude;
              console.log("Latitude:", lat, "Longitude:", long);

              const weatherData = await fetchWeatherData(lat, long);
              displayWeatherData(weatherData, numDays);
            } catch (error) {
              console.error("Error fetching weather data:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }

      // Dropdown
      viewSelector.addEventListener("change", (event) => {
        const numDays = parseInt(event.target.value, 10);
        getCurrentPositionAndFetchWeather(numDays);
      });

      // Call function
      getCurrentPositionAndFetchWeather(3);
