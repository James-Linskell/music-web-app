import React from 'react';
import hellify from '../hellify.png';
import '../styles/SearchPage.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FetchData from '../Helpers/FetchData';
import SongCard from "../components/SongCard";
import GenerateInfo from "../Helpers/GenerateInfo";

class PlaylistSearchPage extends React.Component {
    /**
     * Default constructor for main app.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            token: 'NO_TOKEN(CLIENT)',
            playlistsRaw: null,
            playlistIds: null,
            searchQuery: '',
            previousSearchQuery: '',
            results: <div className="Margin"></div>,
            prompt: null,
            propsToState: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
    }

    componentDidMount() {
        if (typeof this.props.location.state !== "undefined") {
            this.setState({propsToState: this.props.location.state})
            return;
        } else {
            this.props.history.push({
                    pathname: '/404',
                }
            );
        }
    }

    /**
     * Updates the state {searchQuery} whenever a letter is typed in the search box.
     * @param onChange event for search box input
     */
    handleChange(event) {
        this.setState({ searchQuery: event.target.value });
    }

    /**
     * Handles submit of search query.
     * @param onSubmit event for search submit.
     */
    handleSubmit = event => {
        event.preventDefault();
        // Don't fetch if there is no query:
        if (this.state.searchQuery === "") {
            return;
        }
        this.setState({previousSearchQuery: this.state.searchQuery})
        if (this.state.searchQuery == this.state.previousSearchQuery) {
            return
        }

        this.waitForFetch();
    }

    waitForFetch = async () => {
        // Set timeout for 'searching' message to appear:
        setTimeout(() => {
            this.setState({
                prompt: "Searching for results..."
            });
        }, 1000);
        // Fetch search data:
        const data = await FetchData.fetchData(this.state.searchQuery,'search','playlist');
        // Clear all timeouts (as search is complete):
        let id = setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
            this.setState({
                prompt: null
            });
        }
        // Set state to returned data:
        this.setState({playlistsRaw: data})
        // Error handling if no search results are returned:
        if (data.playlists.items.length === 0) {
            this.setState({
                prompt: "No results found!",
                results: <div className="Margin" ></div>
            });
            return;
        }
        const playlists = GenerateInfo.generatePlaylistInfo(this.state.playlistsRaw.playlists.items);
        this.setState({playlistIds: playlists});
        this.setState({
            results:
                <div className="Cards" style={{gridGap: "5vh"}}>
                    {this.populateGrid(this.state.playlistIds)}
                </div>
        })
    };

    /**
     * When a song card is clicked, redirect to the results page passing the song id as the react router
     * history object prop 'props.location.search'.
     * @param songId
     */
    onCardClick(playlistId, name, album, artist, art) {
        this.props.history.push({
            pathname: '/playlists',
            search: this.props.location.search,
            hash: playlistId,
            state: {
                name: name,
                album: album,
                artist: artist,
                art: art
            }
        });
    }

    populateGrid(data) {
        // Else generate cards.
        if (data == null) {
            return null;
        }
        var cardGrid = [];
        for (var i=0; i < data.length / 2; i++) {

            let plId = data[i].playlistId;

            cardGrid.push(
                <p className="Playlist-p" key={i}>
                    <h2 onClick={this.onCardClick.bind(this, plId,
                        this.state.propsToState.name,
                        this.state.propsToState.album,
                        this.state.propsToState.artist,
                        this.state.propsToState.art
                    )}>
                        Select Playlist
                    </h2>
                    <p className="Playlist-p" >
                        <iframe
                            src={"https://open.spotify.com/embed/playlist/" + plId}
                            width="350"
                            height="350"
                            frameBorder="0"
                            allowTransparency="true"
                            allow="encrypted-media"
                        ></iframe>
                    </p>
                </p>
            )
        }
        return cardGrid;
    }

    /**
     * Renders main page to the DOM.
     */
    render() {
        return (
            <Router>
                <div className="Search">
                    <header className="Search-header" >
                        <div className="Grid">
                            <div>
                                <p>
                                    <img src={hellify} className="Search-logo" alt="logo"/>
                                </p>
                                <p>Search for a playlist</p>
                                <p></p>
                                <div className="searchbar">
                                    <form onSubmit={this.handleSubmit}>
                                        <input className="Search-box" type="text" value={this.state.value} placeholder="Search.." onChange={this.handleChange}></input>
                                        <button id="searchclick" type="submit">Search</button>
                                    </form>
                                </div>
                            </div>
                            <div>
                                <p>Song being analysed:</p>
                                <p className="Card-p"><SongCard
                                    name={this.state.propsToState.name}
                                    album={this.state.propsToState.album}
                                    artist={this.state.propsToState.artist}
                                    artwork={this.state.propsToState.art}
                                    songId={this.state.propsToState.songId}
                                /></p>
                            </div>
                        </div>
                        <div style={{marginTop: "3vh", position: "absolute", top: "50vh"}}>
                            {this.state.prompt}
                        </div>
                    </header>
                    {this.state.results}
                    <div id="footer" style={{height: "36.6vh"}}/>
                </div>
            </Router>
        );
    }
}

export default PlaylistSearchPage;