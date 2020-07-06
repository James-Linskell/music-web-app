import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./routes/HomePage";
import SearchPage from "./routes/SearchPage";
import SongPage from "./routes/SongPage";
import PlaylistPage from "./routes/PlaylistPage";
import AboutPage from "./routes/AboutPage";

/**
 * Main page of the app. Only handles routing, then gets passed to index.js for rendering.
 */
class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={SearchPage}/>
                <Route path="/home" component={HomePage}/>
                <Route path="/songs" component={SongPage}/>
                <Route path="/playlists" component={PlaylistPage}/>
                <Route path="/about" component={AboutPage}/>
            </Router>
        )
    }
}

export default App;