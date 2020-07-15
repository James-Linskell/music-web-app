import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import SongCard from "../components/SongCard";
import '../styles/SongResultsPage.css'
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import {HorizontalBar} from "react-chartjs-2";


class PlaylistResultsPage extends React.Component {

    componentDidMount() {
        this.waitFortracks();
    }

    waitFortracks = async () => {
        const songId = this.props.location.search;
        const plId = this.props.location.hash;
        const plTracks = await FetchTrackFeatures.fetchData('', 'playlists/' +
            plId.substring(1, this.props.location.hash.length) + '/tracks');
        let plTrackIds = '';
        let n = 0;
        plTracks.items.forEach(track => {
            n++;
            plTrackIds += track.track.id + ','
        });
        // Remove final comma:
        plTrackIds = plTrackIds.substring(0, (plTrackIds.length) - 1);

        // Index 0 is the song being fitted to the playlist:
        const featureData = await FetchTrackFeatures.fetchData(this.props.location.search.substring(1, this.props.location.search.length) +
        ',' + plTrackIds, 'audio-features/?ids=');
        // Error handling if no search results are returned:
        if (featureData.length === 0) {
            this.setState({
                prompt: "Invalid ID",
                invalid: true
            });
            return;
        }
        console.log(featureData);
        console.log(this.props.location.state);
        this.simplifyData(featureData);
    };

    simplifyData = async (data) => {
        let dance = [];
        let energy = [];
        let valence = [];
        data.audio_features.forEach(track => {
           dance.push(track.danceability)
        });
    }

    //CHANGE: get new audio data every time, or the user can't bookmark this page ///////////////////////////////////////////
    render() {
        return (
            <div className="Main">
                <div style={{opacity: 0.7, position: "absolute", zIndex: "-2", width: "100vw", overflow: "hidden"}}>
                    <img
                        src={this.props.location.state.art}
                        style={{width: "100vw", height: "auto", overflow: "hidden", display: "block"}} alt="album art"/>
                    <img
                        src={this.props.location.state.art}
                        style={{width: "100vw", height: "auto", overflow: "hidden", display: "block"}} alt="album art"/>
                    <img
                        src={this.props.location.state.art}
                        style={{width: "100vw", height: "auto", overflow: "hidden", display: "block"}} alt="album art"/>
                </div>
                <div className="Header">
                    <p>Playlist Analysis</p>
                </div>
                <div className="Container">
                    <div style={{display: "flex", fontSize: "2.5vh", padding: "1vh", textAlign: "left", paddingLeft: "3vh", alignContent: "left"}}><InfoOutlinedIcon style={{paddingRight: "0.3vw"}} /> Hover over an item for more information.</div>
                    <div>
                        <h2>Song Mood Features:<button style={{display: "flex", marginLeft: "2vw"}}>What's this?</button></h2>
                        <hr/>
                        <p>

                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlaylistResultsPage;