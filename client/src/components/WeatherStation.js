//this component holds the weather station api data
//parent: WeatherFeed
//child: none
import React from 'react';
import AppMode from '../AppMode';
import App from './App';
require('dotenv').config();

class WeatherStation extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {latitude: this.props.latitude,
                      longitude: this.props.longitude,
                      
                     };
        
        
      }


    componentDidMount = () => {
      
            this.getCurrentObservations();
       
    }

    getCurrentObservations = async() => {

            console.log("lat now fetching: " + this.state.latitude + " long now fetching: " + this.state.longitude);
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + 
            this.state.latitude + '&lon=' +
            this.state.longitude + '&appid=' + process.env.REACT_APP_API_KEY);
            const currWeather = await response.json();

            var iconCode = this.getIcon(currWeather.weather[0].id, true);
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@4x.png";

            console.log("icon code: " + iconCode);
            console.log("icon url: " + iconUrl);


            this.setState({place: currWeather.name,
    
                         retrieved: (new Date()).toLocaleDateString() + " at " + (new Date()).toLocaleTimeString(),
                         conditions: currWeather.weather[0].main,
                         visibility: currWeather.weather.visibility,
                         visibilityUnit: "Meters",
                         temp: Math.round(currWeather.main.temp - 273.15),
                         tempUnit: "C",
                         humidity: currWeather.main.humidity,
                         visibility: currWeather.visibility,
                         wind: currWeather.wind.speed,
                         windUnit: "Meters/sec",
                         windDirection: currWeather.wind.deg,
                         windDirectionUnit: "Degrees",
                         units: "Metric",
                         weatherIcon: iconUrl
                         });


                         
        
    }


    favoriteStation = (stationId) => {
        // var userId = localStorage.getItem("userId");
        // console.log(userId);
        // var data = JSON.parse(localStorage.getItem(userId));
        // console.log(data);
        let today = new Date(Date.now()-(new Date()).getTimezoneOffset()*60000);
        var newStation = {}; // empty object
        console.log(today.toUTCString());
        newStation.id = today.toUTCString(); 
        newStation.latitude = this.state.latitude.toString();
        newStation.longitude = this.state.longitude.toString();
        // console.log("data.weatherStations.length = " + data.weatherStations.length);
        // data.weatherStations[data.weatherStationCount + 1] = newStation;
        // data.weatherStationCount++;

        // localStorage.setItem(userId, JSON.stringify(data));
        setTimeout(this.props.addWeatherStation,100,newStation); 

    }
    
    toggleUnits = () => {
      if (this.state.units == "Imperial") {
          this.setState({
              units: "Metric",
              tempUnit: "C", 
              temp: Math.round((this.state.temp - 32) * 5/9),
              visibility: Math.round(this.state.visibility / 3.28084),
              visibilityUnit: "Meters",
              wind: parseFloat(this.state.wind / 3.28084).toFixed(2),
              windUnit: "Meters/sec"  });
      } else {
          this.setState({
              units: "Imperial",
              tempUnit: "F",
              temp: Math.round((this.state.temp * 9/5) + 32),
              visibility: Math.round(this.state.visibility * 3.28084),
              visibilityUnit: "Feet",
              wind: parseFloat(this.state.wind * 3.28084).toFixed(2),
              windUnit: "Feet/sec" });
      }
    }

    getIcon = (code, daytime) => {

        var iconCode = "";

        if (code >= 200 && code < 300) {
            iconCode = "11d"
            
        }
        else if (code >= 300 && code < 400) {
            iconCode = "09d";
        }
        else if (code >= 500 && code < 600) {

            if (code >= 500 && code <= 504) {
                iconCode = "10d";
            }
            else if (code == 511) {
                iconCode = "13d";
            }
            else {
                iconCode = "09d";
            }
        }
        else if (code >= 600 && code < 700) {
            iconCode = "13d";
        }
        else if (code >= 700 && code < 800) {
            iconCode = "50d";
        }
        else if (code >= 800 && code < 900) {
            if (code == 800) {
                if (daytime == true) {
                    iconCode = "01d"
                }
                else {
                    iconCode = "01n"
                }
            }
            else if (code == 800) {
                iconCode = "01n";
            }
            else if (code >= 801 && code <= 804) {
                if (code == 801) {

                    if (daytime == true) {
                        iconCode = "02d";
                    }
                    else {
                        iconCode = "02n";
                    }
                }
                else if (code == 802){
                    if (daytime == true) {
                        iconCode = "03d";
                    }
                    else {
                        iconCode = "03nd";
                    }
                }
                else if (code == 803){
                    if (daytime == true) {
                        iconCode = "04d";
                    }
                    else {
                        iconCode = "04d";
                    }
                }
                else if (code == 804) {
                    if (daytime == true) {
                        iconCode = "04d";
                    }
                    else {
                        iconCode = "04d";
                    }
                }
            }
        }

        return iconCode;
    }
    render() {
        return (
            <div align="center" className="jumbotron"> 

           
            {/* shift up icon */}
            <span className="shift-icon fa fa-arrow-up" onClick={() => this.props.moveStation(this.props.stationId, "up")}></span>

            {/* Favorite icon */}
            {this.props.mode != AppMode.COURSES ? 
            <span className={this.state.favorited ? "favorite-icon fas fa-star" : "favorite-icon fa fa-star"} onClick={() => {console.log("before favoriteStation"); this.favoriteStation(this.props.stationId)}}></span>
            : null }
            {/* Delete icon */}
            {this.props.mode != AppMode.FEED ?
            <span className="delete-icon fa fa-times" onClick={() => this.props.removeStation(this.props.stationId)}></span>
            : null }
            <div class="weatherStation">
                
                <h2>Weather Conditions at {this.state.place} </h2>


                <h6><i>Last updated: {this.state.retrieved}</i>
                {/* Refresh icon */}
                &nbsp; <span className="refresh-icon fa fa-retweet"
                onClick={() => this.getCurrentObservations()}></span> 
                </h6>

                <img src= {this.state.weatherIcon} alt="weatherIcon"/>
                <h5>Conditions: {this.state.conditions}</h5>
                <h5>Visibility: {this.state.visibility + " " + this.state.visibilityUnit}</h5>
                <h5>Temp: {this.state.temp}&deg;&nbsp;{this.state.tempUnit}</h5>
                <h5>Humidity: {this.state.humidity}%</h5>
                <h5>Wind Speed: {this.state.wind + " " + this.state.windUnit}</h5>
                <h5>Wind Direction: {this.state.windDirection + " " + this.state.windDirectionUnit}</h5>
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id={"switch-" + this.props.stationId} 
                        onClick={this.toggleUnits} />
                    <label className="custom-control-label" htmlFor={"switch-" + this.props.stationId}>&nbsp;{this.state.units}</label>
                </div>
            </div>


            {/* image */}
            
            

             {/* shift down icon */}
             <span className="shift-icon fa fa-arrow-down" onClick={() => this.props.moveStation(this.props.stationId, "down")}></span>
         </div>
        );
    }
}

export default WeatherStation;