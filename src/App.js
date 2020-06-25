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

  retrieve() {
    fetch('https://ghibliapi.herokuapp.com/films')
        .then(response => response.json())
        .then(data => this.setState({
          films: data
        }))
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
              <button onClick={() => this.retrieve()}>Retrieve Data</button>
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
