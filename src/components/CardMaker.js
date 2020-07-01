import React from 'react';
import SearchResult from "./SearchResult";
import hellify from "../hellify.png";

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class CardMaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: Array({
                name: '',
                artist: '',
                album: '',
                art: null
            }),
        };
    }

    componentDidMount() {
        // If there are no cards to be generated, return nothing.
        if (this.props.data == null) {
            return [];
        }
        // Else generate cards.
        //                     artwork={this.props.data.art[i]}
        var cardGrid = [];
        for (var i=0; i < this.props.data.length; i++) {
            cardGrid.push(
                <p key={i}><SearchResult
                    name={this.props.data[i].name}
                    album={this.props.data[i].album}
                    artist={this.props.data[i].artist}
                    artwork={this.props.data[i].art}
                /></p>
            )
        }
        return cardGrid;
    }

    render() {
        return (
            <div>
                {this.componentDidMount()}
            </div>
        );
    }
}

export default CardMaker;