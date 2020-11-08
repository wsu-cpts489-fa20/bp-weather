import React from 'react';
import CreateEditAccountDialog from './CreateEditAccountDialog.js';
import ResetPasswordDialog from './ResetPasswordDialog.js';
import LookUpAccountDialog from './LookUpAccountDialog.js';
import SecurityQuestionDialog from './SecurityQuestionDialog.js';

class LoginPage extends React.Component {

constructor() {
    super();
    //Create a ref for the email input DOM element
    this.emailInputRef = React.createRef();
    this.resetUserId = "";
    this.resetQ = "";
    this.resetA = "";
    this.passwordInputRef = React.createRef();
    this.state = {statusMsg: "",
                  loginBtnIcon: "fa fa-sign-in",
                  loginBtnLabel: "Log In",
                  showLookUpAccountDialog: false,
                  showSecurityQuestionDialog: false,
                  showResetPaswordDialog: false,
                  githubIcon: "fa fa-github",
                  githubLabel: "Sign in with GitHub",
                  loginMsg: "",
                  newAccountCreated: false
                  };
} 
    
//Focus cursor in email input field when mounted
componentDidMount() {
    this.emailInputRef.current.focus();
}  

//handleLoginSubmit -- Called when user clicks on login button.
handleLoginSubmit = async (event) => {
    event.preventDefault();
    this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
                   loginBtnLabel: "Logging In..."});
    const url = "auth/login?username=" + this.emailInputRef.current.value +
                "&password=" + this.passwordInputRef.current.value;
    const res = await fetch(url, {method: 'POST'}); 
    if (res.status == 200) { //successful login!
        window.open("/","_self");
    } else { //Unsuccessful login
      const resText = await res.text();
      this.setState({loginBtnIcon: "fa fa-sign-in",
                     loginBtnLabel: "Log In",
                     statusMsg: resText});
    }
}

  //accountCreateDone -- Called by child CreateAccountDialog component when 
  //user attempted to create new account. Hide the dialog and display 
  //a message indicating result of the attempt.
  accountCreateDone = (msg) => {
      this.setState({statusMsg: msg,
                     showCreateAccountDialog: false});
  }

  //cancelCreateAccount -- Called by child CreateAccountDialog componenet when user decides
  //to cancel creation of new account by clicking the "X" in top-right of dialog.
  cancelCreateAccount = () => {
      this.setState({showCreateAccountDialog: false});
  }

//cancelResetPassword -- Called by one of the child three child dialog box components when
//the user decides to cancel resetting their password. Toggles state so that all three
//of the dialog boxes are hidden
cancelResetPassword = () => {
    this.resetUserId = "";
    this.resetQ = "";
    this.resetA = "";
    this.setState({showLookUpAccountDialog: false,
                   showSecurityQuestionDialog: false,
                   showResetPaswordDialog: false});             
}

//handleOAuthLogin -- Callback function that initiates contact with OAuth
//provider
handleOAuthLogin = (provider) => {
    window.open(`/auth/${provider}`,"_self");
}

//handleOAuthLoginClick -- Called whent the user clicks on button to
//authenticate via a third-party OAuth service. The name of the provider is
//passed in as a parameter.
handleOAuthLoginClick = (provider) => {
   this.setState({[provider + "Icon"] : "fa fa-spin fa-spinner",
                  [provider + "Label"] : "Connecting..."});
   setTimeout(() => this.handleOAuthLogin(provider),1000);
}

//getSecurityAnswer: Given the id, security question, and security answer obtained
//from the LookUpAccountDialog component, update state such that the user will
//next be prompted to enter security question and answer for verification
getSecurityAnswer = (userId, question, answer) => {
    this.resetUserId = userId;
    this.resetQ = question;
    this.resetA = answer;
    this.setState({showLookUpAccountDialog: false,
                   showSecurityQuestionDialog: true
                });
}

//getNewPassword-- Called after user successfully provides correct answer
//to security question. Presents the "Reset Password" dialog box.
getNewPassword = () => {
    this.setState({showSecurityQuestionDialog: false,
                    showResetPaswordDialog: true});
}

