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
                            <img className="Album-art" src={this.props.artwork} className="Album-art" alt="album artwork"></img>
                        </td>
                        <div style={{opacity: 0.2, position: "absolute", maxWidth: "21vmin", maxHeight: "18vmin", overflow: "hidden", textIndent: "-10vmin"}}>
                        <img src={this.props.artwork} style={{height: "45vmin", width: "auto"}}/>
                        </div>
                        <td className="Song-info">
                            <div className="Info" >{this.props.name}</div>
                            <div className="Info" >{this.props.album}</div>
                            <div className="Info">{this.props.artist}</div>
                        </td>
                        <div style={{backgroundImage: "url(" + this.props.artwork + ")", opacity: 0.2}}>

                        </div>
                    </tr>
                </table>
            </div>
        );
    }

}

export default SearchResult;