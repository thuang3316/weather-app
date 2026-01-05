async function getWeather(location, method) {
  const API_KEY = 'G294ALKAVC83DBB7KFK99BL9H';
  const currentDate = getFormattedDate();
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${currentDate}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Location not found");
    }

    const data = await response.json();
    const weather = processWeather(data);

    chooseBgImg(weather.conditions);
    // toggle
    const toggleIcon = document.querySelector('.toggle');
    function toggle () {
        const isFah = toggleIcon.src.includes('fah.svg'); 
        const method = isFah ? createCelsiusIcon : createFahrenheitIcon;

        render(weather, method);

        toggleIcon.src = isFah ? "./icons/cel.svg" : "./icons/fah.svg";
    }
    
    toggleIcon.addEventListener('click', toggle);
    render(weather, method);

  } catch (error) {
    handleWeatherError(error);
  }
}

function handleWeatherError(error) {
  const content = document.querySelector('.content');
  content.innerHTML = "";

  const msg = document.createElement('div');
  msg.classList.add('error');
  msg.textContent = "❌ Location not found. Please try another city.";

  content.appendChild(msg);
}

function getFormattedDate() {
    // get current date in the format of yyyy-MM-dd
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
    const day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate();

    return `${year}-${month}-${day}`;
}

function fahrenheitToCelsius(temp) {
    return ((temp - 32) * 5 / 9).toFixed(1);
}

function processWeather(response) {
    // return an object of weather information displayed on the page
    const today = response.days[0];
    const tempF = today.temp;
    const tempMaxF = today.tempmax;
    const tempMinF = today.tempmin;

    const tempC = fahrenheitToCelsius(tempF);
    const tempMaxC = fahrenheitToCelsius(tempMaxF);
    const tempMinC = fahrenheitToCelsius(tempMinF);

    const conditions = today.conditions;
    const location = response.address.toUpperCase();

    return {tempF, tempMaxF, tempMinF, tempC, tempMaxC, tempMinC, conditions, location};
}

function createFahrenheitIcon() {
  const img = document.createElement('img');
  img.src = './icons/fah.svg';
  img.classList.add('unit-icon', 'fah');
  return img;
}

function createCelsiusIcon() {
  const img = document.createElement('img');
  img.src = './icons/cel.svg';
  img.classList.add('unit-icon', 'cel');
  return img;
}

function render(weather, method) {
    const {tempF, tempMaxF, tempMinF, tempC, tempMaxC, tempMinC, conditions, location} = weather;
    const content = document.querySelector('.content');
    content.innerHTML = '';
    
    const address = document.createElement('div');
    address.classList.add('location');
    address.textContent = location

    const tempContainer = document.createElement('div');
    tempContainer.classList.add('tempContainer');

    const temp = document.createElement('div');
    temp.classList.add('temp');
    temp.textContent = method === createFahrenheitIcon ? tempF : tempC;

    tempContainer.append(temp, method());

    const condition = document.createElement('div');
    condition.classList.add('condition');
    condition.textContent = conditions;

    const highLowContainer = document.createElement('div');
    highLowContainer.classList.add('highLow');

    const highContainer = document.createElement('div');
    highContainer.classList.add('tempContainer');

    const highTemp = document.createElement('div');
    highTemp.classList.add('highTemp');
    highTemp.textContent = method === createFahrenheitIcon ? tempMaxF : tempMaxC;

    highContainer.append(highTemp, method());

    const lowContainer = document.createElement('div');
    lowContainer.classList.add('tempContainer');

    const lowTemp = document.createElement('div');
    lowTemp.classList.add('lowTemp');
    lowTemp.textContent = method === createFahrenheitIcon ? tempMinF : tempMinC;

    lowContainer.append(lowTemp, method());

    highLowContainer.append(highContainer, lowContainer);

    content.append(address, tempContainer, condition, highLowContainer);
}

const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const form = document.querySelector('form');
    const location = document.getElementById('location').value;
    form.reset();
    getWeather(location, createFahrenheitIcon);
});

async function getBgImg (keyword) {
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=PvDMDvo3ZZ5rsBbA6gMAhrM5iq77xZr7&s=${keyword}`;
    try {
        const response = await fetch(url);
        const imgData = await response.json();
        document.body.style.backgroundImage = `url(${imgData.data.images.original.url})`;
    } catch(err) {
        console.error(err);
    }
}

function chooseBgImg (conditions) {
    if (/rain/i.test(conditions)) {
        getBgImg('rainy');
    } else if (/cloud/i.test(conditions)) {
        getBgImg('cloudy');
    } else {
        getBgImg('sunny');
    }
}