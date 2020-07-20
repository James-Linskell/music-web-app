import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import SongCard from "../components/SongCard";
import '../styles/SongResultsPage.css'
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import {HorizontalBar} from "react-chartjs-2";
import Histogram from "../components/Histogram";
import analyze from 'rgbaster';

class PlaylistResultsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            danceHist: null,
            energyHist: null,
            valenceHist: null
        }
    }

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
        console.log(plTracks);
        plTracks.items.forEach(track => {
            n++;
            // Limit results to chosen song + 100 songs from playlist:
            if (n === 100) {
                return;
            }
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

        // Grad bg colours from album cover:
        const result = await analyze(this.props.location.state.art)
        console.log(`The dominant color is ${result[0].color} with ${result[0].count} occurrence(s)`)
        console.log(`The secondary color is ${result[1].color} with ${result[1].count} occurrence(s)`)
        console.log(`Palette: ${result[2].color} with ${result[1].count}`);
    };

    simplifyData = async (data) => {
        let dance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let energy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let valence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let danceArray = [];
        let energyArray = [];
        let valenceArray = [];
        let danceIndex = 0;
        let energyIndex = 0;
        let valenceIndex = 0;
        let n = 0;
        data.audio_features.forEach(track => {
            if (track.danceability < 0.05) {
                dance[0]++;
            } else if (0.05 < track.danceability < 0.1) {
                dance[1]++;
            } else if (0.1 < track.danceability < 0.15) {
                dance[2]++;
            } else if (0.15 < track.danceability < 0.2) {
                dance[3]++;
            } else if (0.2 < track.danceability < 0.25) {
                dance[4]++;
            } else if (0.25 < track.danceability < 0.3) {
                dance[5]++;
            } else if (0.3 < track.danceability < 0.35) {
                dance[6]++;
            } else if (0.35 < track.danceability < 0.4) {
                dance[7]++;
            } else if (0.4 < track.danceability < 0.45) {
                dance[8]++;
            } else if (0.45 < track.danceability < 0.55) {
                dance[9]++;
            } else if (0.5 < track.danceability < 0.55) {
                dance[10]++;
            } else if (0.55 < track.danceability < 0.6) {
                dance[11]++;
            } else if (0.6 < track.danceability < 0.65) {
                dance[12]++;
            } else if (0.65 < track.danceability < 0.7) {
                dance[13]++;
            } else if (0.7 < track.danceability < 0.75) {
                dance[14]++;
            } else if (0.75 < track.danceability < 0.8) {
                dance[15]++;
            } else if (0.8 < track.danceability < 0.85) {
                dance[16]++;
            } else if (0.85 < track.danceability < 0.9) {
                dance[17]++;
            } else if (0.9 < track.danceability < 0.95) {
                dance[18]++;
            } else if (0.95 < track.danceability < 1.0) {
                dance[19]++;
            }

            if (track.energy < 0.05) {
                energy[0]++;
            } else if (0.05 < track.energy < 0.1) {
                energy[1]++;
            } else if (0.1 < track.energy < 0.15) {
                energy[2]++;
            } else if (0.15 < track.energy < 0.2) {
                energy[3]++;
            } else if (0.2 < track.energy < 0.25) {
                energy[4]++;
            } else if (0.25 < track.energy < 0.3) {
                energy[5]++;
            } else if (0.3 < track.energy < 0.35) {
                energy[6]++;
            } else if (0.35 < track.energy < 0.4) {
                energy[7]++;
            } else if (0.4 < track.energy < 0.45) {
                energy[8]++;
            } else if (0.45 < track.energy < 0.55) {
                energy[9]++;
            } else if (0.5 < track.energy < 0.55) {
                energy[10]++;
            } else if (0.55 < track.energy < 0.6) {
                energy[11]++;
            } else if (0.6 < track.energy < 0.65) {
                energy[12]++;
            } else if (0.65 < track.energy < 0.7) {
                energy[13]++;
            } else if (0.7 < track.energy < 0.75) {
                energy[14]++;
            } else if (0.75 < track.energy < 0.8) {
                energy[15]++;
            } else if (0.8 < track.energy < 0.85) {
                energy[16]++;
            } else if (0.85 < track.energy < 0.9) {
                energy[17]++;
            } else if (0.9 < track.energy < 0.95) {
                energy[18]++;
            } else if (0.95 < track.energy < 1.0) {
                energy[19]++;
            }

            if (track.valence < 0.05) {
                valence[0]++;
            } else if (0.05 < track.valence < 0.1) {
                valence[1]++;
            } else if (0.1 < track.valence < 0.15) {
                valence[2]++;
            } else if (0.15 < track.valence < 0.2) {
                valence[3]++;
            } else if (0.2 < track.valence < 0.25) {
                valence[4]++;
            } else if (0.25 < track.valence < 0.3) {
                valence[5]++;
            } else if (0.3 < track.valence < 0.35) {
                valence[6]++;
            } else if (0.35 < track.valence < 0.4) {
                valence[7]++;
            } else if (0.4 < track.valence < 0.45) {
                valence[8]++;
            } else if (0.45 < track.valence < 0.55) {
                valence[9]++;
            } else if (0.5 < track.valence < 0.55) {
                valence[10]++;
            } else if (0.55 < track.valence < 0.6) {
                valence[11]++;
            } else if (0.6 < track.valence < 0.65) {
                valence[12]++;
            } else if (0.65 < track.valence < 0.7) {
                valence[13]++;
            } else if (0.7 < track.valence < 0.75) {
                valence[14]++;
            } else if (0.75 < track.valence < 0.8) {
                valence[15]++;
            } else if (0.8 < track.valence < 0.85) {
                valence[16]++;
            } else if (0.85 < track.valence < 0.9) {
                valence[17]++;
            } else if (0.9 < track.valence < 0.95) {
                valence[18]++;
            } else if (0.95 < track.valence < 1.0) {
                valence[19]++;
            }

            // Find index of comparison song:
            if (n === 0) {
                danceIndex = dance.findIndex((val) => {
                    return val >= 0.01;
                });
                energyIndex = energy.findIndex((val) => {
                    return val >= 0.01;
                });valenceIndex = valence.findIndex((val) => {
                    return val >= 0.01;
                });
            }

            danceArray.push(track.danceability);
            energyArray.push(track.energy);
            valenceArray.push(track.valence);
            n++;
        });

        let values = [data.audio_features[0].danceability, data.audio_features[0].energy, data.audio_features[0].valence];
        let means = [danceArray.reduce((a,b) => a+b)/n, energyArray.reduce((a,b) => a+b)/n, valenceArray.reduce((a,b) => a+b)/n];
        let stDevs = [Math.sqrt(danceArray.map(x => Math.pow(x-means[0],2)).reduce((a,b) => a+b)/n),
            Math.sqrt(energyArray.map(x => Math.pow(x-means[1],2)).reduce((a,b) => a+b)/n),
            Math.sqrt(valenceArray.map(x => Math.pow(x-means[2],2)).reduce((a,b) => a+b)/n)]
        let sigmas = [];

        /*
         * todo:
         *  If there is a high variance AND sigma > 2, it is a bad fit.
         *  If there is a high variance AND sigma < 2, it is a quite good fit.
         *  If there is a low variance AND sigma < 2, it is an excellent fit.
         *  If there is a low variance AND sigma > 2, it is a terrible fit.
         */
        for (let i = 0; i < 3; i++) {
            if (stDevs[i] > 0.15) {
                console.log("There is a high variance in the data.")
            }

            console.log("Standard deviation: " + stDevs[i]);
            if ((means[i] - stDevs[i]) <= values[i] && values[i] <= (means[i] + stDevs[i])) {
                sigmas[i] = 1;
            } else if ((means[i] - (2 * stDevs[i])) <= values[i] && values[i] <= (means[i] + (2 * stDevs[i]))) {
                sigmas[i] = 2;
            } else {
                sigmas[i] = 3;
            }
        }
        let fit = {
            stDevs,
            sigmas
        };

        this.setState({
            danceHist: <Histogram data={dance} songIndex={danceIndex}/>,
            energyHist: <Histogram data={energy} songIndex={energyIndex}/>,
            valenceHist: <Histogram data={valence} songIndex={valenceIndex}/>
        })

        console.log(fit);
        return fit;
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
                            <div className='myDiv'/>
                        </p>
                        <div style={{ display: 'flex', maxWidth: 900 }}>
                        </div>
                    </div>
                    <div className="Chart">
                        {this.state.danceHist}
                    </div>
                    <div style={{maxWidth: "50vw"}}>
                        {this.state.energyHist}
                    </div>
                    <div style={{maxWidth: "50vw"}}>
                        {this.state.valenceHist}
                    </div>
                </div>
            </div>
        )
    }
}

export default PlaylistResultsPage;