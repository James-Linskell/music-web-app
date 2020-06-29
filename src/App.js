import React from 'react';
import hellify from './hellify.png';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: null,
      token: 'NO_TOKEN(CLIENT)',
      songs: [],
      searchQuery: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // FOR DEBUG: Call my API on page refresh
  componentDidMount() {
    /*this.getToken()
        .then(res => this.setState({
          test: res.express,
          token: res.myToken
        }))
        .catch(err => console.log(err));*/
    /*this.setState({
      token: '',
      songs: ''
    })*/
  }

  handleChange(event) {
    //console.log(event.target.value);
    this.setState({ searchQuery: event.target.value });
    //console.log(this.state.searchQuery);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.fetchData();
  }

  // Calls the node.js Express server to return the Spotify client token
  getToken = async () => {
    const response = await fetch('/authenticate');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

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
          songs: data.name
        });
    this.displayData();
    //2WRmxGFCK8b8oujhfK80TI
    //55odIfJy7sm2HkHf3n9Gha
  }

  displayData() {
    /*this.state.songs.forEach(song =>
        console.log(song.title)
    )*/

  }

  render() {
    return (
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
          </header>
          <div>
            <p className="card-text">{this.state.test}. {this.state.token}</p>
          </div>
        </div>
    );
  }
}

export default App;
