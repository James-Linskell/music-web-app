import React from 'react';
import FetchTrackFeatures from "../components/FetchTrackFeatures";
import "../styles/SongResultsPage.css";
import {Bar, HorizontalBar} from 'react-chartjs-2';
import SongCard from "../components/SongCard";
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// https://www.youtube.com/watch?v=-qOe8lBAChE
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        lineHeight: "25px",
        textAlign: "center",
    },
    arrow: {
        color: theme.palette.common.white,
    }
}))(Tooltip);

// this.props.location.search gives the song id!!!
class SongResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rawFeatures: [],
            rawAnalysis: [],
            rawTrack: {
                album: {
                    id: "null"
                },
                available_markets: []
            },
            rawAlbum: [],
            data: [],
            options: [],
            prompt: null,
            invalid: false,
            modality: "",
            songCard: null,
            bgImage: null,
            explicit: null,
            live: null,
            instrumental: null,
            musicality: null,
            key: null,
            artists: null
        }
    }

    componentDidMount = async () =>  {
        await this.waitForFeatures();
        await this.waitForAnalysis();
        await this.waitFortrack();
        await this.waitForAlbum();
        this.generateSongFeatures();
        this.setState({
            bgImage: <img
            src={this.state.rawTrack.album.images[0].url}
            style={{width: "100vw", height: "auto", overflow: "hidden", display: "block"}} alt="album art"
            />
        })
    }

    waitFortrack = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'tracks/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        console.log(data);
        this.setState({rawTrack: data});
        let name = data.name;
        let album = data.album.name;
        let artist = data.artists[0].name;
        // Truncate info if it is too long to fit on card:
        if (data.name.length > 30) {
            name = data.name.substring(0, 30) + '...'
        }
        if (data.album.name.length > 20) {
            album = data.album.name.substring(0, 20) + '...'
        }
        if (data.artists[0].name.length > 40) {
            artist = data.artists[0].name.substring(0, 40) + '...'
        }
        let expl = "Unknown";
        if (data.explicit === true) {
            expl = "Yes";
        } else {
            expl = "No";
        }
        let artists = "";
        data.artists.forEach(artist => {
                artists += artist.name + ", "
        });
        // Remove final comma:
        artists = artists.substring(0, (artists.length) - 2);
        this.setState({
            songCard: <SongCard
                name={name}
                album={album}
                artist={artist}
                artwork={this.state.rawTrack.album.images[1].url}
            />,
            explicit: expl,
            artists: artists,
        })

    };

    waitForFeatures = async () => {
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'audio-features/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        let live = "Maybe";
        if (data.liveness < 0.5) {
            live = "No"
        } else if (data.liveness > 0.5) {
            live = "Yes"
        }
        let acoustic = "Maybe";
        if (data.acousticness < 0.3) {
            acoustic = "No";
        } else if (data.acousticness < 0.5) {
            acoustic = "Maybe";
        } else {
            acoustic = "Yes";
        }
        let instrumental = "Unknown";
        if (data.instrumentalness < 0.5) {
            instrumental = "No";
        } else {
            instrumental = "Yes";
        }
        let musicality = "Unknown";
        if (data.speechiness < 0.33) {
            musicality = "Musical";
        } else if (data.speechiness < 0.66){
            musicality = "Musical and spoken";
        } else {
            musicality = "Spoken word";
        }
        let key = "Unknown";
        if (data.key === 0) {
            key = "C";
        } else if (data.key === 1) {
            key = "C #";
        } else if (data.key === 2) {
            key = "D";
        } else if (data.key === 3) {
            key = "D #";
        } else if (data.key === 4) {
            key = "E";
        } else if (data.key === 5) {
            key = "F";
        } else if (data.key === 6) {
            key = "F #";
        } else if (data.key === 7) {
            key = "G";
        } else if (data.key === 8) {
            key = "G #";
        } else if (data.key === 9) {
            key = "A";
        } else if (data.key === 10) {
            key = "A #";
        } else if (data.key === 11) {
            key = "B";
        }
        console.log(data);
        this.setState({
            rawFeatures: data,
            live: live,
            acoustic: acoustic,
            instrumental: instrumental,
            musicality: musicality,
            key: key
        });
        if (data.mode === 1) {
            this.setState({modality: "Major"})
        } else if (data.mode === 0) {
            this.setState({modality: "Minor"})
        }
    };

    waitForAnalysis = async () => {
        if (this.state.invalid === true) {
            return;
        }
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(songId.substring(1, songId.length), 'audio-analysis/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        this.setState({rawAnalysis: data});
    };

    waitForAlbum = async () => {
        if (this.state.invalid === true) {
            return;
        }
        const songId = this.props.location.search;
        const data = await FetchTrackFeatures.fetchData(this.state.rawTrack.album.id, 'albums/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        console.log(data);
        this.setState({
            rawAlbum: data,
        });
    };

    generateSongFeatures() {
        const chartData = {
            labels: ["Danceability", "Energy", "Happiness"],
            datasets: [{
                label: "Song features",
                backgroundColor: 'darkred',
                borderColor: 'rgb(255, 99, 132)',
                data: [(this.state.rawFeatures.danceability * 10).toFixed(2), (this.state.rawFeatures.energy * 10).toFixed(2),
                    (this.state.rawFeatures.valence * 10).toFixed(2)]
            }]
        }
        const chartOptions = {
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        return data['datasets'][0]['data'][tooltipItem['index']];
                    },
                },
                backgroundColor: '#FFF',
                titleFontSize: 16,
                titleFontColor: '#0066ff',
                bodyFontColor: '#000',
                bodyFontSize: 14,
                displayColors: false,
            },
            legend: {
                display: false,
                labels: {
                    fontColor: "white",
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: true,
                        fontColor: "white",
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                xAxes: [{
                    barPercentage: 0.5,
                    ticks: {
                        fontColor: "white",
                        fontSize: 14,
                        min: 0,
                        max: 10,
                        stepSize: 1
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            },
        }
        this.setState({
            data: chartData,
            options: chartOptions
        })
    }

    render() {
        return (
            <div className="Main">
                <div style={{opacity: 0.7, position: "absolute", zIndex: "-2", width: "100vw", overflow: "hidden"}}>
                    {this.state.bgImage}{this.state.bgImage}{this.state.bgImage}
                </div>
                <div className="Header">
                    <p>Song Analysis</p>
                    <p id="Song-card">{this.state.songCard}</p>
                </div>
                <div className="Container">
                    <div style={{display: "flex", fontSize: "2.5vh", padding: "1vh", textAlign: "left", paddingLeft: "3vh", alignContent: "left"}}><InfoOutlinedIcon style={{paddingRight: "0.3vw"}} /> Hover over an item for more information.</div>
                    <div>
                        <h2>Song Mood Features:<button style={{display: "flex", marginLeft: "2vw"}}>What's this?</button></h2>
                        <hr/>
                        <p>
                            <HorizontalBar className="Chart" data={this.state.data} options={this.state.options}/>
                        </p>
                    </div>
                    <div>
                        <h2 style={{marginBottom: "0vh"}}>Musical information:</h2>
                        <p style={{fontSize: "1.9vh", marginLeft: "2vh"}}/>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Tempo of the song in beats per minute.
                        </p>}>
                            <p>Tempo: {Math.round(this.state.rawFeatures.tempo)} bpm</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Time signature of the song.
                        </p>}>
                            <p>Time signature: {this.state.rawFeatures.time_signature}/4</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Musical key of the song.
                        </p>}>
                            <p>Key: {this.state.key}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Modality of the song (Major or Minor).
                        </p>}>
                            <p>Modality: {this.state.modality}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Whether the song is acoustic or not. Spotify gives songs an 'Acousticness' rating on a scale of 0.0 - 1.0.
                            The closer to 1.0 this value is, the higher the probability that the track is acoustic. The Acousticness rating
                            for this track is {this.state.rawFeatures.acousticness}.
                        </p>}>
                            <p>Acoustic: {this.state.acoustic}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Whether the song is instrumental, or contains vocals. 'Instrumentalness' is given on a scale of 0.0 - 1.0.
                            The closer to 1.0 this value is, the higher the probability that the track is purely instrumental. The
                            'Instrumentalness' rating for this song is {this.state.rawFeatures.liveness}.
                        </p>}>
                        <p>Instrumental: {this.state.instrumental}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            The musicality of a song is a measure of whether it contains music or people talking. 'Speechiness' is given on a scale of 0.0 - 0.1,
                            and songs with high Speechiness are less musical and contain more spoken words. For example, a podcast would have a 'Speechiness'
                            value greater than 0.66, and a normal song containing singing would have a value below 0.33. Rap and poetry fall somewhere in the middle.
                            The possibilities for Musicality are "Musical", "Musical and spoken", or "Spoken word". This track has a Speechiness value
                            of {this.state.rawFeatures.speechiness}.
                        </p>}>
                        <p>Musicality: {this.state.musicality}</p>
                        </LightTooltip>
                        <hr/>
                    </div>
                    <div>
                        <h2>Song details:</h2>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            The name of the song.
                        </p>}>
                            <p>Name: {this.state.rawTrack.name}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            All artists who created and collaborated on the song.
                        </p>}>
                            <p>Artists: {this.state.artists}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Whether the lyrics contain explicit content or not..
                        </p>}>
                            <p>Explicit lyrics: {this.state.explicit}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            How popular the song is. This is a number between 0 and 100, with 100 being the most popular.
                            Popularity is based on the total number of recent plays, meaning songs which were popular in the
                            past might now have a low popularity rating. The popularity is relative, with the most popular
                            song on Spotify having a popularity of 100, so songs with popularity ratings that seem quite low may actually
                            be relatively popular.
                        </p>}>
                            <p>Popularity: {this.state.rawTrack.popularity}</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Length of the song.
                        </p>}>
                            <p>Length: {((this.state.rawFeatures.duration_ms) / 1000 / 60).toFixed(2)} minutes</p>
                        </LightTooltip>
                        <hr/>
                        <LightTooltip arrow="true" enterTouchDelay="100" title={<p className="Tooltip">
                            Whether the song is live or not. This is determined by the amount of 'audience noise' detected in the recording,
                            on a scale of 0.0 - 1.0. The 'Liveness' rating for this track is {this.state.rawFeatures.liveness}.
                        </p>}>
                            <p>Live: {this.state.live}</p>
                        </LightTooltip>
                        <hr/>
                    </div>
                    <div style={{paddingBottom: "0vh", marginBottom: "0vh"}}>
                        <h2>Album preview:</h2>
                        <hr/>
                        <iframe
                            src={"https://open.spotify.com/embed/album/" + this.state.rawTrack.album.id}
                            width="350"
                            height="350"
                            frameBorder="0"
                            allowTransparency="true"
                            allow="encrypted-media"
                        ></iframe>
                    </div>
                    <div>
                        <h2>Album details:</h2>
                        <hr/>
                        <p>Name: {this.state.rawAlbum.name}</p>
                        <hr/>
                        <p>Release date: {this.state.rawAlbum.release_date}</p>
                        <hr/>
                        <p>Popularity: {this.state.rawAlbum.popularity}</p>
                        <hr/>
                        <p>Type: {this.state.rawAlbum.album_type}</p>
                        <hr/>
                        <p>Record label: {this.state.rawAlbum.label}</p>
                        <hr/>
                    </div>
                    <div>
                        <h2>Available regions:</h2>
                        <hr/>
                        <p style={{justifyContent: "center", display: "flex"}}>
                            <ComposableMap style={{color: "white", height: "42vh", marginRight: "2vw"}}>
                                <Geographies geography="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json">
                                    {({geographies}) => geographies.map(geo => {
                                            const d = this.state.rawTrack.available_markets.find(s => s === geo.properties.ISO_A2);
                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={d ? "darkred" : "white"}
                                                />
                                            );
                                        }
                                    )}
                                </Geographies>
                            </ComposableMap>
                        </p>
                    </div>
                    <div>
                        <h2>Mood features explained:</h2>
                        <hr/>
                        <p>All mood feature data is taken from Spotify, who use algorithms to calculate the numbers shown.</p>
                        <h2>Energy</h2>
                        <p>
                            The 'Energy' of a song determines how energetic the song feels, and is a measure of intensity and musical activity, with energetic
                            tracks feeling fast, busy and noisy. Energy is calculated by taking into account the dynamic range,
                            the loudness, the timbre, and the onset rate (rate of notes played). Energy is determined on a scale of 0 - 10,
                            with 10 being the most energetic.
                        </p>
                        <h2>Danceability</h2>
                        <p>
                            The 'Danceability' of a song describes how good a track is to dance to. This takes into account
                            a number of musical elements including tempo, how stable the rhythm is, the strength of each beat,
                            and how regular the musical pattern is. Dancibility is determined on a scale of 0 - 10, with 10 being
                            the most danceable.
                        </p>
                        <h2>Happiness</h2>
                        <p>
                            The happiness or 'Valence' of a song is how positive it sounds. Tracks with high valence sound more positive
                            (happy, cheerful, euphoric) while tracks with low valence sound more negative (sad, depressed, angry).
                            Happiness is determined on a scale of 0 - 10, with 10 being the most positive sounding.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default SongResultsPage;