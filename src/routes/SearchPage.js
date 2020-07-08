import React from 'react';
import hellify from '../hellify.png';
import '../styles/SearchPage.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FetchSearchData from '../components/FetchSearchData';
import SongCard from "../components/SongCard";

class SearchPage extends React.Component {
  /**
   * Default constructor for main app.
   * @param props
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
      prompt: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
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
    const data = await FetchSearchData.fetchData(this.state.searchQuery, 'track');
    // Clear all timeouts (as search is complete):
    let id = setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
      this.setState({
        prompt: null
      });
    }
    this.setState({songListRaw: data})
    // Error handling if no search results are returned:
    if (data.tracks.items.length === 0) {
      this.setState({
        prompt: "No results found!",
        results: <div className="Margin" ></div>
      });
      return;
    }
    this.generateSongInfo();
    this.setState({
      results:
          <div className="Cards" >
            {this.populateGrid(this.state.simplifiedSongList)}
          </div>
    })
  };

  /**
   * When a song card is clicked, redirect to the results page passing the song id as the react router
   * history object prop 'props.location.search'.
   * @param songId
   */
  onCardClick(songId) {
    console.log("Click successful!! ID: " + songId)
    this.props.history.push({
      pathname: '/song',
      search: songId
    });
  }

  generateSongInfo() {
    const songs = []

    this.state.songListRaw.tracks.items.forEach(song => {
          songs.push({
            name: song.name,
            artist: song.artists[0].name,
            album: song.album.name,
            art: song.album.images[1].url,
            songId: song.id
          });
        }
    );
    this.setState({simplifiedSongList: songs})
  }

  populateGrid(data) {
    // Else generate cards.
    if (data == null) {
      return null;
    }
    var cardGrid = [];
    for (var i=0; i < data.length; i++) {

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
          <p key={i} ><SongCard
              buttonClick={this.onCardClick.bind(this, songId)}
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
   * Renders main page to the DOM.
   */
  render() {
    return (
        <Router>
          <div className="Search">
            <header className="Search-header" >
              <img src={hellify} className="Search-logo" alt="logo"/>
              <p>Search for a song to get started!</p>
              <div className="searchbar">
                <form onSubmit={this.handleSubmit}>
                  <input className="Search-box" type="text" value={this.state.value} placeholder="Search.." onChange={this.handleChange}></input>
                  <button id="searchclick" type="submit">Search</button>
                </form>
              </div>
              <div style={{marginTop: "3vh", position: "absolute", top: "35vh"}}>
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

export default SearchPage;
