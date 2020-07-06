import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import FetchSearchData from "../components/FetchSearchData";

// this.props.location.search gives the song id!!!
class SongResultsPage extends React.Component {
    render() {
        return (
            <div style={{backgroundColor: "grey", height: "100vh"}}>
                Song Analyser {this.props.location.search}
            </div>
        )
    }
}

export default SongResultsPage;