// var APIKey = "5623fb7d8675d169764d733cafc79bab";
var searchInput = $("#search-input");
var searchButton = $("#search-button");
var searchHistory = JSON.parse(localStorage.getItem("input")) || [];

// TODO
// 1. When user search for a city in the input, call weather API and show the result in the HTML
//    - Add event listener to form submit
searchButton.on("click", function (e) {
  e.preventDefault();
  var searchInputValue = searchInput.val().trim();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchInputValue +
    "&appid=5623fb7d8675d169764d733cafc79bab&units=metric";
    fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);

      var cityName = data.city.name;
      var now = dayjs().format("DD/MM/YYYY");
      console.log(now);
      var temperature = data.list[0].main.temp;
      var icon =
        "https://openweathermap.org/img/w/" +
        data.list[0].weather[0].icon +
        ".png";
      // console.log(icon);
      var humidity = data.list[0].main.humidity;
      var wind = data.list[0].wind.speed;

      var display = $(`<div class= "display m-3" >
      <h3>${cityName} (${now})</h2>
      <img src="${icon}" alt="Weather Icon">
      <p> Temperature: ${temperature}°c</p>
      <p> Humidity: ${humidity}%</p>
      <p> Wind Speed: ${wind}Mph</p>
      </div>`);

      // display.append(cityName, now, temperature, icon, humidity, wind)
      $("#today").empty();
      $("#today").append(display);

      // to get 5days forecast
      $("#forecast").empty();
      for (let i = 7; i < data.list.length; i += 7) {
        var temperature = data.list[i].main.temp;
        var icon =
          "https://openweathermap.org/img/w/" +
          data.list[i].weather[0].icon +
          ".png";
        var humidity = data.list[i].main.humidity;
        var wind = data.list[i].wind.speed;
        var dateTime = data.list[i].dt_txt;
        var date = dateTime.split(" ")[0];

        // to disaply 5days forecast
        var disply = $(`<div class= "display col-md-2 card m-2 bg-primary" >
        <h4> ${date}</h4>
        <img src="${icon}" alt="Weather Icon">
        <p> Temp: ${temperature}°c</p>
        <p> Humidity: ${humidity}%</p>
        <p> Wind Speed: ${wind}Mph</p>
        </div>`);

        $("#forecast").append(disply);
      }
      saveHistory();
      init();
    });
});

// to save search histoty
function saveHistory() {
  var historyValue = $("#search-input").val();
  searchHistory.push(historyValue);
  localStorage.setItem("input", JSON.stringify(searchHistory));
}

// to display saved history in buttons
function init() {
  $("#history").empty();
  var recentHistory = [...searchHistory].reverse();
  for (let i = 0; i < recentHistory.length; i++) {
    if (i < 6) {
      var cityButton = $(
        `<button class= " d-block m-1 rounded"> ${recentHistory[i]} </button>`
      );
      $("#history").append(cityButton);

      cityButton.attr("data-cityname", recentHistory[i]);
    }
  }
  // to display clicked saved history buttons
  $("#history").on("click", ["data-cityname"], function (e) {
    var cityData = e.target.dataset.cityname;
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityData +
      "&appid=5623fb7d8675d169764d733cafc79bab&units=metric";
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log(data);

        var cityName = data.city.name;
        var now = dayjs().format("DD/MM/YYYY");
        // console.log(now);
        var temperature = data.list[0].main.temp;
        var icon =
          "https://openweathermap.org/img/w/" +
          data.list[0].weather[0].icon +
          ".png";
        // console.log(icon);
        var humidity = data.list[0].main.humidity;
        var wind = data.list[0].wind.speed;

        var display = $(`<div class= "display m-3" >
        <h3>${cityName} (${now})</h2>
        <img src="${icon}" alt="Weather Icon">
        <p> Temperature: ${temperature}°c</p>
        <p> Humidity: ${humidity}%</p>
        <p> Wind Speed: ${wind}Mph</p>
        </div>`);

        // display.append(cityName, now, temperature, icon, humidity, wind)
        $("#today").empty();
        $("#today").append(display);

        $("#forecast").empty();
        for (let i = 7; i < data.list.length; i += 7) {
          var temperature = data.list[i].main.temp;
          var icon =
            "https://openweathermap.org/img/w/" +
            data.list[i].weather[0].icon +
            ".png";
          var humidity = data.list[i].main.humidity;
          var wind = data.list[i].wind.speed;
          var dateTime = data.list[i].dt_txt;
          var date = dateTime.split(" ")[0];

          var disply = $(`<div class= "display col-md-2 card m-2 bg-primary" >

        <h4> ${date}</h4>
        <img src="${icon}" alt="Weather Icon">
        <p> Temp: ${temperature}°c</p>
        <p> Humidity: ${humidity}%</p>
        <p> Wind Speed: ${wind}Mph</p>

        </div>`);

          $("#forecast").append(disply);
        }
      });
  });
}
init();

