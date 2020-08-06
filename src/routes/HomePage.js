import React from 'react';
import { Router, Link } from "react-router-dom";
import hellify from "../hellify.png";
import '../styles/HomePage.css';
import BackgroundSvgPaths from "../components/BackgroundSvgPaths";

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
                        <div className="Container-box">
                            <div>
                                <h1>Song Analyser</h1>
                                <h3>Explore your song</h3>
                                <p>
                                    Discover detailed analytics for your music.
                                    Go deeper and find out what Spotify's algorithms say about your songs!
                                </p>
                                <Link to="/song" >
                                    <button>Analyse a song</button>
                                </Link>
                            </div>
                        </div>
                        <div className="Container-box">
                            <div>
                                <h1>Playlist Analyser</h1>
                                <h3>Find the right playlist for your song</h3>
                                <p>
                                    Choose a song and see how well it fits in a chosen playlist.
                                </p>
                                <Link to="/playlist">
                                    <button>Analyse a playlist</button>
                                </Link>
                                <p/>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default HomePage;