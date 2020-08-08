import React from 'react';
import { Router, Link } from "react-router-dom";
import hellify from "../hellify.png";
import '../styles/HomePage.css';
import BackgroundWavesSvgPaths from "../components/BackgroundWavesSvgPaths";

/**
 * homepage for the website. Contains links to both the Playlist Analyser and Song Analyser.
 */
class HomePage extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div style={{width: "1vw", marginLeft: "-1vw", zIndex: "-1"}}>
                        <BackgroundWavesSvgPaths fill="red" shiftDown="2vh"/>
                    </div>
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
                    <div style={{marginTop: "18vh", fontSize: "2vh"}}>Songmap 2020</div>
                    <div style={{marginTop: "1vh", fontSize: "2vh"}}>Note: The song and playlist must be on Spotify. This website used Spotify's API to find song data.</div>
                </header>
            </div>
        );
    }
}

export default HomePage;