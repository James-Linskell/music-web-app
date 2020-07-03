import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import '../styles/HomePage.css';
import {GiSoundWaves} from "react-icons/gi";

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class HomePage extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={GiSoundWaves} className="App-logo" alt="logo"/>
                    <div className="row">
                        <div className="column">
                            <h1>Explore your song</h1>
                            <p className="column">Discover detailed analytics for your music.
                                Go deeper and find out what Spotify's algorithms say about your songs!</p>
                        </div>
                        <div className="column">
                            <h1>Find the right playlist for your song</h1>
                            <p className="column">Hello!</p>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default HomePage;