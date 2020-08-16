import React from 'react';
import hellify from '../hellify.png';
import '../styles/SearchPage.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FetchData from '../Helpers/FetchData';
import SongCard from "../components/SongCard";
import GenerateInfo from '../Helpers/GenerateInfo'

/**
 * Module for Search Song screen. Shows a search box to search for a song.
 */
class SongSearchPage extends React.Component {
  /**
   * Sets default state values.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      token: 'NO_TOKEN(CLIENT)',
      songListRaw: null,
      simplifiedSongList: null,
      searchQuery: '',
      previousSearchQuery: '',
      results: <div className="Margin" ></div>,
      prompt: null,
      title: "",
      searchTitle: "Search for a song to get started."
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
  }

  /**
   * Checks if the Song Search page is being loaded from the Song Analyser or Playlist analyser. This page has the same
   * functionality either way, but the title changes.
   */
  componentDidMount() {
    if (this.props.chain === "song") {
      this.setState({
        title: "Song Analyser",
        searchTitle: "Search for a song by name, artist or album to get started."
      });
    } else {
      this.setState({
        title: "Playlist Analyser",
        searchTitle: "First choose a song, then choose a playlist. Search for a song by name, artist or album to get started."
      });
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

  /**
   * Fetches song search results from the Spotify web API using the FetchData helper class. Throws an error and alerts
   * user if the network connection failed. Sets a timeout for 'Searching for results...' prompt. This allows the results
   * to be loaded instantly with no loading promp if the client has a fast network connection which looks cleaner,
   * or displays a loading prompt if the search takes more than 1 second.
   */
  waitForFetch = async () => {
    // Set timeout for 'searching' message to appear:
    setTimeout(() => {
      this.setState({
        prompt: "Searching for results..."
      });
    }, 1000);
    // Get search results:
    const data = await FetchData.fetchData(this.state.searchQuery, 'search','track').catch((error) => {
      // If any fetch error occurred (eg. network or json parsing error), throw error, alert user and navigate home:
      this.props.history.push({
            pathname: '/404',
          }
      );
      alert(error);
    });
    // If any other error occurred:
    if (typeof data === "undefined") {
      this.props.history.push({
            pathname: '/404',
          }
      );
      return;
    }
    // Clear all timeouts (as search is complete):
    let id = setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
      this.setState({
        prompt: null
      });
    }
    // Set state to returned data:
    this.setState({songListRaw: data})
    if (data.tracks.items.length === 0) {
      this.setState({
        prompt: "No results found!",
        results: <div className="Margin" ></div>
      });
      return;
    }
    const songs = GenerateInfo.generateSongInfo(data.tracks.items);
    this.setState({simplifiedSongList: songs});
    this.setState({
      results:
          <div className="Cards" >
            {this.populateGrid(this.state.simplifiedSongList)}
          </div>
    })
  };

  /**
   * When a song card is clicked, redirect to the results page passing the song id as the react router
   * history object prop 'props.location.search', as well as the chosen song data. Redirects to Song Results Page
   * if loaded from the Song Analyser, ot Playlist Search Page if loaded from the Playlist Analyser.
   * @param songId
   * @param name
   * @param album
   * @param artist
   * @param art
   */
  onCardClick(songId, name, album, artist, art) {
    if (this.props.chain === "song") {
      this.props.history.push({
        pathname: '/songs',
        search: songId
      });
    }
    if (this.props.chain === "playlist") {
      this.props.history.push({
        pathname: '/song-playlist',
        search: songId,
        state: {
          name: name,
          album: album,
          artist: artist,
          art: art
        }
      });
    }
    window.scrollTo(0, -document.body.scrollHeight);
  }

  /**
   * Creates a grid of Song Cards for returned search results.
   * @param data list of song ids
   * @returns cardGrid component constant (not a true React component)
   */
  populateGrid(data) {
    // Else generate cards.
    if (data == null) {
      return null;
    }
    var cardGrid = [];
    for (var i=0; i < data.length; i++) {
      // Although there is a function for this in the Node server, it is duplicated here as there is a loop which renders
      // react components, which is the most efficient way to do this in terms of both latency and processing:
      let name = data[i].name;
      let album = data[i].album;;
      let artist = data[i].artist;
      let songId = data[i].songId;
      // Truncate info if it is too long to fit on card:
      if (data[i].name.length > 30) {
        name = data[i].name.substring(0, 30) + '...'
      }
      if (data[i].album.length > 20) {
        album = data[i].album.substring(0, 20) + '...'
      }
      if (data[i].artist.length > 40) {
        artist = data[i].artist.substring(0, 40) + '...'
      }

      cardGrid.push(
          <p key={i} className="Card-p"><SongCard
              buttonClick={this.onCardClick.bind(this, songId, name, album, artist, data[i].art)}
              name={name}
              album={album}
              artist={artist}
              artwork={data[i].art}
              songId={songId}
          /></p>
      )
    }
    return cardGrid;
  }

  /**
   * Renders Song Search Page.
   * @return {component} SongSearchPage
   */
  render() {
    return (
        <Router>
          <div className="Search">
            <header className="Search-header" >
              <p className="Title">{this.state.title}</p>
              <img src={hellify} className="Search-logo" alt="logo"/>
              <p>{this.state.searchTitle}</p>
              <div className="searchbar">
                <form onSubmit={this.handleSubmit}>
                  <input className="Search-box" type="text" value={this.state.value} placeholder="Search..." onChange={this.handleChange}></input>
                  <button id="searchclick" type="submit">Search</button>
                </form>
              </div>
              <div style={{marginTop: "3vh", position: "absolute", top: "50vh"}}>
                {this.state.prompt}
              </div>
            </header>
            <div style={{marginTop: "4vh"}}>
              {this.state.results}
            </div>
          </div>
        </Router>
    );
  }
}

export default SongSearchPage;
