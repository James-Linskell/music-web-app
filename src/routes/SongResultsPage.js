import React from 'react';
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import "../styles/SongResultsPage.css";
import { Bar } from 'react-chartjs-2';

// https://www.youtube.com/watch?v=-qOe8lBAChE
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

// this.props.location.search gives the song id!!!
class SongResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rawData: null,
            data: [],
            options: [],
            prompt: null,
            invalid: false
        }
    }

    waitForFetch = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length));
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        this.setState({rawData: data});
    };

    generateSongFeatures() {
        const chartData = {
            labels: ["Acousticness", "Dancability", "Energy", "Liveness", "Speechiness", "Valence"],
            datasets: [{
                label: "Song features",
                backgroundColor: 'midnightblue',
                borderColor: 'rgb(255, 99, 132)',
                data: [this.state.rawData.acousticness, this.state.rawData.danceability, this.state.rawData.energy,
                    this.state.rawData.liveness, this.state.rawData.speechiness, this.state.rawData.valence]
            }]
        }
        const chartOptions = {
            legend: {
                display: "true",
                labels: {
                    fontColor: "white"
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white"
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white"
                    },
                }]
            }
        }
        this.setState({
            data: chartData,
            options: chartOptions
        })
    }

    componentDidMount = async () =>  {
        await this.waitForFetch();
        this.generateSongFeatures();
    }

    render() {
        return (
            <div className="Main">
                Song Data:
                <div className="Container">
                    <div>
                        <h2>Song Features</h2>
                        <p className="Chart">
                            <Bar data={this.state.data} options={this.state.options}/>
                        </p>
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