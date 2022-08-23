var baseUrl = 'https://api.openweathermap.org';
var apiKey = '386bacec31981402aa86b34dbee56885'
var lat = '';
var lon= '';
var inputEl = document.getElementById('inputEl')
var submitBtn = document.getElementById('submitBtn')
var currentDay = document.getElementById('currentDay')
var fiveDay = document.getElementById('fiveDay')
var pastSearchesDiv = document.getElementById('pastCities');

if(localStorage.getItem('city')) {
  var localCities = localStorage.getItem('city')
  var savedCities = localCities.split(',')
} else {
  var savedCities = [];
}

function callApi(event) {
  var inputValue = inputEl.value
  var searchUrl = "";

  if (inputValue) {
    searchUrl = `${baseUrl}/data/2.5/weather?q=${inputValue}&appid=${apiKey}`
    if (!savedCities.includes(inputValue)) {
      savedCities.push(inputValue)
      localStorage.setItem('city', savedCities);
    }
  } else {
    searchUrl = `${baseUrl}/data/2.5/weather?q=${event.target.textContent}&appid=${apiKey}`
  }

  // local storage
  // savedCities.push(inputValue)
  // localStorage.setItem('city', savedCities);

  console.log(event.target.textContent);

  fetch(searchUrl)
  .then(function (response) {
    console.log(response);
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          lat = data.coord.lat;
          lon = data.coord.lon;
          secondApiCall(lat, lon)
        }) 
      }
  })
  // try the buttons method and if it doesnt work than fuck it
};


function secondApiCall (lat, lon) {
  var secondSearchUrl = `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    (fetch(secondSearchUrl))
    .then(function(response) {
      if(response.ok) {
        response.json().then(function(data) {
          displayCurrentDay(data)
          displayFiveDay(data)
        })
      }
  })
};


function displayCurrentDay(data) {
  console.log(data);
  //use moment for date instead of disecting it / M5 A26
  var inputValue =inputEl.value
  var temp = document.createElement('li');
  var city = document.createElement ('h1');
  var iconEl = document.createElement('img');
  var humidtyEl = document.createElement('li');
  var windSpeedEl = document.createElement('li');
  var uvEl = document.createElement('li')
  var unixTimestamp = data.daily[0].dt;
  var date = new Date(unixTimestamp * 1000);

  currentDay.innerHTML = '';
  iconEl.src = `https://openweathermap.org/img/w/${data.daily[0].weather[0].icon}.png`;
  humidtyEl.textContent = "Humidity: " + data.daily[0].humidity + "%"
  windSpeedEl.textContent = "Wind Speed: " + data.daily[0].wind_speed + " mph"
  city.textContent = inputValue; 
  temp.textContent = data.current.temp;
  uvEl.textContent = data.current.uvi

  currentDay.append(city);
  currentDay.append(date);
  currentDay.append(temp);
  currentDay.append(iconEl)
  currentDay.append(humidtyEl)
  currentDay.append(windSpeedEl)
  currentDay.append(uvEl)
  console.log(uvEl.textContent);

  if (uvEl.textContent <= 2) {
    uvEl.classList.add("bg-success")
  } else if (uvEl.textContent > 2 && uvEl.textContent <= 5) {
    uvEl.classList.add("bg-warning")
  } else if (uvEl.textContent > 5) {
    uvEl.classList.add("bg-danger")
  }

}


function displayFiveDay(data) {
  for (var i = 0; i < 5; i++) {
    var dayDiv = document.createElement('div');
    var dateEl = document.createElement('li')
    var tempEl = document.createElement('li');
    var humidtyEl = document.createElement('li');
    var windSpeedEl = document.createElement('li');
    var iconEl = document.createElement('img');

    var unixTimestamp = data.daily[i].dt;
    var date = new Date(unixTimestamp * 1000);

    tempEl.textContent = "Temp: " + data.daily[i].temp.day;
    humidtyEl.textContent = "Humidity: " + data.daily[i].humidity + "%"
    windSpeedEl.textContent = "Wind Speed: " + data.daily[i].wind_speed + " mph"
    iconEl.src = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
    // dateEl.textContent = data.daily[i].timezone
    dayDiv.className = 'col bg-primary text-white ml-3 mb-3 rounded forecast';

    dateEl.append(date)
    dayDiv.append(dateEl)
    dayDiv.append(tempEl);
    dayDiv.append(windSpeedEl);
    dayDiv.append(iconEl);
    dayDiv.append(humidtyEl);

    fiveDay.append(dayDiv)
  }

};


function pastSearches () {
  // empty the div in javascript
  if (localStorage.getItem('city')) {
    var cities = localStorage.getItem('city')
    var test = cities.split(',')

  console.log(test);
  test.forEach(city => {
    // stop adding buttons if they already exist. 
    var button = document.createElement('button');
    button.textContent = city;
    pastSearchesDiv.append(button)
    button.addEventListener('click', callApi)
    })
  }
}
pastSearches()
submitBtn.addEventListener('click', callApi)
// callApi()

