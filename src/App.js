import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import citie, { cities } from "./cities";
import ReactSearchBox from "react-search-box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureLow, faFlag,  } from '@fortawesome/free-solid-svg-icons'

function App() {
  const citiesNames = [];
  cities.map((item) => citiesNames.push(item.name));

  const [city, setCity] = useState("");
  const [propositions, setpropositions] = useState([]);
  const [currentImage, setCurrentImage] = useState("Bejaia");
  const [weather, setWeather] = useState([])
  const [temperature, setTemperature] = useState([]) 
  const [wind, setWind] = useState([])
  const [dates, setDates] =useState([])

  const handleChange = (e) => {
    setCity(e.target.value);
    propositions.splice(0, propositions.length);
    if (e.target.value.length > 0) {
      citiesNames.map((item) => {
        if (item.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
          propositions.push(item);
        }
      });
      setpropositions(propositions);
    }
  };

  const handleItemClick = (e) => {
    setCurrentImage(e.target.id);
    setCity(e.target.id);
    setpropositions([]);
  };

  const getWeather = () => {
    let country = "";
    let lat = "";
    let lon = "";
    let id = "";

    cities.map((item) => {
      if (item.name === city) {
        country = item.country.toUpperCase();
        lat = item.coord.lat;
        lon = item.coord.lon;
        id = item.id;
      }
    });

    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/weather",
      params: {
        q: city + "," + country,
        lat: lat,
        lon: lon,
        id: id,
        lang: "null",
        units: '"metric" or "imperial"',
        mode: "xml, html",
      },
      headers: {
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
        "x-rapidapi-key": "9bdd57c107msh99d6c784a966987p1b4a0cjsn7b67358ce112",
      },
    };

    axios
      .request(options)
      .then((response) => {
         setWeather(response.data.weather)
         setTemperature([response.data.main])
         setWind([response.data.wind])
         setDates([response.data.sys])
         console.log(response.data)
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <h1>WEATHER APP</h1>

      <div className="main_container">
        <div className="image_container">
          <img src={`images/${currentImage}.jpg`} />
        </div>

        <div className="weather_container">
          <div className="search_section">
            <div className="search_type">
              <input
                className="form-control"
                type="text"
                placeholder="Search for city"
                value={city}
                onChange={handleChange}
              />

              <button
                onClick={getWeather}
                type="button"
                className="btn btn-dark"
              >
                {" "}
                Get weather{" "}
              </button>
            </div>
            <div className="propositions">
              <ul>
                {propositions.map((value, index) => {
                  console.log(value);
                  return (
                    <li key={value} id={value} onClick={handleItemClick}>
                      {" "}
                      {value}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="weather_result">
                <h2> {city.toUpperCase()} </h2> 
                <div className="weather">
                  <p className="main">{weather.length > 0 ?  weather[0].main: ''} {weather.length>0 ? <img id="weatherImg" src={`images/${weather[0].main}.png`} />: ''} </p>
                  <p className="description">{weather.length > 0 ?  weather[0].description: ''}</p>
                </div>

                <div className="temperature">
                        <p id="temp"> {temperature.length > 0 ? 'Temp '+ temperature[0].temp+'°': ''} { temperature.length > 0 ?<FontAwesomeIcon icon={faTemperatureLow}/> : ''}  </p>
                        <p id="temp_min">{temperature.length > 0 ? 'Temp min '+ temperature[0].temp_min+'°': ''}</p>
                        <p id="temp_max">{temperature.length > 0 ? 'Temp max '+ temperature[0].temp_max+'°': ''}</p>
                        <p id="feels like">{temperature.length > 0 ? 'Feels like '+ temperature[0].feels_like+'°': ''}</p>
                </div>

                <div className="wind"> 
                        <p id="speed">{wind.length > 0 ? 'Speed '+ wind[0].speed : ''} {wind.length>0 ? <FontAwesomeIcon icon={faFlag}/> : ''} </p>
                        <p id="deg">{wind.length > 0 ? 'Degre '+ wind[0].deg+'°': ''}</p>
                </div>

                <div className="dates">
                      <p id="sunrise">{dates.length > 0 ? <img className="riseSet" src="images/dawn.png" /> : ''}  {dates.length > 0 ? 'Sunrise '+ new Date(dates[0].sunrise).getHours()+':'+new Date(dates[0].sunrise).getMinutes(): ''}</p>
                      <p id="sunset"> {dates.length > 0 ? <img className="riseSet" src="images/sunset.png" /> : ''} {dates.length > 0 ? 'Sunset '+ new Date(dates[0].sunset).getHours()+':'+new Date(dates[0].sunset).getMinutes(): ''}</p>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
