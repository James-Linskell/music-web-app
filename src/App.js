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
    }
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

  // Calls the node.js Express server to return the Spotify client token
  getToken = async () => {
    const response = await fetch('/authenticate');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  retrieve = async () => {
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

    const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DWWvhKV4FBciw', myOptions)
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
              <p>
                <input type="text" placeholder="Search.."></input>
                <button id="searchclick" onClick={() => this.retrieve()}>Search</button>
              </p>
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
