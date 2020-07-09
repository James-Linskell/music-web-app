import React from 'react';
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import "../styles/SongResultsPage.css";
import {Bar, HorizontalBar} from 'react-chartjs-2';
import SongCard from "../components/SongCard";

// https://www.youtube.com/watch?v=-qOe8lBAChE
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

// this.props.location.search gives the song id!!!
class SongResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rawFeatures: [],
            rawAnalysis: [],
            rawTrack: [],
            data: [],
            options: [],
            prompt: null,
            invalid: false,
            modality: "",
            songCard: null,
            bgImage: null
        }
    }

    componentDidMount = async () =>  {
        await this.waitForFeatures();
        await this.waitForAnalysis();
        await this.waitFortrack();
        this.generateSongFeatures();
    }

    waitFortrack = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'tracks/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        console.log(data);
        this.setState({rawTrack: data});
        this.setState({
            songCard: <SongCard
                name={this.state.rawTrack.name}
                album={this.state.rawTrack.album.name}
                artist={this.state.rawTrack.artists[0].name}
                artwork={this.state.rawTrack.album.images[1].url}
            />,
            bgImage: <img
                src={this.state.rawTrack.album.images[0].url}
                style={{width: "100vw", height: "auto", overflow: "hidden", display: "block"}} alt="album art"
            />
        })
    };

    waitForFeatures = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'audio-features/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        console.log(data);
        this.setState({rawFeatures: data});
        if (data.mode == 1) {
            this.setState({modality: "Major"})
        } else if (data.mode == 0) {
            this.setState({modality: "Minor"})
        }
    };

    waitForAnalysis = async () => {
        if (this.state.invalid == true) {
            return;
        }
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'audio-analysis/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        this.setState({rawAnalysis: data});
    };

    generateSongFeatures() {
        const chartData = {
            labels: ["Danceability", "Energy", "Speechiness", "Instrumentalness", "Valence"],
            datasets: [{
                label: "Song features",
                backgroundColor: 'midnightblue',
                borderColor: 'rgb(255, 99, 132)',
                data: [this.state.rawFeatures.danceability, this.state.rawFeatures.energy,
                   this.state.rawFeatures.speechiness, this.state.rawFeatures.instrumentalness, this.state.rawFeatures.valence]
            }]
        }
        const chartOptions = {
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function(tooltipItem, data) {
                        return data['datasets'][0]['data'][tooltipItem['index']];
                    },
                    afterLabel: function(tooltipItem, data) {
                        var text = null;
                        if (data.labels[tooltipItem.index] == "Energy") {
                            text = "\nThe energy is...";
                        }
                        if (data.labels[tooltipItem.index] == "Danceability") {
                            text = "\nThe danceability is...";
                        }
                        return text;
                    }
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
                        min: 0,
                        max: 1,
                        stepSize: 0.1
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            },
        }
        this.setState({
            data: chartData,
            options: chartOptions
        })
    }

    render() {
        return (
            <div className="Main">
                <div style={{opacity: 0.25, position: "absolute", zIndex: "-2", width: "100vw", overflow: "hidden"}}>
                    {this.state.bgImage}{this.state.bgImage}{this.state.bgImage}
                </div>
                <div className="Header">
                    Song Data for "{this.state.rawTrack.name}"
                    <p id="Song-card">{this.state.songCard}</p>
                </div>
                <div className="Container">
                    <div>
                        <h2>Song Mood Features:</h2>
                        <p>
                            <Bar className="Chart" data={this.state.data} options={this.state.options} />
                        </p>
                    </div>
                    <div>
                        <h2>Musical information:</h2>
                        <p>Duration: {((this.state.rawFeatures.duration_ms) / 1000 / 60).toFixed(2)} minutes</p>
                        <p>Tempo: {Math.round(this.state.rawFeatures.tempo)} bpm</p>
                        <p>Time signature: {this.state.rawFeatures.time_signature}/4</p>
                        <p>Key: {this.state.rawFeatures.key}</p>
                        <p>Modality: {this.state.modality}</p>
                    </div>
                    <div>
                        <h2>Sample 3</h2>
                        <p></p>
                    </div>
                    <div>
                        <h2>Sample 4</h2>
                        <p></p>
                    </div>
                    <div>
                        <h2>Sample 1</h2>
                        <p></p>
                    </div>
                    <div>
                        <h2>Sample 2</h2>
                        <p></p>
                    </div>
                    <div>
                        <h2>Sample 3</h2>
                        <p></p>
                    </div>
                    <div>
                        <h2>Sample 4</h2>
                        <p></p>
                    </div>
                </div>
            </div>
        )
    }
}

export default SongResultsPage;