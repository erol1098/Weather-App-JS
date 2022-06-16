const input = document.querySelector(".entry");
const searchBtn = document.getElementById("btn");
const content = document.querySelector(".content");
const clear = document.querySelector(".clear");
const form = document.querySelector("form");
const turkish = document.querySelector(".turkish");
const english = document.querySelector(".english");
const dataArr = [];
let language = "tr";
let localLanguage = "tr";
let unit = "metric";
turkish.onclick = () => {
  language = "tr";
  localLanguage = "tr";
  unit = "metric";
  document.querySelector(".language-label").textContent = "Türkçe";
  content.innerHTML = "";
  dataArr.splice(0, dataArr.length);
};
english.onclick = () => {
  language = "en";
  localLanguage = "en";
  unit = "imperial";
  document.querySelector(".language-label").textContent = "English";
  content.innerHTML = "";
  dataArr.splice(0, dataArr.length);
};

localStorage.setItem(
  "apiKey",
  EncryptStringAES("b473abf08211233160d13b09b0646297")
);

form.onsubmit = (e) => {
  e.preventDefault();
  getWeather();
  form.reset();
};
clear.onclick = (e) => {
  content.innerHTML = "";
  dataArr.splice(0, dataArr.length);
};
const getWeather = async () => {
  try {
    const key = DecryptStringAES(localStorage.getItem("apiKey"));

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=5&appid=${key}`
    );
    if (!res.ok) throw new Error("Something Went Wrong");
    const data = await res.json();
    const { country, name, local_names, lat, lon } = data[0];
    let localeName;
    console.log(local_names);

    Object.entries(local_names).some((entry) => entry[0] === localLanguage)
      ? Object.entries(local_names).forEach((entry) => {
          if (entry[0] === localLanguage) {
            console.log(entry);
            localeName = entry[1];
            console.log(localeName);
          }
        })
      : (localeName = name);

    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}&lang=${language}`
    );
    const {
      main: { temp },
      weather,
    } = weatherData.data;

    renderCard(country, name, localeName, temp, weather);
  } catch (err) {
    const toastLiveExample = document.getElementById("liveToast");
    const toast = new bootstrap.Toast(toastLiveExample);
    if (err.name === "TypeError" || input.value.trim() === "") {
      document.querySelector(".toast-body").textContent = "Invalid Entry!";
      toast.show();
    } else console.warn(err);
    input.value = "";
    input.focus();
  }
};
const renderCard = (country, name, localeName, temp, weather) => {
  const city = {
    country: country,
    name: name,
    locale: localeName,
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
    if (dataArr.length) {
      const toastLiveExample = document.getElementById("liveToast");
      const toast = new bootstrap.Toast(toastLiveExample);
      document.querySelector(".toast-body").textContent =
        "You've already have this city.";
      toast.show();
    }
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
      data.locale
    }  <sup><span class="badge bg-warning rounded-pill">${
      data.country
    }</span></sup></p>
    <p class="card-text display-3"><strong class="fw-bold">${Math.round(
      data.temp
    )}</strong><small><sup>°${unit == "imperial" ? "F" : "C"}</sup></small></p>
    <figure>
    <img src="http://openweathermap.org/img/wn/${
      data.weatherData[0].icon
    }@2x.png" class="card-img-top img-fluid d-block mx-auto"  alt="weather icon">
    <figcaption class="card-text text-uppercase lead text-center">${
      data.weatherData[0].description
    }</figcaption>
    </figure>
  </div>`;
    content.prepend(card);
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

// const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

// const alert = (message, type) => {
//   const wrapper = document.createElement("div");
//   wrapper.innerHTML = [
//     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
//     `   <div>${message}</div>`,
//     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//     "</div>",
//   ].join("");

//   alertPlaceholder.append(wrapper);
// };
