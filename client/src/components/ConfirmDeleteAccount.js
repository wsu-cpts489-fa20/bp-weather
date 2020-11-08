import React from 'react';

class ConfirmDeleteAccount extends React.Component {
    constructor() {
        super();
        this.emailRef = React.createRef();
        this.state = {emailMatches: false};
    }
    
    componentDidMount() {
        this.emailRef.current.focus();
    }

    handleChange = () => {
        const match = (this.emailRef.current.value === this.props.email);
        if (match != this.state.emailMatches) {
            this.setState({emailMatches: match});
        }
    }

    render() {
        return (
        <div id="aboutModal" className="modal" role="dialog">
        <div className="modal-content">
            <div className="modal-header">
              <center>
                <h3 className="modal-title"><b>Confirm Account Deletion</b></h3>
              </center>
               <button id="modalClose" className="modal-close" onClick={this.props.close}>
                 &times;</button>
            </div>
            <div className="modal-body">
              <p>Do you really want to delete your account? <br />
                 <i>This action cannot be undone.</i></p>
              <label>
                Confirm Email ({this.props.email}):
                <br/>
                <input 
                    className="form-center"
                    type="text"
                    ref={this.emailRef}
                    onChange={this.handleChange} />
                </label>
                <br />
            </div>
            <div className="modal-footer">
                  <button className="btn btn-danger" onClick={this.props.deleteAccount} disabled={!this.state.emailMatches}>
                  Yes, Delete My Account</button>
                  <button className="btn btn-secondary" onClick={this.props.close}>
                  No, Cancel</button>
            </div>
        </div>
        </div>
        );
    }
}

export default ConfirmDeleteAccount;