//resetPassword--Called after the user successfully enters a new (acceptable)
//password. pw contains the new password. Call on the Update (PUT) server
//route to update the user's password in the database.
resetPassword = async(pw) => {
    const url = "/users/" + this.resetUserId;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'PUT',
        body: JSON.stringify({password: pw})}); 
    if (res.status == 200) { //successful update creation!
        this.setState({showResetPaswordDialog: false,
                       statusMsg: "Password successfully reset!"});
    } else { //Unsuccessful account creation
        //Grab textual error message
        const resText = await res.text();
        this.setState({showResetPasswordDialog: false,
                      statusMsg: resText});
    }
    
}

//newAccountCreated -- Called after successful creation of a new account
accountCreateDone = (msg,deleted) => {
    this.setState({statusMsg: msg,
                   showCreateAccountDialog: false});
}

//closeStatusMsg -- Called when user clicks on "x" to dismiss status message
closeStatusMsg = () => {
    this.setState({statusMsg: ""});
}

//cancelCreateAccount -- called to hide Create Account dialog without creating acct
cancelCreateAccount = () => {
    this.setState({showCreateAccountDialog: false});
}

  render() {
    return(
        <div>
        <center>
        {this.state.statusMsg != "" ? <div className="status-msg"><span>{this.state.statusMsg}</span>
                       <button className="modal-close" onClick={this.closeStatusMsg}>
                          <span className="fa fa-times"></span>
                        </button></div>: null}
            {this.state.showLookUpAccountDialog ? 
              <LookUpAccountDialog cancelResetPassword={this.cancelResetPassword}
                                   getSecurityAnswer={this.getSecurityAnswer}/> : null}
            {this.state.showSecurityQuestionDialog ? 
               <SecurityQuestionDialog cancelResetPassword={this.cancelResetPassword}
                                       question={this.resetQ}
                                       answer={this.resetA}
                                       getNewPassword={this.getNewPassword}/> : null}
            {this.state.showResetPaswordDialog ? 
              <ResetPasswordDialog cancelResetPassword={this.cancelResetPassword}
                                   resetPassword={this.resetPassword} /> : null}
            <form id="loginInterface" onSubmit={this.handleLoginSubmit}>
            <label htmlFor="emailInput" style={{ padding: 0, fontSize: 24 }}>
                Email:
                <input
                ref={this.emailInputRef}
                className="form-control login-text"
                type="email"
                placeholder="Enter Email Address"
                id="emailInput"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                required={true}
                />
            </label>
            <p />
            <label htmlFor="passwordInput" style={{ padding: 0, fontSize: 24 }}>
                Password:
                <input
                ref={this.passwordInputRef}
                className="form-control login-text"
                type="password"
                placeholder="Enter Password"
                pattern="[A-Za-z0-9!@#$%^&*()_+\-]+"
                required={true}
                />
            </label>
            <p className="bg-danger" id="feedback" style={{ fontSize: 16 }} />
            <button
                type="submit"
                className="btn-color-theme btn btn-primary btn-block login-btn">
                <span id="login-btn-icon" className={this.state.loginBtnIcon}/>
                &nbsp;{this.state.loginBtnLabel}
            </button>
            <p>
            <button type="button" className="btn btn-link login-link" 
                    onClick={() => {this.setState({showCreateAccountDialog: true});}}>
                Create an account</button> | 
                <button type="button" className="btn btn-link login-link"
                        onClick={() => {this.setState({showLookUpAccountDialog: true});}}>
                Reset your password</button>
            </p>  
            <button type="button" className="btn btn-github"
               onClick={() => this.handleOAuthLoginClick("github")}>
              <span className={this.state.githubIcon}></span>&nbsp;
                {this.state.githubLabel}
            </button>
            <p>
                <i>Version CptS 489</i>
            </p>
            </form>
            {this.state.showCreateAccountDialog ? 
              <CreateEditAccountDialog
                create={true} 
                done={this.accountCreateDone}
                cancel={this.cancelCreateAccount} /> : null}
            {this.state.showResetPasswordDialog ? <ResetPasswordDialog /> : null}
        </center>
        </div>
        )
    }
} 

export default LoginPage;
