import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: []
    }
  }

  retrieve() {
    var parseJson = function(response) {
      return response.json();
    }

    fetch('https://ghibliapi.herokuapp.com/films')
        .then(
            function(response) {
              if (response.status !== 200) {
                console.log('error with GET url');
                return Promise.reject(new Error(response.statusText));
              }

              response.json().then(function (data) {
                console.log(data);
              });
            })
        .then(parseJson)
        .catch(err => {
          // error
        })

    // Declare the request object.
    var request = new XMLHttpRequest()
    var filmlist;
    // Open the request with GET
    request.open('GET', ' https://ghibliapi.herokuapp.com/films', true)
    // Do when request has completed
    request.onload = function() {
      // Access JSON data
      var data = JSON.parse(this.response)
      if (request.status >=200 && request.status < 400) {
        // Test it's working
        //data.forEach(movie => {
        //  console.log(movie.title)
        //})
        console.log('GET request successful')
        filmlist = data.title;
        console.log(filmlist)

      } else {
        console.log('error with GET url');
      }
    }
    request.send()
    this.setState({
      films: filmlist
    });
    console.log(this.state.films);
    console.log(filmlist);
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
              <button onClick={() => this.retrieve()}>Retrieve Data</button>
            </p>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Steve Jobs</h5>
                <h6 className="card-subtitle mb-2 text-muted">steve@apple.com</h6>
                <p className="card-text">Stay Hungry, Stay Foolish</p>
              </div>
            </div>
          </header>
        </div>
    );
  }
}

export default App;
