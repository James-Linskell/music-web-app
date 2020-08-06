import React from 'react';
import FetchData from "../Helpers/FetchData";
import '../styles/PlaylistResultsPage.css'
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {HorizontalBar} from "react-chartjs-2";
import Histogram from "../components/Histogram";
import * as Vibrant from 'node-vibrant';
import BackgroundSvgPaths from "../components/BackgroundSvgPaths";
import ColorThief from 'color-thief';
import LightenColours from "../Helpers/LightenColours";

class PlaylistResultsPage extends React.Component {
    /**
     * Sets defaults so the page can load blank data before fetching data from the API and replacing the default values.
     */
    constructor() {
        super();
        this.state = {
            danceHist: null,
            energyHist: null,
            valenceHist: null,
            score: [],
            chartData: [],
            chartOptions: [],
            featureInfo1: [],
            featureInfo2: [],
            featureInfoColour: [],
            errorVis: "hidden",
            fit: {
                stDevs: [0, 0, 0],
                sigmas: [0, 0, 0]
            },
            albumColours1: "rgba(0, 0, 10, 0.2)",
            albumColours2: "rgba(0, 0, 10, 0.2)",
            albumColours3: "rgba(0, 0, 10, 0.2)",
            albumColours4: "rgba(0, 0, 10, 0.2)",
            propsToState: ""
        }
    }

    componentDidMount() {
        if (typeof this.props.location.state !== "undefined") {
            this.setState({propsToState: this.props.location.state})
            this.waitFortracks();
        } else {
            this.props.history.push({
                pathname: '/404',
                }
            );
        }
        window.scrollTo(0, -document.body.scrollHeight);
    }

    waitFortracks = async () => {
        // Fetch track data from my API:
        const plTracks = await FetchData.fetchData('', 'analysis', 'playlists/' +
            this.props.location.hash.substring(1, this.props.location.hash.length) + '/tracks');
        let plTrackIds = '';
        // Initialise counter for number of songs:
        let n = 0;
        // Generate search string from all track ids:
        plTracks.items.forEach(track => {
            n++;
            // Limit results to chosen song + 100 songs from playlist:
            if (n === 100 || track.track === null) {
                return;
            }
            plTrackIds += track.track.id + ','
        });
        // Remove final comma:
        plTrackIds = plTrackIds.substring(0, (plTrackIds.length) - 1);
        // Index 0 is the song being fitted to the playlist.
        // Fetch feature data from my API:
        const featureData = await FetchData.fetchData(this.props.location.search.substring(1, this.props.location.search.length) +
            ',' + plTrackIds, 'analysis', 'audio-features/?ids=');
        // Error handling if no search results are returned:
        if (featureData.length === 0) {
            this.setState({
                prompt: "Invalid ID",
                invalid: true
            });
            return;
        }
        this.setBgColours();

        // Fetch my API endpoint for sorting and pre-processing the data:
        const sortData = await fetch('/api/plSort', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(featureData)
        });
        // Receive the sorted json data:
        let response = await sortData.json();

