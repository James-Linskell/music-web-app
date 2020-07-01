import React from 'react';
import '../styles/SearchResult.css';

class SearchResult extends React.Component {
    constructor(props) {
        // Props: title, album, artist, artwork
        super(props);
    }

    render() {
        return (
            <div className="Result-card">
                <table className="Card-table">
                    <tr className="Class-row">
                        <td rowSpan="0" className="Col-art">
                            <img className="Album-art" src={this.props.artwork} className="Album-art" alt="album artwork"/>
                        </td>
                        <td className="Song-info">
                            <div>{this.props.name}</div>
                            <div>{this.props.album}</div>
                            <div>{this.props.artist}</div>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }

}

export default SearchResult;