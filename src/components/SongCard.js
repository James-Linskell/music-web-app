import React from 'react';
import '../styles/SongCard.css';

/**
 * Creates a custom SongCard component which displays the data for a song and the album artwork in a small container.
 */
class SongCard extends React.Component {
    /**
     * Renders the SongCard component.
     * @return <SongCard/>
     */
    render() {
        return (
            <div className="Result-card" onClick={this.props.buttonClick}>
                <div className="Container-song">
                    <div>
                        <img className="Album-art" src={this.props.artwork} alt="album artwork"></img>
                    </div>
                    <div className="Song-info">
                            <p className="Info-name" >{this.props.name}</p>
                            <p className="Info" >{this.props.album}</p>
                            <p className="Info">{this.props.artist}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SongCard;