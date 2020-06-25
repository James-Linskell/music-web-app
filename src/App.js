import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      films: []
    }
  }

  retrieve() {
    var list = [];
    fetch('https://ghibliapi.herokuapp.com/films')
        .then(response => response.json())
        // Return the data within the JS object
        .then(function(data) {
          console.log(data);
          data.forEach(movie => {
            list.push(movie.title)
            console.log(movie.title)
          })
          console.log(list);
          this.setState({
            films: list
          })
        })
        .catch(err => {
          console.error('Error with fetch');
          console.error(err);
        });
    console.log(this.state.list);
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
