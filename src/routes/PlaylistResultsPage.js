import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import SongCard from "../components/SongCard";
import '../styles/PlaylistResultsPage.css'
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {HorizontalBar} from "react-chartjs-2";
import Histogram from "../components/Histogram";
import * as Vibrant from 'node-vibrant';
import BackgroundSvgPaths from "../components/BackgroundSvgPaths";
import ColorThief from 'color-thief';

class PlaylistResultsPage extends React.Component {
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
            albumColours1: "white",
            albumColours2: "white",
            albumColours3: "white",
            albumColours4: "white",
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

        // Get bg colours using Vibrant promise:
        const img = document.querySelector('img');
        img.crossOrigin = "Anonymous";
        const colorThief = new ColorThief();
        // Make sure image is finished loading
        img.addEventListener('load', function() {
            let colour = colorThief.getColor(img);
            Vibrant.from(img).getPalette()
                .then((palette) => {
                    console.log(palette);
                    let rgb1 = palette.Vibrant.getRgb();
                    let rgb2 = palette.DarkMuted.getRgb();
                    let rgb3 = palette.DarkVibrant.getRgb();
                    let rgb4 = palette.LightVibrant.getRgb();
                    this.setState({
                        albumColours1: `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, 1)`,
                        albumColours2: `rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, 1)`,
                        albumColours3: `rgba(${rgb3[0]}, ${rgb3[1]}, ${rgb3[2]}, 1)`,
                        albumColours4: `rgba(${rgb4[0]}, ${rgb4[1]}, ${rgb4[2]}, 1)`
                    })}
                )
        }.bind(this));

        let fit = await this.simplifyData(featureData);
        let scores = [];
        let featureInfo1 = [];
        let featureInfo2 = [];
        let featureInfoColour = [];

