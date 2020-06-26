import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
    }
  }

  authorise() {
    var client_id = 'CLIENT_ID'; // Your client id
    var client_secret = 'CLIENT_SECRET'; // Your secret
    var redirect_uri = 'REDIRECT_URI'; // Your redirect uri

    var accessToken = 'BQCPA9KtEp3A_b1kDn1sosY8q4UjoJiA9ILEx3K0G-lE3fP54UMw-9WCgHVnTBsk3dtkQRZ1c7QfFgXhMi2C-mIKuphkNxMvjbn9ei3GhTmRyVKWThMUX8x7_O2PuG8_foWt0m5GHw'
    // Generated access token: 'BQDDFdq3i0NIuXUFACZAyW9trJiaofAxPCryawQ1dzom6izsS9YrV9p_elzVrbyzeAfzL1BWS9XARxDrMdW5ptgl0JcvYoaGBRwviDMihsfjio74SD9igsoLvNPYHNLIBKanhDHC_Q'
    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors',
      cache: 'default'
    };
    fetch('https://api.spotify.com/v1/tracks/6dsq7Nt5mIFzvm5kIYNORy', myOptions )
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => {
          console.error('Error with fetch');
          console.error(err);
        });
  }

  retrieve() {
    fetch('https://open.spotify.com/playlist/37i9dQZF1DX8SIpKv9qw6x')
        .then(response => response.json())
        .then(data => this.setState({
          films: data
        }))
        // For debug purposes
        .then(() => console.log(this.state.films))
        .then(() => this.displayData())
        .catch(err => {
          console.error('Error with fetch');
          console.error(err);
        });
  }

  displayData() {
    this.state.films.forEach(film =>
        console.log(film.title)
    )
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
            <p>
              <button onClick={() => this.authorise()}>Retrieve Data</button>
            </p>
            <div className="card">
              <div className="card-body">
                <p className="card-title">Film List</p>
                <ul className="card-text">List goes here</ul>
              </div>
            </div>
          </header>
        </div>
    );
  }
}

export default App;
