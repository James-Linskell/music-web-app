import React from 'react';
import '../styles/AboutPage.css';

/**
 * Module for About screen. Contains some informative text.
 */
class AboutPage extends React.Component {
    /**
     * Renders About page.
     * @return {component} About
     */
    render() {
        return (
            <div className="About">
                <div className="About-title">About</div>
                <div className="About-info">
                    This site was created to give musicians and music lovers a greater insight into how Spotify processes
                    and analyses music. Spotify uses machine learning algorithms to process every song on its platform,
                    which allows them to make predictions about how "danceable", "energetic", "instrumental" or "positive" a
                    song sounds, as well as extracting musical features like the key and tempo, and many other features.
                    Although the details of these algorithms are protected intellectual property and kept secret, Spotify
                    does make the results of the analysis available for anyone to access from their web interface. This
                    website uses Spotify's web interface to interpret and visualise data for songs and playlists. The
                    Song Analyser lets you see detailed data for a single song, and the Playlist Analyser lets you compare
                    a song's features to all the other songs in a chosen playlist, calculating how well your song fits in
                    the playlist.
                </div>
                <div className="About-footer">
                    This site is not affiliated with Spotify. This site does not store any information about you.
                </div>
            </div>
        )
    }
}

export default AboutPage;