        for (let i = 0; i < 3; i++) {
            let feat = "";
            if (i === 0) {
                feat = "Danceability";
            } else if (i === 1) {
                feat = "Energy";
            } else {
                feat = "Positivity";
            }

            if (fit.sigmas[i] === 1 && fit.stDevs[i] <= 0.15) {
                scores[i] = 4;
                featureInfo1[i] = "Perfect fit!"
                featureInfo2[i] = `The ${feat} of your chosen song fits the chosen playlist perfectly! The playlist songs
                all have very a similiar ${feat}, and your chosen song sits right in the middle of the distribution.`;
                featureInfoColour[i] = "#1E9600";
            } else if (fit.sigmas[i] === 1 && fit.stDevs[i] > 0.15) {
                scores[i] = 3;
                featureInfo1[i] = "Great fit!"
                featureInfo2[i] = `The ${feat} of your chosen song fits the chosen playlist very well. The playlist songs
                don't follow a close pattern for ${feat}, and the values vary a lot. This means ${feat} isn't so important
                for this playlist, but your song still fits well!`;
                featureInfoColour[i] = "#77b300";
            } else if ((fit.sigmas[i] === 2 || fit.sigmas[i] === 3) && fit.stDevs[i] > 0.15) {
                scores[i] = 2;
                featureInfo1[i] = "Average fit"
                featureInfo2[i] = `The ${feat} of your chosen song isn't a great fit. The playlist songs don't
                follow a close pattern for ${feat} however, so ${feat} isn't that important for this playlist. There is a lot of
                variation, so your song could potentially still fit here!`;
                featureInfoColour[i] = "#ffcc00";
            } else if (fit.sigmas[i] === 2 && fit.stDevs[i] <= 0.15) {
                scores[i] = 1;
                featureInfo1[i] = "Poor fit";
                featureInfo2[i] = `The ${feat} of your chosen song doesn't fit the chosen playlist well. The ${feat} of the songs on this
                playlist follow a very tight pattern, and your song's ${feat} doesn't follow this pattern. This is a sign
                that your song may not be right for this playlist.`;
                featureInfoColour[i] = "#cc2900";
            } else {
                scores[i] = 0;
                featureInfo1[i] = "Terrible fit";
                featureInfo2[i] = `The ${feat} of your chosen song does not fit the playlist well. It falls very far outside
                the distribution. This is a sign that your song probably isn't right for this playlist.`;
                featureInfoColour[i] = "#e60000";
            }
        }
        console.log("Score: ", scores);
        let totalScore = [scores.reduce((a, b) => a + b, 0)];
        this.setState({
            score: totalScore,
            featureInfo1: featureInfo1,
            featureInfo2: featureInfo2,
            featureInfoColour: featureInfoColour,
            fit: fit
        })
        this.generateScoreChart(totalScore);
        console.log(totalScore);
    };

    generateScoreChart(score) {
        const chartData = {
            labels: ["Score"],
            datasets: [{
                label: "Song Score",
                backgroundColor: 'darkred',
                borderColor: 'rgb(255, 99, 132)',
                data: score
            }]
        }
        // Colour the bar:
        if (score > 10) {
            chartData.datasets[0].backgroundColor = "#1E9600";
        } else if (score > 8) {
            chartData.datasets[0].backgroundColor = "#77b300";
        } else if (score > 6) {
            chartData.datasets[0].backgroundColor = "#bfff00";
        } else if (score > 5) {
            chartData.datasets[0].backgroundColor = "#ffcc00";
        } else if (score > 3) {
            chartData.datasets[0].backgroundColor = "#ff751a";
        } else if (score > 2) {
            chartData.datasets[0].backgroundColor = "#cc2900";
        } else {
            chartData.datasets[0].backgroundColor = "#e60000";
        }

        const chartOptions = {
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        return data['datasets'][0]['data'][tooltipItem['index']];
                    },
                },
                backgroundColor: '#FFF',
                titleFontSize: 16,
                titleFontColor: '#0066ff',
                bodyFontColor: '#000',
                bodyFontSize: 14,
                displayColors: false,
            },
            legend: {
                display: false,
                labels: {
                    fontColor: "white",
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: true,
                        fontColor: "white",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    barPercentage: 0.5,
                    ticks: {
                        fontColor: "white",
                        fontSize: 14,
                        min: 0,
                        max: 12,
                        stepSize: 1
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            },
        }
        this.setState({
            chartData: chartData,
            chartOptions: chartOptions
        })
    }

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

        if (n < 20) {
            this.setState({
                errorVis: "visible"
            })
        }

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
            <div className="Main-play" style={{backgroundColor: this.state.albumColours1}}>
                <div style={{width: "1vw", marginLeft: "-1vw"}}>
                    <BackgroundSvgPaths fill={this.state.albumColours2}/>
                    <BackgroundSvgPaths fill={this.state.albumColours3} shiftDown="-100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours4} shiftDown="100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours2} shiftDown="200vh"/>
                </div>
                <div>
                    <div className="Header-play">
                        <p>Playlist Analysis</p>
                        <p id="Song-card-play">
                            <SongCard
                                name={this.props.location.state.name}
                                album={this.props.location.state.album}
                                artist={this.props.location.state.artist}
                                artwork={this.props.location.state.art}
                            />
                        </p>
                    </div>
                    <div className="Container-play">
                        <div style={{display: "flex", margin: "0vh", fontSize: "2.5vh", padding: "0vh", textAlign: "left", paddingLeft: "3vh", alignContent: "left", color: "red", visibility: this.state.errorVis}}><ErrorOutlineIcon style={{paddingRight: "0.3vw"}} />This playlist has less than 20 songs. Choose a playlist with more songs for a more accurate analysis.</div>
                        <div>
                            <h2>Song Fit:<button style={{display: "flex", marginLeft: "2vw"}}>What's this?</button></h2>
                            <hr/>
                            <p>information</p>
                            <p>
                                <HorizontalBar className="Chart" data={this.state.chartData} options={this.state.chartOptions} height="60vh"/>
                            </p>
                            <p>
                                information
                            </p>
                        </div>
                        <div>
                            <h2>Song score:</h2>
                            <hr/>
                            <p>Score: {(this.state.score/12) * 100} %</p>
                        </div>
                        <div className="Chart-play">
                            <p>{this.state.danceHist}</p>
                        </div>
                        <div>
                            <h2>Danceability:<h2 style={{color: this.state.featureInfoColour[0]}}>{this.state.featureInfo1[0]}</h2></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[0]}</p>
                        </div>
                        <div>
                            <p>{this.state.energyHist}</p>
                        </div>
                        <div>
                            <h2>Energy:<h2 style={{color: this.state.featureInfoColour[1]}}>{this.state.featureInfo1[1]}</h2></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[1]}</p>
                        </div>
                        <div>
                            <p>{this.state.valenceHist}</p>
                        </div>
                        <div>
                            <h2>Positivity:<h2 style={{color: this.state.featureInfoColour[2]}}>{this.state.featureInfo1[2]}</h2></h2>
                            <hr/>
                            <p>{this.state.featureInfo2[2]}</p>
                        </div>
                        <div id="Detail">
                            <h2>Detailed information:</h2>
                            <hr/>
                            <h2>Danceability</h2>
                            <p>
                                The standard deviation of Danceability values for the songs in this playlist is {this.state.fit.stDevs[0].toFixed(3)}.
                                The danceability of your song falls within {this.state.fit.sigmas[0]} σ (sigma) of the distribution.
                            </p>
                            <h2>Energy</h2>
                            <p>
                                The standard deviation of Energy values for the songs in this playlist is {this.state.fit.stDevs[1].toFixed(3)}.
                                The Energy of your song falls within {this.state.fit.sigmas[1]} σ (sigma) of the distribution.
                            </p>
                            <h2>Positivity</h2>
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