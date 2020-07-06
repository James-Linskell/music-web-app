import React from 'react';

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