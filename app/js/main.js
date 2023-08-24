const temp = document.querySelector(".main-degrees");
const feelsLike = document.querySelector(".main-degrees__feels");
const mainWeather = document.querySelector(".main-weather");
const mainCity = document.querySelector(".main-city");
const mainImg = document.querySelector(".main-img");
const inputValue = document.querySelector(".header-navigation__city");
const weatherList = document.querySelector(".weather-list");

let city = "London";

setInterval(() => {
  main();
  nextDay();
}, 10000);

document.querySelector(".header-navigation__btn").addEventListener("click", function (event) {
    event.preventDefault();
    let value = inputValue.value;
    if (!value) return false;
    city = value;
    main();
    nextDay();
    inputValue.value = "";
  });

function conversionTemp(temp) {
  let tempF = temp;
  let tempC = Math.floor(tempF) - 273 + "°C";

  return tempC;
}

async function main() {
  try {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d8828e68a9e64f72ceef0bbcf39d8639`)
    const data = await resp.json()
    
      temp.textContent = `${conversionTemp(data.main.temp)}`;
      feelsLike.textContent = `Feels like ${conversionTemp(data.main.feels_like)}`;
      mainWeather.textContent = `${data.weather[0].description}`;
      mainCity.textContent = `${data.name} ${data.sys.country}`;
      mainImg.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
  } catch  {
    alert("This city not found");
    city = "London";
    init();
    inputValue.value = "";
  }
}

async function nextDay() {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=d8828e68a9e64f72ceef0bbcf39d8639`)
    const data = await resp.json()
       
    let nextDay = [];

    for (let i = 0; i < data.list.length; i++) {
      if ((i + 1) % 8 === 0) {
        nextDay.push(data.list[i]);
      }
    }
      
    let render = nextDay.map((item) => {
      const dateTimeString = item.dt_txt
      const dateTime = new Date(dateTimeString);
      const dayOfWeek = dateTime.toLocaleDateString('en-US', { weekday: 'short' });
          
      return `<li class="weather-list__item">
                  <p>${dayOfWeek.toUpperCase()}</p>
               <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="">
                  <p class="section-weather">${item.weather[0].description}</p>
               <div class="section-temperature">
                  <p>${conversionTemp(item.main.temp)}</p>
                  <p>${conversionTemp(item.main.feels_like)}</p>
               </div>
            </li>`;
    });
  
    if (weatherList != "") {
      weatherList.innerHTML = "";
    }
    weatherList.insertAdjacentHTML("afterbegin", render.join(""));
    ;
}
  
main();
nextDay();