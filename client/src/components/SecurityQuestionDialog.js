import React from 'react';

class SecurityQuestionDialog extends React.Component {
    constructor() {
        super();
        this.securityAnswerRef = React.createRef();
        this.state = {errorMsg: ""};
    }

    //Focus cursor in email secrity answer field when mounted
    componentDidMount() {
        this.securityAnswerRef.current.focus();
    }  

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.securityAnswerRef.current.value === this.props.answer) {
            this.props.getNewPassword();
        } else {
            this.securityAnswerRef.current.focus();
            this.setState({errorMsg: "Sorry, that is not the correct answer to the security question. Try again."});
        }
    }

    render() {
        return (
            <div className="modal" role="dialog">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title"><b>Answer Security Question</b>
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
                        Security Question: 
                        <textarea
                        readOnly={true}
                        value={this.props.question}
                        className="form-control form-text"
                        rows="3"
                        cols="35"
                        />
                    </label>
                    <label>
                        Security Answer: 
                        <textarea
                        className="form-control form-text"
                        placeholder="Enter Security Question Answer"
                        ref={this.securityAnswerRef}
                        rows="3"
                        cols="35"
                        />
                    </label>
                    <button role="submit" 
                      className="btn btn-primary btn-color-theme form-submit-btn">
                        <span className="fa fa-check"></span>&nbsp;Verify Answer
                    </button>
                    </form>
                </div>
              </div>
            </div>
          </div>
          );        
    }
}
 export default SecurityQuestionDialog;