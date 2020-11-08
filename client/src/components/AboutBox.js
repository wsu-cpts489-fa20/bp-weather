import React from 'react';

class AboutBox extends React.Component {

render() {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h3>About SpeedScore</h3>
                <button className="modal-close" onClick={this.props.close}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <img
                src="https://dl.dropboxusercontent.com/s/awuwr1vpuw1lkyl/SpeedScore4SplashLogo.png"
                height="200" width="200"/>
                <h3>The World's First and Only Suite of Apps for
                Speedgolf</h3>
                <p>Version CptS 489 Fa20 Complete (MERN)<br/>
                &copy; 2017-20 The Professor of Speedgolf. All rights
                reserved.
                </p>
                <div style={{textAlign: "left"}}>
                <p>SpeedScore apps support</p>
                <ul>
                <li>live touranment scoring (<i>SpeedScore Live&reg;</i>)</li>
                <li>tracking personal speedgolf rounds and sharing results
                (<i>SpeedScore Track&reg;</i>)</li>
                <li>finding speedgolf-friendly courses, booking tee times, and
                paying to play speedgolf by the minute (<i>SpeedScore
                Play&reg;</i>)</li>
                </ul>
                <p>SpeedScore was first developed by Dr. Chris Hundhausen,
                associate professor of computer science at Washington State
                University and the <i>Professor of Speedgolf</i>, with support
                from Scott Dawley, CEO of Speedgolf USA, LLC.</p>
                <p>For more information on SpeedScore, visit <a
                href="http://speedscore.live" target="_blank">SpeedScore's web
                site</a>. For more information on speedgolf, visit <a
                href="http://playspeedgolf.com"
                target="_blank">playspeedgolf.com</a> and <a
                href="http://usaspeedgolf.com" target="_blank">Speedgolf
                USA</a>.</p>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary btn-color-theme"
                onClick={this.props.close}>OK</button>
                </div>
            </div>
        </div>
        </div>
    );
    }
}

export default AboutBox;