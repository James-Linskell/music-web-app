import {Bar} from "react-chartjs-2";
import React from "react";

class Histogram extends React.Component {
    constructor() {
        super();
        this.state = {
            histogram: null
        }
    }

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

        this.setState({
            histogram: <Bar className="Chart" data={response.chartData} options={response.chartOptions} height="300vh" width="550vw"/>
        })
    }

    render() {
        return (
            this.state.histogram
        )
    }

}

export default Histogram;