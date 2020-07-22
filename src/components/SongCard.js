import React from 'react';
import '../styles/SongCard.css';

class SongCard extends React.Component {
    onCardClick() {
        //console.log(this.props.name)
    }

    render() {
        return (
            <div className="Result-card" onClick={this.props.buttonClick}>
                <table className="Card-table">
                    <tr className="Class-row">
                        <td rowSpan="0" className="Col-art">
                            <img className="Album-art" src={this.props.artwork} alt="album artwork"></img>
                        </td>
                        <div>
                        </div>
                        <td className="Song-info">
                            <div className="Info-name" >{this.props.name}</div>
                            <div className="Info" >{this.props.album}</div>
                            <div className="Info">{this.props.artist}</div>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }

}

export default SongCard;