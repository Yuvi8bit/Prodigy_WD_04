const apiKey = '82e996c474c47818b1070c70560f1710';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
let map;
let marker;

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { name, main, weather, coord } = data;
                locationElement.textContent = name;
                temperatureElement.textContent = `${Math.round(main.temp)}°C`;
                descriptionElement.textContent = weather[0].description;
                
                updateMap(coord.lat, coord.lon, name);
            } else {
                console.error('Error fetching weather data:', data.message);
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateMap(lat, lon, cityName) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${cityName}</b>`).openPopup();
    } else {
        map.setView([lat, lon], 10);
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            marker = L.marker([lat, lon]).addTo(map);
        }
        marker.bindPopup(`<b>${cityName}</b>`).openPopup();
    }
}
