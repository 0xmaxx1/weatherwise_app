/*
| 📅 Finish Date    | 2024-07-4                           |
|-------------------|-------------------------------------|
| 🛠️ Tech Used      | HTML, CSS, JS, Bootstrap, WeatherAPI, Swiper.js, FontAwesome |
|-------------------|-------------------------------------|
|                    | A weather website that displays current and forecasted weather |
|                    | information using WeatherAPI. Features include a dynamic swiper |
| 📝 Details         |  component for hourly and daily forecasts, and various weather  |
|                   |   details such as temperature, humidity, wind speed, and UV index. |
|-------------------|-------------------------------------|
| 🚀 Status         | Completed                           |
|-------------------|-------------------------------------|
| 🧑‍💻 Developer    | Mohamed Reda                        |
|-------------------|-------------------------------------|
| 🧑‍🏫 Instructor    | Ahmed Menissy                      |
|-------------------|-------------------------------------|
| 🧑‍🏫 Mentor       | Farouk Zaazaa                       |
*/
"use strict";

const searchcity = document.getElementById("searchcity");
const searchInput = document.getElementById("searchInput");
const arrow = document.getElementById("arrow");
const searchiconcity = document.getElementById("searchiconcity");
const loading = document.getElementById("loading");
let infodataapi;
let iid;
let iiid;
/*************************************************\
*  Get IP to Display Information For Location      *
\**************************************************/
async function getIp() {
  try {
    document.getElementById("errorMessage").classList.add("d-none");
    loading.classList.remove("d-none");
    let responsip = await fetch("https://api.ipify.org/?format=json");
    let handleip = await responsip.json();
    let formateip = handleip.ip;
    let responsecountryf = await fetch(
      `https://apiip.net/api/check?ip=${formateip}&accessKey=b612e763-7be1-49df-b00d-6605e7d26763`
    );
    let respcountryj = await responsecountryf.json();
    getData(respcountryj.city);
  } catch (err) {
    console.error("Error", err);
  } finally {
    setTimeout(function () {
      loading.classList.add("d-none");
      document.getElementById("errorMessage").classList.remove("d-none");
      document.getElementById("errorMessage").innerHTML =
        "Please press Enter to search";
    }, 500);
    iid = setTimeout(function () {
      document.getElementById("errorMessage").classList.add("d-none");
    }, 4000);
  }
}
getIp();
/************************************\
* Handle button Current Location      *
\************************************/
document.getElementById("location").addEventListener("click", function () {
  getIp();
});

/*****************\
*  Handle Swipper  *
\*****************/

