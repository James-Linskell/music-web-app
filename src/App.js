import React from 'react';
import hellify from './hellify.png';
import './styles/App.css';
import SearchResult from "./components/SearchResult";
import { BsChevronDoubleDown } from "react-icons/bs";
import { Router, Route } from "react-router";
import CardMaker from './components/CardMaker';

class App extends React.Component {
  /**
   * Default constructor for main app.
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      test: null,
      test1: null,
      token: 'NO_TOKEN(CLIENT)',
      songListRaw: null,
      simplifiedSongList: null,
      searchQuery: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // For when something re-renders.
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
    this.fetchData();
  }


  /**
   * Calls my node server which requests a Spotify client access token.
   * @returns {Promise<any>} Json body containing Spotify client token and test message
   */
  getToken = async () => {
    const response = await fetch('/authenticate');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  /**
   * Calls Spotify API using token.
   * @returns {Promise<void>}
   */
  fetchData = async () => {
    const requestToken = await this.getToken();
    this.setState({
      test: requestToken.express,
      token: requestToken.myToken
    })
    var myOptions = {
      headers: {
        Authorization: 'Bearer ' + this.state.token
      }
    }

    const endpoint = 'https://api.spotify.com/v1/search?';
    const query = 'q=' + this.state.searchQuery;
    const type = '&type=track';
    const url = endpoint + query + type;

    const response = await fetch(url, myOptions)
    const data = await response.json();
    console.log(data);
    this.setState({
      songListRaw: data
    });
    this.displayData();
    this.generateSongInfo();
    //2WRmxGFCK8b8oujhfK80TI
    //55odIfJy7sm2HkHf3n9Gha
    //TEST
    const response1 = await fetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', myOptions)
    const data1 = await response1.json();
    console.log(data1);
  }

  /**
   * Displays data fetched from spotify.
   */
  displayData() {
    /*this.state.songList.forEach(song =>
        console.log(song.title)
    );*/
    this.state.songListRaw.tracks.items.forEach(song =>
            console.log(song.name)
    );
  }

  generateSongInfo() {
    const songs = []
    // Add truncation of long titles.
    this.state.songListRaw.tracks.items.forEach(song => {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          album: song.album.name,
          art: song.album.images[1].url
        });
        //console.log(song.name);
        //console.log(song.artists[0].name);
        //console.log(song.album.name);
      }
    );
    this.setState({simplifiedSongList: songs})
    console.log(songs);
  }

  /**
   * Renders main page to the DOM.
   */
  render() {
    return (
        /* For when we add routes. Replace everything on this page with these few lines.
         * <Router>
         *  <Route path={"user"} component={User} />
         *  <Route path={"home"} component={Home} />
         * <Router>
         *
         */
        <div className="App">
          <header className="App-header">
            <img src={hellify} className="App-logo" alt="logo"/>
            <p>Search for a song to get started!</p>
            <div className="searchbar">
              <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.value} placeholder="Search.." onChange={this.handleChange}></input>
                <button id="searchclick" type="submit">Search</button>
              </form>
            </div>
            <div>
              {this.state.songs}
            </div>
            <footer id="Scroll-div"><BsChevronDoubleDown id="Scroll-icon" size="3vmin" /></footer>
          </header>

          <div id="test">
            <p>{this.state.test1}</p>
          </div>

          <div className="Cards">
            <CardMaker data={this.state.simplifiedSongList} />
          </div>
          <footer className="Footer">
            <p>{this.state.test}. {this.state.token}</p>
          </footer>
        </div>
    );
  }
}

export default App;
