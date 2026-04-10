// ===== CONFIGURATION =====
const API_KEY = '3121e62de0ec4d2a98e151109260904';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Global state
let currentCity = '';
let currentWeatherData = null;
let currentUnit = 'metric'; // 'metric' for °C, 'imperial' for °F
let favorites = [];

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherMain = document.getElementById('weather-main');
const forecastSection = document.getElementById('forecast-section');
const spinner = document.getElementById('spinner');
const errorMsg = document.getElementById('error-message');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temp');
const tempUnitEl = document.getElementById('temp-unit');
const feelsLikeEl = document.getElementById('feels-like');
const weatherDescEl = document.getElementById('weather-desc');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const weatherIcon = document.getElementById('weather-icon');
const weatherDate = document.getElementById('weather-date');
const forecastList = document.getElementById('forecast-list');
const favoritesList = document.getElementById('favorites-list');
const addFavoriteBtn = document.getElementById('add-favorite-btn');
const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
const unitCBtn = document.getElementById('unit-c');
const unitFBtn = document.getElementById('unit-f');

// ===== HELPER FUNCTIONS =====

// Show/hide spinner
function showSpinner() {
    spinner.classList.remove('hidden');
    weatherMain.classList.add('hidden');
    forecastSection.classList.add('hidden');
    errorMsg.classList.add('hidden');
}

function hideSpinner() {
    spinner.classList.add('hidden');
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    weatherMain.classList.add('hidden');
    forecastSection.classList.add('hidden');
    hideSpinner();
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Convert pressure from mb to mmHg
function convertPressure(mb) {
    return Math.round(mb * 0.75006);
}

// Get temperature based on current unit
function getTemp(tempCelsius) {
    if (currentUnit === 'metric') {
        return Math.round(tempCelsius);
    } else {
        return Math.round((tempCelsius * 9/5) + 32);
    }
}

// Get wind speed based on current unit
function getWindSpeed(windKph) {
    if (currentUnit === 'metric') {
        return (windKph / 3.6).toFixed(1); // Convert km/h to m/s
    } else {
        return (windKph / 1.609).toFixed(1); // Convert km/h to mph
    }
}

function getWindUnit() {
    return currentUnit === 'metric' ? 'м/с' : 'mph';
}

// Change background based on weather condition
function changeBackground(conditionText) {
    const body = document.body;
    body.className = '';
    
    const text = conditionText.toLowerCase();
    
    if (text.includes('clear') || text.includes('sunny')) {
        body.classList.add('clear-sky');
    } else if (text.includes('cloud') || text.includes('overcast')) {
        body.classList.add('few-clouds');
    } else if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) {
        body.classList.add('rain');
    } else if (text.includes('thunder') || text.includes('storm')) {
        body.classList.add('thunderstorm');
    } else if (text.includes('snow') || text.includes('blizzard')) {
        body.classList.add('snow');
    } else if (text.includes('mist') || text.includes('fog') || text.includes('haze')) {
        body.classList.add('mist');
    } else {
        body.classList.add('clear-sky');
    }
}

// Display weather data
function displayWeather(data) {
    currentWeatherData = data;
    
    cityNameEl.textContent = data.location.name;
    
    const tempCelsius = data.current.temp_c;
    tempEl.textContent = getTemp(tempCelsius);
    tempUnitEl.textContent = currentUnit === 'metric' ? '°C' : '°F';
    
    const feelsLikeCelsius = data.current.feelslike_c;
    feelsLikeEl.textContent = `Ощущается как: ${getTemp(feelsLikeCelsius)}${currentUnit === 'metric' ? '°C' : '°F'}`;
    
    weatherDescEl.textContent = data.current.condition.text;
    humidityEl.textContent = `${data.current.humidity}%`;
    
    const windSpeed = getWindSpeed(data.current.wind_kph);
    windEl.textContent = `${windSpeed} ${getWindUnit()}`;
    
    pressureEl.textContent = `${convertPressure(data.current.pressure_mb)} мм.рт.ст`;
    
    // Fix icon URL (ensure https)
    let iconUrl = data.current.condition.icon;
    if (iconUrl.startsWith('//')) {
        iconUrl = 'https:' + iconUrl;
    }
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.current.condition.text;
    
    weatherDate.textContent = formatDate(Math.floor(Date.now() / 1000));
    
    // Change background based on weather
    changeBackground(data.current.condition.text);
    
    weatherMain.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastDays = data.forecast.forecastday;
    
    forecastList.innerHTML = '';
    
    forecastDays.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
        
        const tempCelsius = day.day.avgtemp_c;
        const temp = getTemp(tempCelsius);
        
        let iconUrl = day.day.condition.icon;
        if (iconUrl.startsWith('//')) {
            iconUrl = 'https:' + iconUrl;
        }
        
        card.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img class="forecast-icon" src="${iconUrl}" alt="${day.day.condition.text}">
            <div class="forecast-temp">${temp}${currentUnit === 'metric' ? '°C' : '°F'}</div>
            <div class="forecast-desc">${day.day.condition.text}</div>
        `;
        
        forecastList.appendChild(card);
    });
    
    forecastSection.classList.remove('hidden');
}

// Update UI when unit changes
function updateUnitDisplay() {
    if (currentWeatherData) {
        const tempCelsius = currentWeatherData.current.temp_c;
        tempEl.textContent = getTemp(tempCelsius);
        tempUnitEl.textContent = currentUnit === 'metric' ? '°C' : '°F';
        
        const feelsLikeCelsius = currentWeatherData.current.feelslike_c;
        feelsLikeEl.textContent = `Ощущается как: ${getTemp(feelsLikeCelsius)}${currentUnit === 'metric' ? '°C' : '°F'}`;
        
        const windSpeed = getWindSpeed(currentWeatherData.current.wind_kph);
        windEl.textContent = `${windSpeed} ${getWindUnit()}`;
        
        // Refresh forecast with new unit
        if (currentCity) {
            getForecast(currentCity);
        }
    }
}

// ===== API CALLS =====

// Get current weather
async function getWeather(city) {
    if (!city || city.trim() === '') {
        showError('Пожалуйста, введите название города');
        return;
    }
    
    showSpinner();
    
    try {
        const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=ru`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.error && errorData.error.code === 1006) {
                throw new Error('Город не найден. Проверьте правильность написания.');
            } else if (response.status === 401) {
                throw new Error('Неверный API ключ. Проверьте настройки.');
            } else {
                throw new Error(errorData.error?.message || `Ошибка сервера: ${response.status}`);
            }
        }
        
        const data = await response.json();
        currentCity = data.location.name;
        displayWeather(data);
        
        // Get forecast after weather
        await getForecast(city);
        
    } catch (error) {
        showError(error.message);
        console.error('Weather fetch error:', error);
    } finally {
        hideSpinner();
    }
}