function swiper() {
  let swiper = new Swiper(".swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 20,
    pagination: {
      el: "swiper-pagination",
    },
  });
}
arrow.addEventListener("click", function () {
  searchiconcity.classList.remove("d-none");
  arrow.classList.add("d-none");
  searchcity.classList.remove("newinputsearch");
  searchInput.classList.remove("find");
});
document.getElementById("iconSearch").addEventListener("click", function () {
  searchcity.classList.add("newinputsearch");
  searchInput.classList.add("find");
  searchiconcity.classList.add("d-none");
  arrow.classList.remove("d-none");
  document.getElementById("errorMessage").innerHTML =
    "Please press Enter to search";
  document.getElementById("errorMessage").classList.remove("d-none");
  iiid = setTimeout(function () {
    document.getElementById("errorMessage").classList.add("d-none");
  }, 4000);
});
/*********************\
*  Handle Input Search *
\**********************/
searchInput.addEventListener("change", function () {
  let searchValue = searchInput.value.trim();
  let regex = /^[a-zA-Z\u0621-\u064A\s]+$/;

  if (regex.test(searchValue)) {
    getData(searchValue);
  } else {
    if (searchInput.value.length == 0) {
      document.getElementById("errorMessage").classList.add("d-none");
    } else {
      document.getElementById("errorMessage").innerHTML =
        " Please enter a valid city name...";
      document.getElementById("errorMessage").classList.remove("d-none");
      clearTimeout(iid);
      clearTimeout(iiid);
    }
  }
});
searchInput.addEventListener("input", function () {
  if (searchInput.value.length == 0) {
    document.getElementById("errorMessage").classList.add("d-none");
  }
});
/*******************************\
*   Get Data From Api => 3 Days *
\********************************/
async function getData(valueCity) {
  try {
    searchInput.value = null;
    searchInput.blur();
    document.getElementById("errorMessage").classList.add("d-none");
    loading.classList.remove("d-none");
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=cc7c282813e7441784c135438242406&q=${valueCity}&days=3`
    );
    if (!response.ok) {
      document.getElementById("errorMessage").classList.remove("d-none");
    }
    let Data = await response.json();
    displayDatac(Data);
  } catch (error) {
    //
    console.error("Error fetching data:", error);
  } finally {
    setTimeout(function () {
      loading.classList.add("d-none");
      searchcity.classList.remove("newinputsearch");
    }, 500);
  }
}
/****************************************\
*   Get Date From Api And Handle Formate *
\****************************************/
function getdate(info) {
  let arrdate = [];
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (let i = 0; i < info.forecast.forecastday.length; i++) {
    let dateofDay = info.forecast.forecastday[i].date;
    let date = new Date(dateofDay);
    let dayOfWeek = daysOfWeek[date.getDay()]; // sunday
    let month = months[date.getMonth()]; //jul
    let dayOfMonth = date.getDate(); // 4
    let dateon = {
      stringday: dayOfWeek,
      stringmonth: month,
      numofday: dayOfMonth,
    };
    arrdate.push(dateon);
  }
  return arrdate;
}
/*********************************\
*  Display current day information *
\**********************************/
function displayDatac(data) {
  let curentdate = getdate(data)[0];
  let formatofdate = `${curentdate.stringday} ${curentdate.numofday} ${curentdate.stringmonth}`;
  let containertemp = `
              <h3>Now</h3>
              <div class="headtemp  position-relative d-flex">
                <h2>${data.current.temp_c}°<sup>c</sup></h2>
                <img src="https:${data.current.condition.icon}" alt="night" />
              </div>
              <p>${data.current.condition.text} Sky</p>
              <div class="items">
                <div class="item d-flex align-items-baseline">
                  <i class="fa-regular fa-calendar-days"></i>
                  <p class="ps-2">${formatofdate}</p>
                </div>
                <div class="item d-flex align-items-baseline">
                  <i class="fa-solid fa-location-dot"></i>
                  <p class="ps-2">${data.location.name}, ${data.location.country}</p>
                </div>
              </div>
  `;
  document.getElementById("tempDisplay").innerHTML = containertemp;
  DisplayDataTandother(data);
}

/*************************************************************\
*  Display current day information and Other Days =>  Forecast*
\*************************************************************/
function DisplayDataTandother(info) {
  infodataapi = info;
  let dateofdaay = getdate(info);
  let containerforecast = ``;
  for (let i = 0; i < info.forecast.forecastday.length; i++) {
    containerforecast += `
                <div
                  class="day w-100 d-flex"
                  onclick="displayindex(${i})"
                >
                  <div class="tempday d-flex">
                    <img src="https:${info.forecast.forecastday[i].day.condition.icon}" alt="night" />
                    <div class="tempdayinfo">
                      <p>max: <span>${info.forecast.forecastday[i].day.maxtemp_c}°</span></p>
                      <p>min: <span>${info.forecast.forecastday[i].day.mintemp_c}°</span></p>
                      <p>avg: <span>${info.forecast.forecastday[i].day.avgtemp_c}°</span></p>
                    </div>
                  </div>
                  <div class="texttempday d-flex justify-content-between">
                    <p>${dateofdaay[i].numofday} ${dateofdaay[i].stringmonth}</p>
                    <p>${dateofdaay[i].stringday}</p>
                  </div>
                </div>
    `;
  }
  document.getElementById("days").innerHTML = containerforecast;
  dispayHightlight(0, info);
}
/*********************************\
*  Get Index To display Days      *
\**********************************/
function displayindex(inde) {
  dispayHightlight(inde, infodataapi);
}
/*********************************\
*  Display Hightlight Days        *
\**********************************/
function dispayHightlight(index, data) {
  let hambozo = "";
  let dateofdayhighlight;
  if (index == 0) {
    dateofdayhighlight = "Today";
  } else {
    dateofdayhighlight = getdate(data)[index].stringday;
  }
  let cartona = `
  <h3>${dateofdayhighlight} Highlights</h3>
              <div class="hightlight">
                <div class="qualitysun">
                  <div class="temprature">
                    <div class="head-temprature d-flex justify-content-between">
                      <h5>Temperature Overview</h5>
                      <span title="Display The Weather Condition">${data.forecast.forecastday[index].day.condition.text}</span>
                    </div>
                    <div class="wrap d-flex">
                      <i class="fa-solid fa-temperature-three-quarters"></i>
                      <ul
                        class="list-unstyled d-flex justify-content-around w-100"
                      >
                        <li class="d-flex flex-column align-items-center">
                          <p>max</p>
                          <p class="num">${data.forecast.forecastday[index].day.maxtemp_c}°<sup>c</sup></p>
                        </li>
                        <li class="d-flex flex-column align-items-center">
                          <p>min</p>
                          <p class="num">${data.forecast.forecastday[index].day.mintemp_c}°<sup>c</sup></p>
                        </li>
                        <li class="d-flex flex-column align-items-center">
                          <p>avg</p>
                          <p class="num">${data.forecast.forecastday[index].day.avgtemp_c}°<sup>c</sup></p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="sunrise-sunset">
                    <h5>Sunrise & Sunset</h5>
                    <div
                      class="wrapsun d-flex justify-content-between align-items-center"
                    >
                      <div class="wrapitem d-flex">
                        <i class="fa-regular fa-sun"></i>
                        <div class="infosun">
                          <p>Sunrise</p>
                          <p>${data.forecast.forecastday[index].astro.sunrise}</p>
                        </div>
                      </div>
                      <hr class="hhr" />
                      <div class="wrapitem d-flex">
                        <i class="fa-regular fa-moon"></i>
                        <div class="infosun">
                          <p>Sunset</p>
                          <p>${data.forecast.forecastday[index].astro.sunset}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-info">
                    <h5>Moon Phase</h5>
                    <div
                      class="infos-moon d-flex justify-content-between align-items-center"
                    >
                      <img src="./img/moon-phases_.png" class="moon-img" alt="moon" />
                      <div class="arrow"></div>
                      <p>${data.forecast.forecastday[index].astro.moon_phase}</p>
                    </div>
                  </div>
                </div>
                <!--  -->
                <div class="other-info">
                  <div class="item-info">
                    <h5>Humidity</h5>
                    <div
                      class="infos d-flex justify-content-between align-items-center"
                    >
                      <i class="fa-solid fa-droplet"></i>
                      <div class="arrow"></div>
                      <p>${data.forecast.forecastday[index].day.avghumidity}%</p>
                    </div>
                  </div>
                  <div class="item-info">
                    <h5>Max Wind Speed</h5>
                    <div
                      class="infos d-flex justify-content-between align-items-center"
                    >
                      <i class="fa-solid fa-wind"></i>
                      <div class="arrow"></div>
                      <p>${data.forecast.forecastday[index].day.maxwind_kph} km</p>
                    </div>
                  </div>
                  <div class="item-info">
                    <h5>Average Visibility</h5>
                    <div
                      class="infos d-flex justify-content-between align-items-center"
                    >
                      <i class="fa-regular fa-eye"></i>
                      <div class="arrow"></div>
                      <p>${data.forecast.forecastday[index].day.avgvis_km} km</p>
                    </div>
                  </div>
                  <div class="uv-index">
                    <h5>UV Index</h5>
                    <div class="uv-wrap d-flex justify-content-between">
                      <img src="./img/ivindex.png" alt="UV Index" />
                      <div class="arrow"></div>
                      <p>${data.forecast.forecastday[index].day.uv}</p>
                    </div>
                  </div>
                </div>
                <!--  -->
              </div>
  `;
  document.getElementById("highlightSection").innerHTML = cartona;
  for (let i = 0; i < data.forecast.forecastday[index].hour.length; i++) {
    let timehandle =
      data.forecast.forecastday[index].hour[i].time.split(" ")[1];
    let timeday = parseInt(timehandle.substring(0, 2));
    if (timeday == 0) {
      timeday = "12 AM";
    } else if (timeday == 12) {
      timeday = "12 PM";
    } else if (timeday > 12) {
      timeday = timeday - 12 + " PM";
    } else {
      timeday = timeday + " AM";
    }
    hambozo += `
<div class="swiper-slide">
                    <div class="item-hour position-relative d-flex flex-column">
                      <span
                        title="Display Wind Direction"
                        class="position-absolute d-flex gap-2 left"
                      >
                        <img
                          src="./img/wind-direction.png"
                          alt="wind direction"
                        />
                        <p>${data.forecast.forecastday[index].hour[i].wind_dir}</p></span
                      >
                      <div
                        class="head-hour gap-2 d-flex flex-column justify-content-between align-items-center"
                      >
                        <p>${timeday}</p>
                        <div class="infotemphour">
                          <div
                            class="imgtemph  d-flex justify-content-between align-items-center"
                          >
                            <img src="https:${data.forecast.forecastday[index].hour[i].condition.icon}" alt="" />
                            <h3>${data.forecast.forecastday[index].hour[i].temp_c}°<sup>c</sup></h3>
                          </div>
                        </div>
                        <span
                        title="Display The Weather Condition"
                        class=" right"
                        >${data.forecast.forecastday[index].hour[i].condition.text}</span
                      >
                      </div>
                      <div class="sec-hour-info">
                        <div class="hoour-info">
                          <h5>Humidity</h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <i class="fa-solid fa-droplet"></i>
                            <p>${data.forecast.forecastday[index].hour[i].humidity}%</p>
                          </div>
                        </div>
                        <div class="hoour-info">
                          <h5>Wind Speed</h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <i class="fa-solid fa-wind"></i>
                            <p>${data.forecast.forecastday[index].hour[i].wind_kph} km</p>
                          </div>
                        </div>
                        <div class="hoour-info">
                          <h5 title="Atmospheric Pressure in Millibars">
                            Pressure
                          </h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <i class="fa-solid fa-gauge-simple"></i>
                            <p>${data.forecast.forecastday[index].hour[i].pressure_mb} mb</p>
                          </div>
                        </div>
                        <div class="hoour-info">
                          <h5>Feels Like</h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <i class="fa-solid fa-temperature-low"></i>
                            <p>${data.forecast.forecastday[index].hour[i].feelslike_c}°<sup>c</sup></p>
                          </div>
                        </div>
                        <div class="hoour-info">
                          <h5>Visibility</h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <i class="fa-regular fa-eye"></i>
                            <p>${data.forecast.forecastday[index].hour[i].vis_km} km</p>
                          </div>
                        </div>
                        <div class="hoour-info">
                          <h5>UV Index</h5>
                          <div
                            class="infoshour d-flex justify-content-between align-items-center"
                          >
                            <img src="./img/ivindex.png" alt="UV Index" />
                            <p>${data.forecast.forecastday[index].hour[i].uv}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  `;
  }
  document.getElementById("todays").innerHTML = `
                <h3>${dateofdayhighlight} at</h3>
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  ${hambozo}
                </div>
                <div class="swiper-pagination"></div>
              </div>
            `;
  swiper();
}
