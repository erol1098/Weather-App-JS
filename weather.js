const key = "b473abf08211233160d13b09b0646297";
const dataArr = [];
const city = document.querySelector(".entry");
const search = document.getElementById("btn");
const content = document.querySelector(".content");

city.onchange = (e) => {
  getWeather();
  city.value = "";
};
search.onclick = (e) => {
  getWeather();
  city.value = "";
};

const getWeather = async () => {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=5&appid=b473abf08211233160d13b09b0646297`
    );
    if (!res.ok) throw new Error("Something Went Wrong");
    const data = await res.json();
    const {
      country,
      name,
      local_names: { tr },
      lat,
      lon,
    } = data[0];
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=b473abf08211233160d13b09b0646297`
    );
    if (!res.ok) throw new Error("Something Went Wrong");
    const weatherData = await weatherRes.json();
    const {
      main: { temp },
      weather,
    } = weatherData;

    renderCard(country, name, tr, temp, weather);
  } catch (err) {
    err.name === "TypeError" ? alert("Invalid Entry") : console.log(err);
    city.value = "";
    city.focus();
  }
};
const renderCard = (country, name, local_names, temp, weather) => {
  const city = {
    country: country,
    name: name,
    locale: local_names,
    temp: temp,
    weatherData: weather,
  };
  if (
    dataArr.every(
      (temp) => temp.locale !== city.locale || temp.name !== city.name
    )
  ) {
    dataArr.push(city);
  } else {
    dataArr.length ? alert("You've already have this city.") : null;
  }

  content.innerHTML = "";
  dataArr.forEach((data) => {
    const card = document.createElement("div");
    card.className =
      "card shadow d-flex flex-column align-items-center me-3 mb-3";
    card.style.width = "14rem";
    card.innerHTML = `
  <div class="card-body">
    <p class="card-text lead city-name">${
      data.locale ? data.locale : data.name
    }  <sup><span class="badge bg-warning rounded-pill">${
      data.country
    }</span></sup></p>
    <p class="card-text display-3"><strong class="fw-bold">${Math.trunc(
      data.temp
    )}</strong><small><sup>°C</sup></small></p>
    <img src="http://openweathermap.org/img/wn/${
      data.weatherData[0].icon
    }@2x.png" class="card-img-top img-fluid d-block mx-auto"  alt="...">
    <p class="card-text text-uppercase lead text-center">${
      data.weatherData[0].description
    }</p>
  </div>`;

    content.append(card);
  });
};

const renderResult = (data) => {
  const cities = data.map((city) => {
    const { name, lat, lon, country, state } = city;
    return {
      name: name,
      country: country,
      state: state,
      lat: lat,
      lon: lon,
    };
  });
  console.log(cities);
  const table = document.createElement("table");
  table.classList.add("table");
  const title = document.createElement("thead");
  title.innerHTML = `
        <tr>
        <th scope="col">#</th>
        <th scope="col">City</th>
        <th scope="col">Country</th>
        <th scope="col">State</th>
      </tr>
      `;
  table.append(title);

  cities.forEach((city, i) => {
    const { name, country, state, lat, lon } = city;
    const row = document.createElement("tr");
    row.innerHTML = `
              <th scope="row">${++i}</th>
              <td>${name}</td>
              <td>${country}</td>
              <td>${state ? state : ""}</td>
        `;
    row.setAttribute("data-lat", lat);
    row.setAttribute("data-lon", lon);
    table.append(row);
  });

  document.querySelector(".container").append(table);
};
