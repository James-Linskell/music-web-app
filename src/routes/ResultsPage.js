import React from 'react';
import CardMaker from "../components/CardMaker";

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Cards">
                <CardMaker data={this.props.data} />
            </div>
        );
    }
}

export default ResultsPage;