import React from 'react';
import WeatherStation from './WeatherStation.js';

class FeedPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {stations: [],
                      stationCount: 0,
                    initialFire: true
                        };
        this.removeStation = this.removeStation.bind(this);
        this.moveStation = this.moveStation.bind(this);
        
      }

    componentDidMount = () => {
        //Initialize based on user's current location, if possible
        if (this.state.initialFire && !this.props.savedStation) {
            this.loadStations();
         }
         else {
            navigator.geolocation.getCurrentPosition(this.getLocSuccess,this.getLocError);
         } 
    }
    
     //Called when user agrees to give loc data. We set the first weather
     //station to show conditions at the user's current position.
    getLocSuccess = (position) =>  {
            this.setState({stations: [{lat: 47.6062, 
                lon: -122.3321, 
                stationId: this.state.stationCount+1}],
            stationCount: this.state.stationCount + 1});
            
    }
  
    //Called when user refuses to give access to loc data
    //Initializes first weather station to Seattle in this case
    getLocError = (err) => {
        this.setState({stations: [{lat: 47.6062, 
                                   lon: -122.3321, 
                                   stationId: this.state.stationCount+1}],
                       stationCount: this.state.stationCount + 1});
                       
   }

   //addStation -- When user clicks on "+" button to add a new weather station,
    //prompt the user for the location and attempt to add the requested station.
    addStation = async() => {
        
        const newStation = prompt("Enter a City, State, and Country:");
        if (newStation != null) { //Need to see if we can find the station through the API 
          const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + 
              newStation +  '&appid=' + process.env.REACT_APP_API_KEY);
          const stationData = await response.json();
          //See if the requested station exists
          if (stationData != null && stationData.hasOwnProperty('coord')) { 
              //Push new station into stations list
            let newStations = [...this.state.stations];
            newStations.push({lat: stationData.coord.lat, 
                                lon: stationData.coord.lon, 
                                stationId: this.state.stationCount + 1});

            
            this.setState({stations: newStations,
                           stationCount: this.state.stationCount + 1}, () => {
                                this.writeStations(this.state.stationCount, stationData.coord.lat, stationData.coord.lon);
                             });
                
          } else { 
              alert("Sorry, that weather location could not be found.");
          }
        }
    }

    //save the stations to localstorage
    writeStations(ids, lats, longs) {
        let data = JSON.parse(localStorage.getItem("guest@mail.com"));
        
        //Initialize empty JavaScript object to store new or updated station
        let thisStation = {}; //iniitalize empty object for this station

        
        for (let i = 0; i < ids.length; i++) {
            //Store the data
            thisStation.id = i + 1;
            thisStation.latitude = lats[i];
            thisStation.longitude = longs[i];

            data.weatherStations[i + 1] = thisStation;
            data.weatherStationCount = ids.length;
            localStorage.setItem("guest@mail.com", JSON.stringify(data));
            thisStation = {};
        }  
    }

    //remove stations from array of weatherstations
    removeStation(stationId) {

        let newStations = [...this.state.stations];
        
        for (let i = 0; i < newStations.length; i++) {

            if (newStations[i].stationId == stationId) {
                newStations.splice(i, 1);
            }
        }
        
        //update state
        this.setState({stations: newStations,
            stationCount: this.state.stationCount - 1}, () => {
                
            });
    }

    //move the station up or down based on direction/buton clicked
    moveStation(stationId, direction) {

        let newStations = [...this.state.stations];

        if (direction == "up") {
            
            if (stationId != newStations[0].stationId) {

                for (let i = 0; i < newStations.length; i++) {
                    if (newStations[i].stationId == stationId) {

                        var x = i;
                        var y = i - 1;
                        //swap
                        [ newStations[x], newStations[y] ] = [ newStations[y], newStations[x] ];
                    }
                }

                 //update array
                this.setState({stations: newStations}, () => {
                    
                });
            }
        }
        else {
            if (stationId != newStations[newStations.length - 1].stationId) {
                for (let i = 0; i < newStations.length; i++) {
                    if (newStations[i].stationId == stationId) {
                        var x = i;
                        var y = i + 1;

                        //swap
                        [ newStations[x], newStations[y] ] = [ newStations[y], newStations[x] ];
                        break;
                        
                    }
                }

                //update array
                this.setState({stations: newStations}, () => {

                });
            }
        }

        
    }

    //load stations from localstorage into array of weather stations
    loadStations() {
        let data = JSON.parse(localStorage.getItem("guest@mail.com"));

        //check if null if first time logging in
        if (data != null) {
            let rows = [];

        
            for (let i = 0; i < data.weatherStationCount; i++) {
                var keyid = i + 1;
                rows.push({
                    lat: Number.parseFloat(data.weatherStations[keyid].latitude),
                    lon: Number.parseFloat(data.weatherStations[keyid].longitude),
                    stationId: keyid,
                });
            }
            console.log(rows);
            
            //set the new array to state
            this.setState({stations: rows,
                            stationCount: rows.length,
                            initialFire: false}, () => {
                                
                            });
        }
        

        
    }
  
    render() {

        let rows = [];
        let ids = [];
        let lats = [];
        let longs = [];

        for (let i = 0; i < this.state.stations.length; i++) {
            ids.push(this.state.stations[i].stationId);
            lats.push(this.state.stations[i].lat);
            longs.push(this.state.stations[i].lon);

            rows.push(<WeatherStation key={this.state.stations[i].stationId} 
                    latitude={this.state.stations[i].lat} 
                    longitude={this.state.stations[i].lon}
                    stationId={this.state.stations[i].stationId}
                    moveStation={this.moveStation}
                    removeStation={this.removeStation} />);
        }
        
       

        
        if (this.state.stations.length >= 1) {

            let thisUser = localStorage.getItem("guest@mail.com");
            let data = JSON.parse(localStorage.getItem(thisUser));

            //set to null and resave to make things easier
            data = null;
            this.writeStations(ids, lats, longs);
        }

       //if theres no stations, we want to fire componentDidMount
       if (this.state.stationCount == 0) {
            this.componentDidMount();
       }

        return (
            <div id="main">
                <div id="weatherStations">
                    {rows}
                </div>
                <div className="floatButton" id="floatBtnDiv">
                    <a className="float" id="addStationBtn" onClick={this.addStation}>
                        <span className="float-btn-icon fa fa-plus" id="floatBtnIcon"></span>
                    </a>
                </div>  
            </div>
            
        );
    }
}
export default FeedPage;