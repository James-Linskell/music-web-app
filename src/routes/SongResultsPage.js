import React from 'react';
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import "../styles/SongResultsPage.css";
import { Bar } from 'react-chartjs-2';

// this.props.location.search gives the song id!!!
class SongResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    waitForFetch = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length));
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "No results found!",
                results: <div className="Margin" ></div>
            });
            return;
        }
        const chartData = {
            labels: ["Acousticness", "Dancability", "Energy", "Liveness", "Speechiness", "Valence"],
            datasets: [{
                label: "Song features",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [data.acousticness, data.danceability, data.energy, data.liveness, data.speechiness, data.valence]
            }]
        }
        this.setState({data: chartData})
        console.log(data);
    };

    componentDidMount() {
        this.waitForFetch();
    }

    render() {
        return (
            <div className="Main">
                Song Features:
                <div className="Chart">
                    <Bar data={this.state.data}/>
                </div>
            </div>
        )
    }
}

export default SongResultsPage;