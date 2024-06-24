const getlocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        const weatherApiKey = '1d735e1ab42746265d96032c39b8fe8b';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${weatherApiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        updateForecast(data);
    });
}

const updateForecast = (data) => {
    const forecastElem = document.getElementById('forecast');
    const locationElem = document.getElementById('location');
    forecastElem.innerHTML = '';
    locationElem.innerHTML = `${data.city.name}, ${data.city.country}`;

    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        if (!days[date]) {
            days[date] = item;
        }
    });

    const dayContainer = document.createElement('div');
    dayContainer.classList.add('day-container');

    Object.keys(days).slice(0, 5).forEach(key => {
        const day = days[key];
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
        const temp = day.main.temp;
        const weatherDescription = day.weather[0].description;
        const humidity = day.main.humidity;
        const icon = day.weather[0].icon;

        const dayElem = document.createElement('div');
        dayElem.classList.add('day');
        dayElem.innerHTML = `
            <div class="day-name">${date}</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}">
            <div class="temp">${temp}°C</div>
            <div class="humidity">Humidity: ${humidity}%</div>
            <div class="description">${weatherDescription}</div>
        `;

        dayContainer.appendChild(dayElem);
    });

    forecastElem.appendChild(dayContainer);
}

getlocation();