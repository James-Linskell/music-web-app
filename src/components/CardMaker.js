import React from 'react';
import SongCard from "./SongCard";

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class CardMaker extends React.Component {
    populateGrid() {
        // Else generate cards.
        if (this.props.data == null) {
            return [];
        }
        var cardGrid = [];
        for (var i=0; i < this.props.data.length; i++) {

            let name = this.props.data[i].name;
            let album = this.props.data[i].album;;
            let artist = this.props.data[i].artist;
            // Truncate info if it is too long to fit on card:
            if (this.props.data[i].name.length > 30) {
                name = this.props.data[i].name.substring(0, 30) + '...'
            }
            if (this.props.data[i].album.length > 20) {
                album = this.props.data[i].album.substring(0, 20) + '...'
            }
            if (this.props.data[i].artist.length > 40) {
                artist = this.props.data[i].artist.substring(0, 40) + '...'
            }

            cardGrid.push(
                <p key={i} ><SongCard
                    name={name}
                    album={album}
                    artist={artist}
                    artwork={this.props.data[i].art}
                /></p>
            )
        }
        return cardGrid;
    }

    render() {
        return (
            <div>
                {this.populateGrid()}
            </div>
        );
    }
}

export default CardMaker;