import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import HomePage from "./routes/HomePage";
import SearchPage from "./routes/SearchPage";
import SongPage from "./routes/SongPage";
import PlaylistPage from "./routes/PlaylistPage";
import AboutPage from "./routes/AboutPage";
import SongResultsPage from "./routes/SongResultsPage";
import PlaylistResultsPage from "./routes/PlaylistResultsPage";
import './styles/App.css';

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
                        <li style={{float: "left", fontSize: "3vh"}}><a href="#home">SongMap</a></li>
                        <li><a href="#news">News</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/" exact component={SearchPage}/>
                    <Route path="/home" component={HomePage}/>
                    <Route path="/songs" component={SongPage}/>
                    <Route path="/playlists" component={PlaylistPage}/>
                    <Route path="/about" component={AboutPage}/>
                    <Route path="/song" component={SongResultsPage}/>
                    <Route path="/playlist" exact component={PlaylistResultsPage}/>
                </Switch>
            </Router>
        )
    }
}

export default App;