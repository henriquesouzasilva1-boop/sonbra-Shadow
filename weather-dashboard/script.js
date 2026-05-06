// ===== CONFIGURAÇÃO API =====
const API_KEY = 'SUA_CHAVE_API_AQUI'; // Substitua pela sua chave OpenWeatherMap
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_API = 'https://api.openweathermap.org/geo/1.0';

// ===== VARIÁVEIS GLOBAIS =====
let currentCity = 'São Paulo';
let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
let compareList = [];
let charts = {};
let isDarkMode = localStorage.getItem('isDarkMode') === 'true';

// ===== ELEMENTOS DO DOM =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const themeToggle = document.getElementById('themeToggle');
const historyList = document.getElementById('historyList');
const suggestionsList = document.getElementById('suggestionsList');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadHistory();
    setupEventListeners();
    fetchWeather(currentCity);
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) fetchWeather(city);
        }
    });

    cityInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            getSuggestions(query);
        } else {
            suggestionsList.classList.remove('active');
        }
    });

    geoBtn.addEventListener('click', getGeolocation);
    themeToggle.addEventListener('click', toggleTheme);

    document.getElementById('compareBtn').addEventListener('click', () => {
        const city = document.getElementById('compareInput').value.trim();
        if (city && !compareList.includes(city)) {
            compareList.push(city);
            updateCompareList();
            document.getElementById('compareInput').value = '';
        }
    });
}

// ===== TEMA =====
function initTheme() {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    updateThemeIcon();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', isDarkMode);
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    updateThemeIcon();
}

function updateThemeIcon() {
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// ===== API CALLS =====
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        
        if (!response.ok) {
            throw new Error('Cidade não encontrada');
        }

        const data = await response.json();
        currentCity = data.name;
        
        // Buscar previsão de 5 dias
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const forecastData = await forecastResponse.json();

        // Atualizar histórico
        addToHistory(data.name);
        cityInput.value = '';
        suggestionsList.classList.remove('active');

        // Renderizar dados
        displayCurrentWeather(data);
        displayForecast(forecastData.list);
        displayHourlyForecast(forecastData.list);
        displayCharts(forecastData.list);
        displayAlerts(data);

    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

async function getSuggestions(query) {
    try {
        const response = await fetch(
            `${GEO_API}/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        suggestionsList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}, ${item.country}`;
            li.addEventListener('click', () => {
                cityInput.value = item.name;
                fetchWeather(item.name);
            });
            suggestionsList.appendChild(li);
        });
        
        if (data.length > 0) {
            suggestionsList.classList.add('active');
        }
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
    }
}

function getGeolocation() {
    if (navigator.geolocation) {
        geoBtn.textContent = '⏳';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
                geoBtn.textContent = '📍';
            },
            (error) => {
                alert('Erro ao obter localização: ' + error.message);
                geoBtn.textContent = '📍';
            }
        );
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const data = await response.json();
        
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const forecastData = await forecastResponse.json();

        currentCity = data.name;
        addToHistory(data.name);

        displayCurrentWeather(data);
        displayForecast(forecastData.list);
        displayHourlyForecast(forecastData.list);
        displayCharts(forecastData.list);
        displayAlerts(data);

    } catch (error) {
        alert('Erro ao buscar clima: ' + error.message);
    }
}

