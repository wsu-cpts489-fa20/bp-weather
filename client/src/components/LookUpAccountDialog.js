import React from 'react';
import AppMode from '../AppMode.js';

class LookUpAccountDialog extends React.Component {

    constructor() {
        super();
        this.emailRef = React.createRef();
        this.state = {errorMsg: ""};
    }

    //handleLookUpAccount: When the user clicks on the "Look Up Account" dialog box
    //button, we check whether the account exists. If it does, we update the state,
    //setting the resetEmail var to the email entered, hiding the current dialog box
    //and showing the security question dialog box.
    handleLookUpAccount = async(event) => {
        event.preventDefault();
        let response = await fetch("/users/" + this.emailRef.current.value);
        if (response.status == 200) {
            const json = await response.json();
            const obj = JSON.parse(json);
            if (obj.authStrategy === "local") {
                this.props.getSecurityAnswer(obj.id,obj.securityQuestion, obj.securityAnswer);
            } else { //Account exists but was created through OAuth so password can't be reset 
                this.setState({ErrMsg: "That account is authenticated through " + obj.authStrategy + ". " +
                               "Please log in to " + obj.authStrategy + " to reset the password."});
            }
        } else {
            this.setState({errorMsg: "Sorry, there is no account associated with '" + this.emailRef.current.value + "'."});
        }
    }

    render() {
        return (
            <div className="modal" role="dialog">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title"><b>Look Up Account</b></h3>
                    <button className="modal-close" 
                        onClick={() => {this.props.cancelResetPassword()}}>
                        &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    {this.state.errMsg != "" ? <p className="emphasis">{this.state.errorMsg}</p> : null}
                    <form onSubmit={this.handleLookUpAccount}>
                    <label>
                        Account Email Address: 
                        <input
                        ref={this.emailRef}
                        className="form-control form-text"
                        type="email"
                        size="35"
                        placeholder="Enter Email Address"
                        pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                        ref={this.emailRef}
                        required={true}
                        />
                    </label>
                    <button type="submit" 
                        className="btn btn-primary btn-color-theme form-submit-btn">
                        <span className="fa fa-search"></span>&nbsp;Look Up Account
                    </button>
                    </form>
                </div>
              </div>
            </div>
          </div>  
        );   
    }

}

export default LookUpAccountDialog;
