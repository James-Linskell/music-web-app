import React from 'react';
import hellify from './hellify.png';
import './styles/App.css';
import { BsChevronDoubleDown } from "react-icons/bs";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CardMaker from './components/CardMaker';
import HomePage from "./routes/HomePage";
import ResultsPage from "./routes/ResultsPage";
import FetchSearchData from './components/FetchSearchData';

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
      currentRoute: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    this.setState({currentRoute: ResultsPage})
    this.waitForFetch();
  }

  waitForFetch = async () => {
    const data = await FetchSearchData.fetchData(this.state.searchQuery, 'track');
    this.setState({songListRaw: data})
    this.generateSongInfo();
    this.resultsStart.scrollIntoView({ behavior: "smooth"});
  };

  generateSongInfo() {
    const songs = []
    this.state.songListRaw.tracks.items.forEach(song => {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          album: song.album.name,
          art: song.album.images[1].url
        });
      }
    );
    this.setState({simplifiedSongList: songs})
  }

  /**
   * Renders main page to the DOM.
   */
  render() {
    return (
        <Router>
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
              <div id="routetest">
                {this.state.songs}
              </div>
              <footer id="Scroll-div"><BsChevronDoubleDown id="Scroll-icon" size="3vmin" /></footer>
            </header>

            <div>
              <Route path="/" exact component={this.state.currentRoute}/>
              <Route path="/home" component={HomePage}/>
            </div>
            <div className="Cards" ref={e1 => { this.resultsStart = e1; }}>
              <CardMaker data={this.state.simplifiedSongList} />
            </div>

            <footer className="Footer">
              <p>{this.state.test}. {this.state.token}</p>
            </footer>
          </div>
        </Router>
    );
  }
}

export default App;
