const cityInput =
    document.getElementById("city-input");

const searchButton =
    document.getElementById("search-btn");

const locationButton =
    document.getElementById("location-btn");

const celsiusButton =
    document.getElementById("celsius-btn");

const fahrenheitButton =
    document.getElementById("fahrenheit-btn");

const errorMessage =
    document.getElementById("error-message");

const loading =
    document.getElementById("loading");

const weatherInfo =
    document.querySelector(".weather-info");

const forecast =
    document.querySelector(".forecast");

const cityName =
    document.getElementById("city-name");

const country =
    document.getElementById("country");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const weatherIcon =
    document.getElementById("weather-icon");

const feelsLike =
    document.getElementById("feels-like");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const forecastList =
    document.getElementById("forecast-list");

const recentList =
    document.getElementById("recent-list");

const clearHistoryButton =
    document.getElementById("clear-history");


// ==========================================
// APPLICATION STATE
// ==========================================

let currentUnit = "C";

let currentWeatherData = null;

let currentDailyData = null;


// ==========================================
// WEATHER DESCRIPTION
// ==========================================

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code === 85 || code === 86) {
        return "Snow showers";
    }

    if (code === 95) {
        return "Thunderstorm";
    }

    if (code === 96 || code === 99) {
        return "Thunderstorm with hail";
    }

    return "Unknown";
}


// ==========================================
// WEATHER ICON
// ==========================================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1) {
        return "🌤️";
    }

    if (code === 2) {
        return "⛅";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code === 85 || code === 86) {
        return "🌨️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌡️";
}


// ==========================================
// TEMPERATURE CONVERSION
// ==========================================

function convertTemperature(celsius) {

    if (currentUnit === "C") {

        return Math.round(celsius);

    }

    return Math.round(
        (celsius * 9 / 5) + 32
    );
}


function getTemperatureUnit() {

    return currentUnit === "C"
        ? "°C"
        : "°F";
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(time) {

    const date =
        new Date(time);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// FORMAT DAY
// ==========================================

function formatDay(dateString) {

    const date =
        new Date(
            `${dateString}T12:00:00`
        );

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


// ==========================================
// SHOW / HIDE LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherInfo.classList.add("hidden");

    forecast.classList.add("hidden");

    searchButton.disabled = true;

    locationButton.disabled = true;
}


function hideLoading() {

    loading.classList.add("hidden");

    searchButton.disabled = false;

    locationButton.disabled = false;
}


// ==========================================
// DISPLAY ERROR
// ==========================================

function showError(message) {

    errorMessage.textContent = message;
}


function clearError() {

    errorMessage.textContent = "";
}


// ==========================================
// UPDATE WEATHER BACKGROUND
// ==========================================

function updateBackground(code, isDay) {

    document.body.className = "";

    if (!isDay) {

        document.body.classList.add(
            "clear-night"
        );

        return;
    }


    if (code === 0 || code === 1) {

        document.body.classList.add(
            "clear-day"
        );

        return;
    }


    if (code === 2 || code === 3 ||
        code === 45 || code === 48) {

        document.body.classList.add(
            "cloudy"
        );

        return;
    }


    if (
        (code >= 51 && code <= 67) ||
        (code >= 80 && code <= 82)
    ) {

        document.body.classList.add(
            "rainy"
        );

        return;
    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        document.body.classList.add(
            "snowy"
        );

        return;
    }


    if (code >= 95) {

        document.body.classList.add(
            "stormy"
        );

        return;
    }
}


// ==========================================
// UPDATE CURRENT WEATHER UI
// ==========================================

function displayCurrentWeather(data) {

    const current =
        data.current;


    currentWeatherData =
        current;


    const unit =
        getTemperatureUnit();


    // Temperature

    temperature.textContent =
        `${convertTemperature(
            current.temperature_2m
        )}${unit}`;


    // Feels like

    feelsLike.textContent =
        `${convertTemperature(
            current.apparent_temperature
        )}${unit}`;


    // Humidity

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    // Wind

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    // Pressure

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    // Visibility

    visibility.textContent =
        `${(
            current.visibility / 1000
        ).toFixed(1)} km`;


    // Weather description

    description.textContent =
        getWeatherDescription(
            current.weather_code
        );


    // Weather icon

    weatherIcon.textContent =
        getWeatherIcon(
            current.weather_code
        );


    // Background

    updateBackground(
        current.weather_code,
        current.is_day === 1
    );


    // Show weather

    weatherInfo.classList.remove(
        "hidden"
    );
}


// ==========================================
// DISPLAY SUNRISE / SUNSET
// ==========================================

function displaySunTimes(daily) {

    sunrise.textContent =
        formatTime(
            daily.sunrise[0]
        );

    sunset.textContent =
        formatTime(
            daily.sunset[0]
        );
}


// ==========================================
// DISPLAY FORECAST
// ==========================================

function displayForecast(daily) {

    currentDailyData =
        daily;


    forecastList.innerHTML = "";


    const numberOfDays =
        Math.min(
            5,
            daily.time.length
        );


    for (
        let i = 0;
        i < numberOfDays;
        i++
    ) {

        const day =
            formatDay(
                daily.time[i]
            );


        const maxTemp =
            convertTemperature(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            convertTemperature(
                daily.temperature_2m_min[i]
            );


        const icon =
            getWeatherIcon(
                daily.weather_code[i]
            );


        const weatherDescription =
            getWeatherDescription(
                daily.weather_code[i]
            );


        const card =
            document.createElement("div");


        card.classList.add(
            "forecast-card"
        );


        card.innerHTML = `
            <p class="day">
                ${day}
            </p>

            <div class="icon">
                ${icon}
            </div>

            <p class="temp">
                ${maxTemp}° / ${minTemp}°
            </p>

            <p class="description">
                ${weatherDescription}
            </p>
        `;


        forecastList.appendChild(
            card
        );
    }


    forecast.classList.remove(
        "hidden"
    );
}


// ==========================================
// WEATHER API
// ==========================================

async function getWeather(
    latitude,
    longitude
) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,visibility,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Weather request failed"
        );

    }


    const data =
        await response.json();


    displayCurrentWeather(
        data
    );


    displaySunTimes(
        data.daily
    );


    displayForecast(
        data.daily
    );
}