// ===== RENDERIZAÇÃO - CLIMA ATUAL =====
function displayCurrentWeather(data) {
    const section = document.getElementById('currentWeather');
    const dewPoint = calculateDewPoint(data.main.temp, data.main.humidity);
    const uvIndex = estimateUVIndex(data.clouds.all);

    const html = `
        <div class="weather-card">
            <div class="weather-header">
                <h2 id="cityName">${data.name}, ${data.sys.country}</h2>
                <p id="currentDate">${new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </div>
            <div class="weather-main">
                <img id="weatherIcon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="Clima" class="weather-icon">
                <div class="temp-section">
                    <div class="temp">
                        <span id="temperature">${Math.round(data.main.temp)}</span>
                        <span class="unit">°C</span>
                    </div>
                    <p id="weatherDescription" class="weather-description">${data.weather[0].description}</p>
                </div>
            </div>
            <div class="weather-details">
                <div class="detail">
                    <span class="label">Sensação Térmica</span>
                    <span id="feelsLike">${Math.round(data.main.feels_like)}°C</span>
                </div>
                <div class="detail">
                    <span class="label">Umidade</span>
                    <span id="humidity">${data.main.humidity}%</span>
                </div>
                <div class="detail">
                    <span class="label">Pressão</span>
                    <span id="pressure">${data.main.pressure} hPa</span>
                </div>
                <div class="detail">
                    <span class="label">Visibilidade</span>
                    <span id="visibility">${(data.visibility / 1000).toFixed(1)} km</span>
                </div>
                <div class="detail">
                    <span class="label">Vento</span>
                    <span id="windSpeed">${(data.wind.speed * 3.6).toFixed(1)} km/h</span>
                </div>
                <div class="detail">
                    <span class="label">Direção do Vento</span>
                    <span id="windDirection">${getWindDirection(data.wind.deg)}</span>
                </div>
                <div class="detail">
                    <span class="label">Ponto de Orvalho</span>
                    <span id="dewPoint">${dewPoint.toFixed(1)}°C</span>
                </div>
                <div class="detail">
                    <span class="label">Índice UV</span>
                    <span id="uvIndex">${uvIndex}</span>
                </div>
                <div class="detail">
                    <span class="label">Nascer do Sol</span>
                    <span id="sunrise">${new Date(data.sys.sunrise * 1000).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="detail">
                    <span class="label">Pôr do Sol</span>
                    <span id="sunset">${new Date(data.sys.sunset * 1000).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        </div>
    `;
    
    section.innerHTML = html;
    section.classList.remove('hidden');
}

// ===== RENDERIZAÇÃO - PREVISÃO 5 DIAS =====
function displayForecast(list) {
    const section = document.getElementById('forecastSection');
    const forecastList = document.getElementById('forecastList');
    
    // Pegar um item por dia (a cada 8 previsões = 24 horas)
    const dailyForecast = list.filter((item, index) => index % 8 === 0).slice(0, 5);
    
    forecastList.innerHTML = dailyForecast.map(item => `
        <div class="forecast-item">
            <div class="forecast-day">${new Date(item.dt * 1000).toLocaleDateString('pt-BR', {weekday: 'short'})}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Ícone" class="forecast-icon">
            <div class="forecast-temp">
                <span>${Math.round(item.main.temp_max)}°</span>
                <span>${Math.round(item.main.temp_min)}°</span>
            </div>
            <p class="forecast-desc">${item.weather[0].description}</p>
        </div>
    `).join('');
    
    section.classList.remove('hidden');
}

// ===== RENDERIZAÇÃO - PREVISÃO HORÁRIA =====
function displayHourlyForecast(list) {
    const section = document.getElementById('hourlySection');
    const hourlyList = document.getElementById('hourlyList');
    
    // Próximas 24 horas (8 itens de 3 em 3 horas)
    const next24Hours = list.slice(0, 8);
    
    hourlyList.innerHTML = next24Hours.map(item => `
        <div class="hourly-item">
            <div class="hourly-time">${new Date(item.dt * 1000).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Ícone" class="hourly-icon">
            <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
        </div>
    `).join('');
    
    section.classList.remove('hidden');
}

// ===== RENDERIZAÇÃO - GRÁFICOS =====
function displayCharts(list) {
    const section = document.getElementById('chartsSection');
    const temperatures = [];
    const humidity = [];
    const windSpeed = [];
    const precipitation = [];
    const labels = [];
    
    list.forEach((item, index) => {
        if (index % 2 === 0) { // A cada 6 horas
            labels.push(new Date(item.dt * 1000).toLocaleTimeString('pt-BR', {hour: '2-digit'}));
            temperatures.push(item.main.temp);
            humidity.push(item.main.humidity);
            windSpeed.push((item.wind.speed * 3.6).toFixed(1));
            precipitation.push(item.rain ? item.rain['3h'] || 0 : 0);
        }
    });
    
    // Gráfico de Temperatura
    createChart('tempChart', 'Temperatura (°C)', temperatures, labels, 'rgb(99, 102, 241)');
    
    // Gráfico de Umidade
    createChart('humidityChart', 'Umidade (%)', humidity, labels, 'rgb(59, 130, 246)');
    
    // Gráfico de Vento
    createChart('windChart', 'Velocidade do Vento (km/h)', windSpeed, labels, 'rgb(34, 197, 94)');
    
    // Gráfico de Precipitação
    createChart('precipitationChart', 'Precipitação (mm)', precipitation, labels, 'rgb(245, 158, 11)');
    
    section.classList.remove('hidden');
}

