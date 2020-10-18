const weather = document.querySelector(".js-weather");
const WEATHER_API_KEY = "4af1756409b32d51a1776f05d39e589e";
const LOCATION_API_KEY = "AIzaSyDIYsQuPSKXrfeuX4KQQtfGddllpJHLRYc";
const COORDS = 'coords';

function getLocation(lat,lon){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${LOCATION_API_KEY}`
    ).then(function(response){
        return response.json();
    }).then(function(json){
        console.log(json);
        const raw = json.plus_code.compound_code;
        const location_arr = raw.split(' ');
        location_arr.shift();
        location_arr.shift();
        const location = location_arr.join();
        console.log(location);
        weather.innerText = `${location}`;
    });
}

function getWeather(lat ,lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    ).then(function(response){
        return response.json();
    }).then(function(json){
        const temperature = json.main.temp;
        const place = json.name;
        weather.innerText = `${place}`;
        weather.innerText += `\n${temperature}°C`;
    });
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getLocation(latitude,longitude);
    getWeather(latitude,longitude);
}

function handleGeoError() {
    console.log('Cant access geo loaction');
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parseCoords = JSON.parse(loadedCoords);
        getLocation(parseCoords.latitude,parseCoords.longitude);
        getWeather(parseCoords.latitude,parseCoords.longitude);
    }
}

function init() {
    loadCoords();
}

init();