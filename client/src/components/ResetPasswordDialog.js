import React from 'react'

class ResetPasswordDialog extends React.Component {
    constructor() {
        super();
        this.resetPasswordRef = React.createRef();
        this.resetPasswordRepeatRef = React.createRef();
        this.state = {errorMsg: ""};
    }

    //handleSubmit -- When the user submits the form, ensure that the passwords match.
    //If so, call on resetPassword in parent component to actually reset the password.
    //Otherwise, display an error message prompting the user to try again.
    handleSubmit= (event) => {
        event.preventDefault();
        if (this.resetPasswordRef.current.value === this.resetPasswordRepeatRef.current.value) {
            this.props.resetPassword(this.resetPasswordRef.current.value);
        } else {
            this.resetPasswordRepeatRef.current.focus();
            this.setState({errorMsg: "The passwords you entered do not match. Please try again."});
        }
    }

    checkForSubmit = (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div className="modal" role="dialog">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title"><b>Reset Password</b>
                    </h3>
                    <button className="modal-close" 
                        onClick={this.props.cancelResetPassword}>
                        &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    {this.state.errorMsg != "" ? <p className="emphasis">{this.state.errorMsg}</p> : null} 
                    <form onSubmit={this.handleSubmit}>
                    <label>
                        New Password: 
                        <input
                        type="password"
                        placeholder="Enter new password"
                pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                        className="form-control form-text"
                        ref={this.resetPasswordRef}
                        />
                    </label>
                    <label>
                        Repeat New Password: 
                        <input
                        type="password"
                        placeholder="Repeat new password"
                        className="form-control form-text"
                        onKeyUp={this.checkForSubmit}
                        ref={this.resetPasswordRepeatRef}
                        />
                    </label>
                    <button role="submit" 
                     className="btn btn-primary btn-color-theme form-submit-btn">
                        <span className="fa fa-key"></span>&nbsp;Reset Password
                    </button>
                    </form>
                </div>
              </div>
            </div>
          </div>
          );
        
    }
}

export default ResetPasswordDialog;