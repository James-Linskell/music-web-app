import React from 'react';
import { Router, Link } from "react-router-dom";
import hellify from "../hellify.png";
import '../styles/HomePage.css';

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class HomePage extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div style={{display: "flex", justifyContent: "center", margin: "4vh"}}>
                        <img src={hellify} className="Logo" alt="logo"/>
                    </div>
                    <div className="Container-home">
                        <div>
                            <h1>Explore your song</h1>
                            <p>
                                Discover detailed analytics for your music.
                                Go deeper and find out what Spotify's algorithms say about your songs!
                            </p>
                        </div>
                        <div>
                            <h1>Find the right playlist for your song</h1>
                            <p>
                                Choose a song and see how well it fits in a given playlist.
                            </p>
                        </div>
                        <div>
                            <Link to="/song" >
                                <button>Analyse a song</button>
                            </Link>

                        </div>
                        <div>
                            <Link to="/playlist">
                                <button>Choose a playlist</button>
                            </Link>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default HomePage;