//this component holds the weather station api data
//parent: WeatherFeed
//child: none
import React from 'react';

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
            this.state.longitude + '&appid=ec73e0c69ee570aa0120006017f7af90');
            const currWeather = await response.json();
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
                         units: "Metric"
                         });


                         
        
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

    render() {
        return (
            <div align="center" className="jumbotron"> 

           
            {/* shift up icon */}
            <span className="shift-icon fa fa-arrow-up" onClick={() => this.props.moveStation(this.props.stationId, "up")}></span>

            

            {/* Delete icon */}
            <span className="delete-icon fa fa-times" onClick={() => this.props.removeStation(this.props.stationId)}></span>
            <h2>Weather Conditions at {this.state.place} </h2>


            <h6><i>Last updated: {this.state.retrieved}</i>
            {/* Refresh icon */}
            &nbsp; <span className="refresh-icon fa fa-retweet"
            onClick={() => this.getCurrentObservations()}></span> 
            </h6>

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

             {/* shift down icon */}
             <span className="shift-icon fa fa-arrow-down" onClick={() => this.props.moveStation(this.props.stationId, "down")}></span>
         </div>
        );
    }
}

export default WeatherStation;