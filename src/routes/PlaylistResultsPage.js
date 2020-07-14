import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";


class PlaylistResultsPage extends React.Component {
    render() {
        return (
            <div>
                <p>Song: {this.props.location.search.substring(1, this.props.location.search.length)}</p>
                <p>Playlist: {this.props.location.hash.substring(1, this.props.location.hash.length)}</p>
            </div>
        )
    }
}

export default PlaylistResultsPage;