function formatDate(timestamp){
let date = new Date(timestamp);

let hours = date.getHours();
if (hours < 10) {
    hours = `0${hours}`;
}

let minutes = date.getMinutes();
if (minutes < 10) {
    minutes = `0${minutes}`;
}

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
let day = days[date.getDay()];
return `${day} ${hours}:${minutes}`;
}

function formatHours(timestamp) {
    let date = new Date(timestamp);
let hours = date.getHours();
if (hours < 10) {
    hours = `0${hours}`;
}

let minutes = date.getMinutes();
if (minutes < 10) {
    minutes = `0${minutes}`;
}
return `${hours}:${minutes}`;
}

function displayTemperature(response) {
let temperatureElement = document.querySelector("#temperature");
let cityElement = document.querySelector("#city");
let descriptionElement = document.querySelector("#description");
let humidityElement = document.querySelector("#humidity"); 
let windElement = document.querySelector("#wind");
let dateElement = document.querySelector("#date");
let iconElement = document.querySelector("#weather-icon");

celciusTemperature = response.data.main.temp;

temperatureElement.innerHTML = Math.round(response.data.main.temp);
cityElement.innerHTML = response.data.name;
descriptionElement.innerHTML = response.data.weather[0].description;
humidityElement.innerHTML = response.data.main.humidity; 
windElement.innerHTML = Math.round(response.data.wind.speed);
dateElement.innerHTML = formatDate(response.data.dt * 1000)
iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
iconElement.setAttribute("alt", response.data.weather[0].description); 
}

function displayForecast(response){
    let forecastElement = document.querySelector("#forecast"); 
    forecastElement.innerHTML = null;
    let forecast = null;

    for (let index = 0; index < 6; index++) {
 let forecast = response.data.list[index];
forecastElement.innerHTML += `
            <div class="col-2">
                <p>${formatHours(forecast.dt * 1000)}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
                <div class="forecast-temp">
                    <strong>${Math.round(forecast.main.temp_max)}º</strong> | ${Math.round(forecast.main.temp_min)}º
                    </div>
            </div>
            `;
}
}

function search(city) {
let apiKey = "e9f0df1070f392cefc3e4f112830f1d3";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayTemperature);

apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", getCurrentLocation);

function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

function searchLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
  let apiKey = "e9f0df1070f392cefc3e4f112830f1d3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
  
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayFahrenheit(event) {
    event.preventDefault();
        let temperatureElement = document.querySelector("#temperature");
    celciusLink.classList.remove("active");    
    fahrenheitLink.classList.add("active"); 
    let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32; 
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelcius(event) {
    event.preventDefault();
    celciusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(celciusTemperature);    
}

let celciusTemperature = null; 

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click",displayCelcius);

search("Toronto");