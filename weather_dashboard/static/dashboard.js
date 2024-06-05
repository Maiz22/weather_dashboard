document.addEventListener("DOMContentLoaded", () => {
    let locations = getLocations();
    updateWeatherContainer(locations);
    document.querySelector(".sidebar-burger").addEventListener('click', () => {
        toggleSidebar();
    });
    document.querySelector(".sidebar-save").addEventListener('click', () => {
        let locations = getLocations();
        updateWeatherContainer(locations);
        saveLocations(locations);
    });
})

function toggleSidebar() {
    document.body.classList.toggle("open");
};

function getLocations() {
    let locations = []
    let location_entries = document.querySelectorAll(".location-input");
    location_entries.forEach((location) => {
        locations.push(location.value);
    })
    return locations
};

async function updateWeatherContainer(locations) {
    let apiContainers = document.querySelectorAll(".api-content-container");
    let weatherData = await getWeatherData(locations);
    for (let i=0; i<3; i++) {
        loadWeatherContainerContent(apiContainers[i], await weatherData[i]);
    };
};

async function getWeatherData(locations) {
    let weatherData = []
    locations.forEach((location) => {
        weatherData.push(forecastWeatherApiRequest(location))
    })
    return weatherData
};

async function forecastWeatherApiRequest (location) {
    let api_key = "2775ddee0647497393f114247240406";
    let api_url = "https://api.weatherapi.com";
    let url = `${api_url}/v1/forecast.json?key=${api_key}&q=${location}&days=1`
    try {
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            }
        });
        let result = await response.json();
        return result
    } catch (e) {
        console.log(e)
    }
};

async function saveLocationRequest(location_id, location_name) {
    try {
        let response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({location_id, location_name})
        });
        let result = await response.json();
        console.log(result)
    } catch(e) {
        console.log(e)
    }
};

async function saveLocations(locations) {
    locations.forEach((location, index) => {
        saveLocationRequest(index, location)
    })
};

async function loadWeatherContainerContent(apiContainer, localWeatherData) {
    apiContainer.querySelector('#api-location').innerHTML = `${localWeatherData.location.name}, ${localWeatherData.location.country}`;
    apiContainer.querySelector('#api-local-time').innerHTML = localWeatherData.location.localtime;
    apiContainer.querySelector('#api-weather-logo').src = localWeatherData.current.condition.icon;
    apiContainer.querySelector('#api-condition').innerHTML = localWeatherData.current.condition.text;
    apiContainer.querySelector('#api-temperature').innerHTML = `${localWeatherData.current.temp_c} °C`;
    apiContainer.querySelector('#api-feelslike').innerHTML = `${localWeatherData.current.feelslike_c} °C`;
    apiContainer.querySelector('#api-humidity').innerHTML = `${localWeatherData.current.humidity} %`;
    apiContainer.querySelector('#api-uv').innerHTML = localWeatherData.current.uv;
    apiContainer.querySelector('#api-pressure').innerHTML = `${localWeatherData.current.pressure_mb} mb`;
    apiContainer.querySelector('#api-wind').innerHTML = `${localWeatherData.current.wind_kph} km/h`;
    apiContainer.querySelector('#api-update').innerHTML = localWeatherData.current.last_updated;
    apiContainer.querySelector('#api-weather-forecast-logo').src = localWeatherData.forecast.forecastday[0].day.condition.icon;
    apiContainer.querySelector('#api-forecast-temperature').innerHTML =  `${localWeatherData.forecast.forecastday[0].day.mintemp_c} °C - ${localWeatherData.forecast.forecastday[0].day.maxtemp_c} °C` ;
};