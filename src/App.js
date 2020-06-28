import React from 'react';
import logo from './logo.svg';
import hellify from './hellify.png';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: null,
      token: 'NO_TOKEN(CLIENT)',
      films: [],
    }
  }

  componentDidMount() {
    this.callMyAPI()
        .then(res => this.setState({
          test: res.express,
          token: res.myToken
        }))
        .catch(err => console.log(err));
  }

  // Calls the node.js Express server
  callMyAPI = async () => {
    const response = await fetch('/authenticate');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  getAccess() {
    var client_id = '9921383d96874fd99c7747a000d97483'; // Your client id
    var client_secret = '57e54ccba90143178aa912eafa2616d8'; // Your secret
    //var redirect_uri = 'http://localhost:3000'; // Your redirect uri

    var accessToken = 'BQCPA9KtEp3A_b1kDn1sosY8q4UjoJiA9ILEx3K0G-lE3fP54UMw-9WCgHVnTBsk3dtkQRZ1c7QfFgXhMi2C-mIKuphkNxMvjbn9ei3GhTmRyVKWThMUX8x7_O2PuG8_foWt0m5GHw'
    // Generated access token: 'BQDDFdq3i0NIuXUFACZAyW9trJiaofAxPCryawQ1dzom6izsS9YrV9p_elzVrbyzeAfzL1BWS9XARxDrMdW5ptgl0JcvYoaGBRwviDMihsfjio74SD9igsoLvNPYHNLIBKanhDHC_Q'
    var myOptions = {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'client_credentials',
        encode: 'form',
        Authorization: 'Basic' + new Buffer(client_id + ':' + client_secret).toString('base64'),
            //('Basic' + btoa(client_id + ':' + client_secret)),
        Content_Type: 'application/x-www-form-urlencoded'
        //client_id: client_id,
        //client_secret: client_secret,
      }),
      json: true
    };

    fetch('https://accounts.spotify.com/api/token', myOptions)
        //.then(response => response.json())
        //.then(json => console.log(json))
        .catch(err => {
          console.error('Error with fetch');
          console.error(err);
        });
  }

  retrieve() {
    fetch('https://api.spotify.com/v1/tracks/6dsq7Nt5mIFzvm5kIYNORy')
    //fetch('https://api.spotify.com/v1/tracks/4m0Vgr48VFaMYw0Sp1ozJu')
        .then(response => response.json())
        .then(data => this.setState({
          films: data
        }))
        // For debug purposes
        .then(() => console.log(this.state.films))
        //.then(() => this.displayData())
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
            <img src={hellify} className="App-logo" alt="logo"/>
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
              <button onClick={() => this.getAccess()}>Retrieve Data</button>
            </p>
            <div className="card">
              <div className="card-body">
                <p className="card-title">Film List</p>
                <p className="card-text">{this.state.test}</p>
                <p>{this.state.token}</p>
              </div>
            </div>
          </header>
        </div>
    );
  }
}

export default App;
