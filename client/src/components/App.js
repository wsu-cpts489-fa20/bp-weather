import React from 'react';
import NavBar from './NavBar.js';
import SideMenu from './SideMenu.js';
import ModeBar from './ModeBar.js';
import CreateEditAccountDialog from './CreateEditAccountDialog.js'
import LoginPage from './LoginPage.js';
import AppMode from "./../AppMode.js"
import FeedPage from './FeedPage.js';
import Rounds from './Rounds.js';
import CoursesPage from './CoursesPage.js';
import AboutBox from './AboutBox.js';

const modeTitle = {};

modeTitle[AppMode.LOGIN] = "Welcome to Some Weather App";
modeTitle[AppMode.FEED] = "Search";
modeTitle[AppMode.ROUNDS] = "Favorites";
modeTitle[AppMode.ROUNDS_LOGROUND] = "New Favorite";
modeTitle[AppMode.ROUNDS_EDITROUND] = "Edit Favorites";
modeTitle[AppMode.COURSES] = "Weather History";


const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.FEED] = FeedPage;
modeToPage[AppMode.ROUNDS] = Rounds;
modeToPage[AppMode.ROUNDS_LOGROUND] = Rounds;
modeToPage[AppMode.ROUNDS_EDITROUND] = Rounds;
modeToPage[AppMode.COURSES] = CoursesPage;


class App extends React.Component {

  constructor() {
    super();
    this.state = {mode: AppMode.LOGIN,
                  menuOpen: false,
                  authenticated: false,
                  userObj: {displayName: "", profilePicURL: ""},
                  editAccount: false,
                  showEditAccountDialog: false,
                  statusMsg: "",
                  showAboutDialog: false,
                  Histories: []
                 };
  }

  //componentDidMount
  componentDidMount() {
    if (!this.state.authenticated) { 
      //Use /auth/test route to (re)-test authentication and obtain user data
      fetch("/auth/test")
        .then((response) => response.json())
        .then((obj) => {
          if (obj.isAuthenticated) {
           
            this.setState({
              userObj: obj.user,
              authenticated: true,
              mode: AppMode.FEED //We're authenticated so can get into the app.
            }, () => {
              this.createLocalStorageForGuest();
            });
          }
        }
      )
    } 
  }

  //refreshOnUpdate(newMode) -- Called by child components when user data changes in 
  //the database. The function calls the users/:userid (GET) route to update 
  //the userObj state var based on the latest database changes, and sets the 
  //mode state var is set to newMode. After this method is called, the
  //App will re-render itself, forcing the new data to 
  //propagate to the child components when they are re-rendered.
  refreshOnUpdate = async(newMode) => {
    let response = await fetch("/users/" + this.state.userObj.id);
    response = await response.json();
    const obj = JSON.parse(response);
    this.setState({
      userObj: obj,
      mode: newMode
    });
  }

  createLocalStorageForGuest = () => {
    
    var id = this.state.userObj.id
    if (id == "guest@mail.com") {
      localStorage.setItem("userId", id);

      //Check whether we have saved data on this SpeedScore user:
      let data = localStorage.getItem(id);
      if (data == null) { 
          localStorage.setItem(id, JSON.stringify({"weatherStations" : {}, "weatherStationCount": 0}));  
          this.setState({hasSavedStations: false});
          
      } 
      else {
          this.setState({hasSavedStations: true}, () => {
              console.log("Has data!!");
          });
      }
    }
    
  }


  handleChangeMode = (newMode) => {
    this.setState({mode: newMode});
  }

  openMenu = () => {
    this.setState({menuOpen : true});
  }
  
  closeMenu = () => {
    this.setState({menuOpen : false});
  }

  toggleMenuOpen = () => {
    this.setState(prevState => ({menuOpen: !prevState.menuOpen}));
  }

  setUserId = (Id) => {
    this.setState({userId: Id,
                   authenticated: true});
  }

  showEditAccount = () => {
    this.setState({showEditAccountDialog: true});

  }

  cancelEditAccount = () => {
    this.setState({showEditAccountDialog: false});
  }

  //editAccountDone -- called after successful edit or
  //deletion of user account. msg contains the status
  //message and deleted indicates whether an account was
  //edited (deleted == false) or deleted (deleted == true)
  editAccountDone = (msg, deleted) => {
    if (deleted) {
      this.setState({showEditAccountDialog: false,
                     statusMsg: msg,
                     mode: AppMode.LOGIN});
      } else {
        this.setState({showEditAccountDialog: false,
          statusMsg: msg});
      }
  }

  closeStatusMsg = () => {
    this.setState({statusMsg: ""});
  }

  setHistory = (history) =>{
    if (this.state.Histories.length === 0){
      this.setState({Histories: history});
    }
    else {
      history.countHistory = this.state.Histories.countHistory + 1;
      this.setState(prevState => ({ Histories: prevState.Histories.concat(history)}));
    }
    console.log("Root");
    console.log(this.state.Histories);
  }
  setDeleteId = (val) =>{
    delete this.state.Histories[val];
  }

  render() {
    const ModePage = modeToPage[this.state.mode];
    return (
      <div className="padded-page">
        {this.state.showAboutDialog ? 
          <AboutBox close={() => this.setState({showAboutDialog: false})}/> : null}
        {this.state.statusMsg != "" ? <div className="status-msg">
              <span>{this.state.statusMsg}</span>
              <button className="modal-close" onClick={this.closeStatusMsg}>
                  <span className="fa fa-times"></span></button></div> : null}
        {this.state.showEditAccountDialog ? 
            <CreateEditAccountDialog 
              create={false} 
              userId={this.state.userObj.id} 
              done={this.editAccountDone} 
              cancel={this.cancelEditAccount}/> : null}
        <NavBar 
          title={modeTitle[this.state.mode]} 
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          menuOpen={this.state.menuOpen}
          toggleMenuOpen={this.toggleMenuOpen}/>
          <SideMenu 
            menuOpen = {this.state.menuOpen}
            mode={this.state.mode}
            toggleMenuOpen={this.toggleMenuOpen}
            displayName={this.state.userObj.displayName}
            profilePicURL={this.state.userObj.profilePicURL}
            localAccount={this.state.userObj.authStrategy === "local"}
            userObj={this.state.userObj}
            editAccount={this.showEditAccount}
            logOut={() => {this.handleChangeMode(AppMode.LOGIN); localStorage.setItem("userId", null)}}
            showAbout={() => {this.setState({showAboutDialog: true})}}/>
          <ModeBar 
            mode={this.state.mode} 
            changeMode={this.handleChangeMode}
            menuOpen={this.state.menuOpen}/>
          <ModePage 
            menuOpen={this.state.menuOpen}
            mode={this.state.mode}
            Histories={this.state.Histories}
            changeMode={this.handleChangeMode}
            setDeleteId={this.setDeleteId}
            userObj={this.state.userObj}
            history={this.setHistory}
            refreshOnUpdate={this.refreshOnUpdate}/>
      </div>
    );  
  }
}

export default App;