function createChart(canvasId, label, data, labels, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }
                },
                x: {
                    grid: {
                        color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }
                }
            }
        }
    });
}

// ===== ALERTAS =====
function displayAlerts(data) {
    const section = document.getElementById('alertsSection');
    const alertsList = document.getElementById('alertsList');
    const alerts = [];
    
    // Temperatura muito alta
    if (data.main.temp > 35) {
        alerts.push('⚠️ Alerta de Calor Extremo: Temperatura acima de 35°C');
    }
    
    // Temperatura muito baixa
    if (data.main.temp < 0) {
        alerts.push('❄️ Alerta de Frio Extremo: Temperatura abaixo de 0°C');
    }
    
    // Vento forte
    if (data.wind.speed > 10) {
        alerts.push('💨 Alerta de Vento Forte: Velocidade acima de 36 km/h');
    }
    
    // Pressão baixa
    if (data.main.pressure < 1000) {
        alerts.push('🌪️ Pressão Baixa: Possibilidade de tempestades');
    }
    
    // Chuva
    if (data.rain) {
        alerts.push('🌧️ Aviso de Chuva: Possibilidade de precipitação');
    }
    
    // Neblina
    if (data.visibility < 1000) {
        alerts.push('🌫️ Alerta de Visibilidade Reduzida: Menos de 1 km');
    }
    
    if (alerts.length > 0) {
        alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <strong>${alert}</strong>
            </div>
        `).join('');
        section.classList.remove('hidden');
    } else {
        alertsList.innerHTML = '<p style="color: green;">✅ Sem alertas - Clima normal</p>';
        section.classList.remove('hidden');
    }
}

// ===== HISTÓRICO =====
function addToHistory(city) {
    // Remover duplicatas
    searchHistory = searchHistory.filter(h => h !== city);
    // Adicionar no início
    searchHistory.unshift(city);
    // Manter últimas 10
    searchHistory = searchHistory.slice(0, 10);
    localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = searchHistory.map(city => `
        <div class="history-item" onclick="fetchWeather('${city}')">${city}</div>
    `).join('');
}

// ===== COMPARAÇÃO DE CIDADES =====
async function updateCompareList() {
    const section = document.getElementById('compareSection');
    const compareList_el = document.getElementById('compareList');
    
    let html = '';
    
    for (const city of compareList) {
        try {
            const response = await fetch(
                `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
            );
            const data = await response.json();
            
            html += `
                <div class="compare-item">
                    <button class="compare-close" onclick="removeFromCompare('${city}')">✕</button>
                    <div class="compare-city-name">${data.name}</div>
                    <div class="compare-detail">
                        <span>Temperatura:</span>
                        <strong>${Math.round(data.main.temp)}°C</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Sensação:</span>
                        <strong>${Math.round(data.main.feels_like)}°C</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Umidade:</span>
                        <strong>${data.main.humidity}%</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Vento:</span>
                        <strong>${(data.wind.speed * 3.6).toFixed(1)} km/h</strong>
                    </div>
                    <div class="compare-detail">
                        <span>Clima:</span>
                        <strong>${data.weather[0].description}</strong>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erro ao comparar:', error);
        }
    }
    
    compareList_el.innerHTML = html;
    if (compareList.length > 0) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

function removeFromCompare(city) {
    compareList = compareList.filter(c => c !== city);
    updateCompareList();
}

// ===== UTILITÁRIOS =====
function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function estimateUVIndex(cloudCoverage) {
    // Estimativa baseada em cobertura de nuvens
    const baseUV = 5;
    const reducedUV = baseUV * (1 - cloudCoverage / 100);
    return Math.max(0, reducedUV).toFixed(1);
}