// ==========================================
// CITY SEARCH
// ==========================================

async function getLocation(city) {

    showLoading();

    clearError();

    try {

        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Location request failed"
            );
        }

        const data =
            await response.json();

        if (
            !data.results ||
            data.results.length === 0
        ) {
            throw new Error(
                "City not found"
            );
        }

        // Try to find an exact match first
        const location =
            data.results.find(
                result =>
                    result.name.toLowerCase() ===
                    city.toLowerCase()
            ) || data.results[0];


        cityName.textContent =
            location.name;

        country.textContent =
            location.country || "Unknown";


        await getWeather(
            location.latitude,
            location.longitude
        );


        saveRecentCity(
            location.name
        );

    }

    catch (error) {

        console.error(error);

        weatherInfo.classList.add(
            "hidden"
        );

        forecast.classList.add(
            "hidden"
        );


        if (
            error.message ===
            "City not found"
        ) {

            showError(
                "City not found. Please try another city."
            );

        }
        else {

            showError(
                "Something went wrong. Please check your internet connection."
            );

        }

    }

    finally {

        hideLoading();

    }
}

// ==========================================
// CURRENT LOCATION
// ==========================================

function getCurrentLocation() {

    clearError();


    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    showLoading();


    locationButton.textContent =
        "Getting location...";


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                cityName.textContent =
                    "Your Location";

                country.textContent =
                    "Current position";


                await getWeather(
                    latitude,
                    longitude
                );

            }

            catch (error) {

                console.error(error);

                showError(
                    "Unable to load weather for your location."
                );

                weatherInfo.classList.add(
                    "hidden"
                );

                forecast.classList.add(
                    "hidden"
                );

            }

            finally {

                hideLoading();

                locationButton.textContent =
                    "📍 Use My Location";

            }

        },


        function (error) {

            console.error(error);


            hideLoading();


            locationButton.textContent =
                "📍 Use My Location";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                showError(
                    "Location permission was denied."
                );

            }
            else {

                showError(
                    "Unable to get your location."
                );

            }

        }

    );
}


// ==========================================
// RECENT SEARCHES
// ==========================================

function getRecentCities() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];

    }

    catch {

        return [];

    }
}


function saveRecentCity(city) {

    let cities =
        getRecentCities();


    // Remove duplicate

    cities =
        cities.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    // Add newest city first

    cities.unshift(city);


    // Keep only 5

    cities =
        cities.slice(0, 5);


    localStorage.setItem(
        "recentCities",
        JSON.stringify(cities)
    );


    displayRecentCities();
}


function displayRecentCities() {

    const cities =
        getRecentCities();


    recentList.innerHTML = "";


    if (cities.length === 0) {

        recentList.innerHTML =
            `<p style="color: #777; font-size: 14px;">
                No recent searches
            </p>`;

        return;
    }


    cities.forEach(
        function (city) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.classList.add(
                "recent-city"
            );


            button.textContent =
                city;


            button.addEventListener(
                "click",
                function () {

                    cityInput.value =
                        city;

                    getLocation(
                        city
                    );

                }
            );


            recentList.appendChild(
                button
            );

        }
    );
}


// ==========================================
// CLEAR SEARCH HISTORY
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "recentCities"
        );

        displayRecentCities();

    }
);


// ==========================================
// UPDATE TEMPERATURE DISPLAY
// ==========================================

function updateDisplayedTemperatures() {

    if (!currentWeatherData) {
        return;
    }


    const unit =
        getTemperatureUnit();


    temperature.textContent =
        `${convertTemperature(
            currentWeatherData.temperature_2m
        )}${unit}`;


    feelsLike.textContent =
        `${convertTemperature(
            currentWeatherData.apparent_temperature
        )}${unit}`;


    if (currentDailyData) {

        displayForecast(
            currentDailyData
        );

    }
}


// ==========================================
// CELSIUS BUTTON
// ==========================================

celsiusButton.addEventListener(
    "click",
    function () {

        currentUnit = "C";


        celsiusButton.classList.add(
            "active"
        );


        fahrenheitButton.classList.remove(
            "active"
        );


        updateDisplayedTemperatures();

    }
);


// ==========================================
// FAHRENHEIT BUTTON
// ==========================================

fahrenheitButton.addEventListener(
    "click",
    function () {

        currentUnit = "F";


        fahrenheitButton.classList.add(
            "active"
        );


        celsiusButton.classList.remove(
            "active"
        );


        updateDisplayedTemperatures();

    }
);


// ==========================================
// SEARCH
// ==========================================

searchButton.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();


        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;

        }


        getLocation(city);

    }
);


// ==========================================
// ENTER KEY
// ==========================================

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            searchButton.click();

        }

    }
);


// ==========================================
// CURRENT LOCATION BUTTON
// ==========================================

locationButton.addEventListener(
    "click",
    function () {

        getCurrentLocation();

    }
);


// ==========================================
// INITIALIZE APP
// ==========================================

displayRecentCities();
