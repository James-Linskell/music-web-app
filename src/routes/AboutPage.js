import React from 'react';
import '../styles/AboutPage.css';

class AboutPage extends React.Component {
    render() {
        return (
            <div className="About">
                <div>About</div>
                <div>Oops! Something went wrong. Go back to the home page to continue.</div>
                <a href="#" className="fa fa-twitter"></a>
            </div>
        )
    }
}

export default AboutPage;