        // Fetch my API endpoint for generating the final fit score chart:
        const generateScore = await fetch('/api/plFit/web', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.score)
        });
        let finalScore = await generateScore.json();

        // Generate histograms and set the returned data to state:
        this.setState({
            score: response.score,
            featureInfo1: response.featureInfo1,
            featureInfo2: response.featureInfo2,
            featureInfoColour: response.featureInfoColour,
            fit: response.simplify.fit,
            danceHist: <Histogram data={response.simplify.datasets.dance} songIndex={response.simplify.index.danceIndex} type="dance"/>,
            energyHist: <Histogram data={response.simplify.datasets.energy} songIndex={response.simplify.index.energyIndex} type="energy"/>,
            valenceHist: <Histogram data={response.simplify.datasets.valence} songIndex={response.simplify.index.valenceIndex} type="valence"/>,
            chartData: finalScore.chartData,
            chartOptions: finalScore.chartOptions
        })
    };

    /**
     * Pulls colour palette from the album artwork for the chosen song using Vibrant library, then sets the most prominent
     * colours to the page state. These colours are then rendered as the background once the promise has been fulfilled.
     */
    setBgColours() {
        // Get bg colours using Vibrant promise:
        const img = document.querySelector('img');
        img.crossOrigin = "Anonymous";
        const colorThief = new ColorThief();
        // Make sure image is finished loading
        img.addEventListener('load', function() {
            let colour = colorThief.getColor(img);
            Vibrant.from(img).getPalette()
                .then((palette) => {
                    let rgb1 = palette.Vibrant.getRgb();
                    let rgb2 = palette.DarkVibrant.getRgb();
                    let rgb3 = palette.DarkMuted.getRgb();
                    let rgb4 = palette.Muted.getRgb();
                    rgb1 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb1[0] + "," + rgb1[1] + "," + rgb1[2] + ")"));
                    rgb2 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb2[0] + "," + rgb2[1] + "," + rgb2[2] + ")"));
                    rgb3 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb3[0] + "," + rgb3[1] + "," + rgb3[2] + ")"));
                    rgb4 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb4[0] + "," + rgb4[1] + "," + rgb4[2] + ")"));
                    this.setState({
                        albumColours1: rgb1,
                        albumColours2: rgb2,
                        albumColours3: rgb3,
                        albumColours4: rgb4
                    })}
                )
        }.bind(this));
    }

    //CHANGE: get new audio data every time, or the user can't bookmark this page ///////////////////////////////////////////
    render() {
        return (
            <div className="Main-play" style={{backgroundColor: this.state.albumColours1}}>
                <div style={{width: "1vw", marginLeft: "-1vw"}}>
                    <BackgroundSvgPaths fill={this.state.albumColours2}/>
                    <BackgroundSvgPaths fill={this.state.albumColours3} shiftDown="-100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours4} shiftDown="100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours2} shiftDown="200vh"/>
                </div>
                <div>
                    <div className="Container-play">
                        <div style={{display: "flex", margin: "0vh", fontSize: "2.5vh", padding: "0vh", textAlign: "left", paddingLeft: "3vh", alignContent: "left", color: "red", visibility: this.state.errorVis}}><ErrorOutlineIcon style={{paddingRight: "0.3vw"}} />This playlist has less than 20 songs. Choose a playlist with more songs for a more accurate analysis.</div>
                        <div>
                            <h2>{this.state.propsToState.name}</h2>
                            <h2>{this.state.propsToState.artist}</h2>
                            <p/>
                            <p style={{backgroundColor: "white", padding: "0vh", paddingLeft: "0.25vw", margin: "1vw"}}>
                                <HorizontalBar data={this.state.chartData} options={this.state.chartOptions} height="60vh"/>
                            </p>
                            <p>
                                <p style={{fontSize: "6vh"}}>{Math.round((this.state.score/12) * 100)}% Fit!</p>
                            </p>
                        </div>
                        <div style={{margin: "0hv", padding: "0vh", justifyContent: "center", display: "flex"}}>
                            <p>
                                <img src={this.state.propsToState.art} style={{margin: "2vh", height: "auto", width: "45vh", border: "0.3vh solid dimgrey"}}/>
                            </p>
                        </div>
                        <div className="Chart-play">
                            <p>{this.state.danceHist}</p>
                        </div>
                        <div>
                            <h2>Danceability:<p style={{color: this.state.featureInfoColour[0], margin: "0vh", padding: "1vh"}}>{this.state.featureInfo1[0]}</p></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[0]}</p>
                        </div>
                        <div>
                            <p>{this.state.energyHist}</p>
                        </div>
                        <div>
                            <h2>Energy:<p style={{color: this.state.featureInfoColour[1], margin: "0vh", padding: "1vh"}}>{this.state.featureInfo1[1]}</p></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[1]}</p>
                        </div>
                        <div>
                            <p>{this.state.valenceHist}</p>
                        </div>
                        <div>
                            <h2>Positivity:<p style={{color: this.state.featureInfoColour[2], margin: "0vh", padding: "1vh"}}>{this.state.featureInfo1[2]}</p></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[2]}</p>
                        </div>
                        <div id="Detail">
                            <h2>Mood features explained:</h2>
                            <hr/>
                            <p>All mood feature data is taken from Spotify, who use algorithms to calculate the numbers shown.</p>
                            <h2>Energy</h2>
                            <p>
                                The 'Energy' of a song determines how energetic the song feels, and is a measure of intensity and musical activity, with energetic
                                tracks feeling fast, busy and noisy. Energy is calculated by taking into account the dynamic range,
                                the loudness, the timbre, and the onset rate (rate of notes played). Energy is determined on a scale of 0 - 10,
                                with 10 being the most energetic.
                            </p>
                            <p>
                                The standard deviation of Energy values for the songs in this playlist is {this.state.fit.stDevs[1].toFixed(3)}.
                                The Energy of your song falls within {this.state.fit.sigmas[1]} σ (sigma) of the distribution.
                            </p>
                            <h2>Danceability</h2>
                            <p>
                                The 'Danceability' of a song describes how good a track is to dance to. This takes into account
                                a number of musical elements including tempo, how stable the rhythm is, the strength of each beat,
                                and how regular the musical pattern is. Danceability is determined on a scale of 0 - 10, with 10 being
                                the most danceable.
                            </p>
                            <p>
                                The standard deviation of Danceability values for the songs in this playlist is {this.state.fit.stDevs[0].toFixed(3)}.
                                The danceability of your song falls within {this.state.fit.sigmas[0]} σ (sigma) of the distribution.
                            </p>
                            <h2>Positivity</h2>
                            <p>
                                The Positivity or 'Valence' of a song is how positive it sounds. Tracks with high valence sound more positive
                                (happy, cheerful, euphoric) while tracks with low valence sound more negative (sad, depressed, angry).
                                Positivity is determined on a scale of 0 - 10, with 10 being the most positive sounding.
                            </p>
                            <p>
                                The standard deviation of Positivity values for the songs in this playlist is {this.state.fit.stDevs[2].toFixed(3)}.
                                The Positivity of your song falls within {this.state.fit.sigmas[2]} σ (sigma) of the distribution.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PlaylistResultsPage;