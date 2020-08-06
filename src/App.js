import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, Link } from "react-router-dom";
import HomePage from "./routes/HomePage";
import SongSearchPage from "./routes/SongSearchPage";
import PlaylistSearchPage from "./routes/PlaylistSearchPage";
import AboutPage from "./routes/AboutPage";
import SongResultsPage from "./routes/SongResultsPage";
import PlaylistResultsPage from "./routes/PlaylistResultsPage";
import './styles/App.css';
import NotFound from "./routes/NotFound";

/**
 * Main page of the app. Only handles routing, then gets passed to index.js for rendering.
 */
class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Router>
                <nav className="Navbar">
                    <ul>
                        <li style={{float: "left", fontSize: "3vh"}}><Link to="/">SongMap</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/playlist">Playlist Analyser</Link></li>
                        <li><Link to="/song">Song Analyser</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/" exact component={HomePage}/>
                    <Route path="/songs" component={SongResultsPage}/>
                    <Route path="/playlists" component={PlaylistResultsPage}/>
                    <Route path="/song-playlist" component={PlaylistSearchPage}/>
                    <Route path="/about" component={AboutPage}/>
                    <Route path="/404" component={NotFound}/>
                    <Route path="/song"   render={(props) => (
                        <SongSearchPage {...props} chain="song" />
                    )}/>
                    <Route path="/playlist" render={(props) => (
                        <SongSearchPage {...props} chain="playlist" />
                    )}/>
                </Switch>
            </Router>
        )
    }
}

export default App;