// Get 5-day forecast
async function getForecast(city) {
    try {
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&lang=ru`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Не удалось загрузить прогноз');
        }
        
        const data = await response.json();
        displayForecast(data);
        
    } catch (error) {
        console.error('Forecast fetch error:', error);
        forecastSection.classList.add('hidden');
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    showSpinner();
    
    try {
        const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&lang=ru`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Не удалось получить погоду по вашему местоположению');
        }
        
        const data = await response.json();
        currentCity = data.location.name;
        displayWeather(data);
        
        // Get forecast by coordinates
        const forecastUrl = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&lang=ru`;
        const forecastResponse = await fetch(forecastUrl);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        }
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideSpinner();
    }
}

// ===== GEOLOCATION =====
function getLocation() {
    if (!navigator.geolocation) {
        showError('Геолокация не поддерживается вашим браузером');
        return;
    }
    
    showSpinner();
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
        },
        function(error) {
            let errorMessage = 'Не удалось определить местоположение. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Разрешите доступ к геолокации в настройках браузера.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Информация о местоположении недоступна.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Время ожидания истекло.';
                    break;
                default:
                    errorMessage += 'Попробуйте ввести город вручную.';
            }
            showError(errorMessage);
            hideSpinner();
        },
        { timeout: 10000 }
    );
}

// ===== FAVORITES MANAGEMENT =====

function loadFavorites() {
    const saved = localStorage.getItem('weather_favorites');
    if (saved) {
        try {
            favorites = JSON.parse(saved);
            if (!Array.isArray(favorites)) favorites = [];
        } catch(e) {
            favorites = [];
        }
    }
    renderFavorites();
}

function saveFavorites() {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites.slice(0, 5)));
    renderFavorites();
}

function addToFavorites() {
    if (!currentCity) {
        showError('Нет активного города для добавления');
        return;
    }
    
    if (favorites.includes(currentCity)) {
        showError(`${currentCity} уже в избранном!`);
        return;
    }
    
    if (favorites.length >= 5) {
        showError('Можно добавить не более 5 городов в избранное');
        return;
    }
    
    favorites.push(currentCity);
    saveFavorites();
    showError(`${currentCity} добавлен в избранное!`);
    setTimeout(() => errorMsg.classList.add('hidden'), 2000);
}

function removeFromFavorites(city) {
    favorites = favorites.filter(c => c !== city);
    saveFavorites();
}

function clearFavorites() {
    favorites = [];
    saveFavorites();
}

function renderFavorites() {
    if (!favoritesList) return;
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<div style="color: #999; text-align: center; width: 100%;">Нет избранных городов</div>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(city => `
        <div class="favorite-item">
            <span>⭐ ${city}</span>
            <button class="remove-fav" data-city="${city}">✖</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.favorite-item').forEach(item => {
        const span = item.querySelector('span');
        const removeBtn = item.querySelector('.remove-fav');
        
        if (span) {
            span.addEventListener('click', () => {
                const city = span.textContent.replace('⭐ ', '');
                getWeather(city);
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const city = removeBtn.dataset.city;
                removeFromFavorites(city);
            });
        }
    });
}

// ===== UNIT TOGGLE =====
function setUnit(unit) {
    currentUnit = unit;
    
    if (unit === 'metric') {
        unitCBtn.classList.add('active');
        unitFBtn.classList.remove('active');
    } else {
        unitFBtn.classList.add('active');
        unitCBtn.classList.remove('active');
    }
    
    updateUnitDisplay();
}

// ===== EVENT LISTENERS =====
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = '';
    } else {
        showError('Пожалуйста, введите название города');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = '';
        }
    }
});

locationBtn.addEventListener('click', getLocation);
addFavoriteBtn.addEventListener('click', addToFavorites);
clearFavoritesBtn.addEventListener('click', clearFavorites);

unitCBtn.addEventListener('click', () => setUnit('metric'));
unitFBtn.addEventListener('click', () => setUnit('imperial'));

// ===== INITIALIZATION =====
function init() {
    loadFavorites();
    getWeather('Moscow');
}

init();