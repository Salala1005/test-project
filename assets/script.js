// var APIKey = "5623fb7d8675d169764d733cafc79bab";
var searchInput = $("#search-input");
var searchButton = $("#search-button");
var searchHistory = JSON.parse(localStorage.getItem("input")) || [];

searchButton.on("click", function (e) {
  e.preventDefault();
  // var searchInputValue = searchInput.val().trim(); 이전코드
  var searchInputValue = searchInput.val();

  // 날씨 데이터 가져오기
  var fullCountryName = getFullCountryName(searchInputValue);
  fetchWeatherData(fullCountryName);

  // 뉴스 데이터 가져오기
  fetchNewsData(searchInputValue);
});

function fetchWeatherData(fullCountryName) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    fullCountryName +
    "&appid=5623fb7d8675d169764d733cafc79bab&units=metric";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Weather Data:", data);

      var cityName = data.city.name;
      var now = dayjs().format("DD/MM/YYYY");
      var temperature = data.list[0].main.temp;
      var icon =
        "https://openweathermap.org/img/w/" +
        data.list[0].weather[0].icon +
        ".png";

      var humidity = data.list[0].main.humidity;
      var wind = data.list[0].wind.speed;

      // 처음 빼고 데이터 삭제.최신 뉴스를 가져옴
      $("#today").find("#show-news").remove();

      var display = $(`<div class= "display m-3" >
      <h2>${cityName} (${now})
      <button id="show-news" class="btn btn-secondary my-2" data-bs-toggle="modal" data-bs-target="#newsModal">Show News</button>
      </h2>
      <img src="${icon}" alt="Weather Icon">
      <p> Temperature: ${temperature}°c</p>
      <p> Humidity: ${humidity}%</p>
      <p> Wind Speed: ${wind}Mph</p>

      </div>`);

      // display.append(cityName, now, temperature, icon, humidity, wind)
      $("#today").append(display);

      // to get 5days forecast

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
      saveHistory();
    });
}
// 날씨 API는 도시의 풀네임이 필요하고 뉴스는 나라의 줄임말이 필요해서 만듦. 날씨API만 씀
function getFullCountryName(countryCode) {
  switch (countryCode) {
    case "kr":
      return "Korea";
    case "jp":
      return "Japan";
    case "us":
      return "United States";
    case "ua":
      return "Ukraine";
    case "hk":
      return "Hong Kong";
    case "ca":
      return "Canada";
    case "ph":
      return "Philippines";
    default:
      return "";
  }
}

function fetchNewsData(countryCode) {
  // const url = "https://api.aviationstack.com/v1/flights";
  // const accessKey = "b6986e255c177ee84803c1d95cf8ef97";

  const url = "https://newsapi.org/v2/top-headlines?country=" + countryCode;
  const accessKey = "629a6e513ba3451eb9e420fff169050b";

  // fetch(`${url}?access_key=${accessKey}`)
  fetch(`${url}&apiKey=${accessKey}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("News data:", data);
      displayNewsData(data);
    })
}

function displayNewsData(data) {
  var newsModalContent = $("#news-modal-content");
  newsModalContent.empty();

  data.articles.forEach(function (article) {
    var articleElement = $(`<div class="card my-2">
      <h5 class="card-header">${article.source.name}</h5>
      <div class="card-body">
        <h6 class="card-title">${article.title}</h6>
        <p class="card-text">${article.description}</p>
        <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
      </div>
    </div>`);
    newsModalContent.append(articleElement);
  });
}

// to save search histoty
function saveHistory() {
  var historyValue = $("#history").val();
  searchHistory.push(historyValue);
  localStorage.setItem("input", JSON.stringify(searchHistory));
}
