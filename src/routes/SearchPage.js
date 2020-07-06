import React from 'react';
import hellify from '../hellify.png';
import '../styles/SearchPage.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CardMaker from '../components/CardMaker';
import FetchSearchData from '../components/FetchSearchData';
import SongCard from "../components/SongCard";
import {Redirect} from 'react-router-dom';

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
      results: <div className="Margin" ></div>
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
  }

  /**
   * Fetches the static node server which serves the webapp.
   */
  componentDidMount() {
    fetch('/');
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
    //return;

    this.waitForFetch();
  }

  waitForFetch = async () => {
    // Set timeout for 'searching' message to appear:
    setTimeout(() => {
      this.setState({
        results:
            <div className="Margin" >
              Searching for results...
            </div>
      });
    }, 1000);
    const data = await FetchSearchData.fetchData(this.state.searchQuery, 'track');
    // Clear all timeouts (as search is complete):
    let id = setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
    }
    this.setState({songListRaw: data})
    // Error handling if no search results are returned:
    if (data.tracks.items.length === 0) {
      this.setState({
        results:
            <div className="Margin" >
              No results found!
            </div>
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
            </header>
            {this.state.results}
          </div>
        </Router>
    );
  }
}

export default SearchPage;
