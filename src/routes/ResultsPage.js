import React from 'react';
import CardMaker from "../components/CardMaker";
import '../styles/ResultsPage.css';

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class ResultsPage extends React.Component {
    render() {
        return (
            <div className="Cards">
                <p>Results</p>
                <CardMaker data={this.props.data} />
            </div>
        );
    }
}

export default ResultsPage;