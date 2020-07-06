import React from 'react';
import '../styles/SearchPage.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./routes/HomePage";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={this.state.currentRoute}/>
                <Route path="/home" component={HomePage}/>
            </Router>
        )
    }
}