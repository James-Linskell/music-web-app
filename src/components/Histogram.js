import {Bar} from "react-chartjs-2";
import React from "react";

/**
 * Calls the Node server to Generate a chart using Chart.js library. Creates histogram for a single mood feature of a song
 * (danceability, energy or valence). Takes an array of integers of data which has been pre-processed into bins.
 */
class Histogram extends React.Component {
    /**
     * Sets default state values.
     * @constructor
     */
    constructor() {
        super();
        this.state = {
            histogram: null
        }
    }

    /**
     * Calls function to generate a chart once component has mounted. Necessary for async await.
     */
    componentDidMount() {
        this.generateChart();
    }

    /**
     * Generates a histogram for mood features, using pre-processed data provided through props which has been separated
     * into bins of 0.5.
     */
    generateChart = async () => {
        let input = {
            data: this.props.data,
            songIndex: this.props.songIndex
        };
        // Fetch my API endpoint for generating histograms for mood features:
        const generateScore = await fetch('/api/plSort/generateHistogram', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        });
        let response = await generateScore.json();
        console.log(response);
        // Determine if the user is using Firefox browser:
        let userAgentString = navigator.userAgent;
        let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
        let width = null;
        let height = null;
        if (firefoxAgent) {
            // This fixes a bug in which graphs slowly expand over time in Firefox. This is a problem with the react-native-charts
            // library, so this quick hacky fix is the best I can do for now. It does however break the graphs on firefox mobile.
            response.chartOptions.responsive = false;
            width = "500vh";
            height = "300vh";
        }
        if (this.props.type === "dance") {
            response.chartOptions.scales.xAxes[0].scaleLabel.labelString = "Danceability";
        } else if (this.props.type === "energy") {
            response.chartOptions.scales.xAxes[0].scaleLabel.labelString = "Energy";
        } else {
            response.chartOptions.scales.xAxes[0].scaleLabel.labelString = "Positivity";
        }

        this.setState({
            histogram: <Bar data={response.chartData} options={response.chartOptions} width={width} height={height}/>
        })
    }

    /**
     * Renders histogram.
     * @return <Histogram/>
     */
    render() {
        return (
            this.state.histogram
        )
    }
}

export default Histogram;