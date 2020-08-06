import React from 'react';
import FetchData from "../Helpers/FetchData";
import "../styles/SongResultsPage.css";
import {HorizontalBar} from 'react-chartjs-2';
import SongCard from "../components/SongCard";
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ColorThief from "color-thief";
import * as Vibrant from "node-vibrant";
import BackgroundSvgPaths from "../components/BackgroundSvgPaths";
import LightenColours from "../Helpers/LightenColours";

/**
 * Styles the Material-UI tooltips used on the page.
 * @type {React.ComponentType<Omit<JSX.LibraryManagedAttributes<*, React.ComponentProps<*>>, keyof ({theme: Theme} & {classes: ClassNameMap<ClassKeyOfStyles<"arrow"|"tooltip">>}) | {classes: ClassNameMap<ClassKeyOfStyles<"arrow"|"tooltip">>}> & StyledComponentProps<"arrow"|"tooltip">>}
 */
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
            artists: null,
            albumColours1: "rgba(0, 0, 10, 0.2)",
            albumColours2: "rgba(0, 0, 10, 0.2)",
            albumColours3: "rgba(0, 0, 10, 0.2)",
            albumColours4: "rgba(0, 0, 10, 0.2)",
            embedAlbum: null,
        }
    }

    componentDidMount = async () =>  {
        await this.waitForFeatures();
        await this.waitFortrack();
        await this.waitForAlbum();
        this.generateCharts();
        this.setBgColours();
    }

    /**
     * Pulls colour palette from the album artwork for the chosen song using Vibrant library, then sets the most prominent
     * colours to the page state. These colours are then rendered as the background once the promise has been fulfilled.
     */
    setBgColours() {
        // Get bg colours using Vibrant promise:
        const img = document.querySelector('img');
        img.crossOrigin = "Anonymous";
        const colorThief = new ColorThief();
        // Make sure image is finished loading
        img.addEventListener('load', function() {
            let colour = colorThief.getColor(img);
            Vibrant.from(img).getPalette()
                .then((palette) => {
                    console.log(palette);
                    let rgb1 = palette.Vibrant.getRgb();
                    let rgb2 = palette.DarkVibrant.getRgb();
                    let rgb3 = palette.DarkMuted.getRgb();
                    let rgb4 = palette.Muted.getRgb();
                    rgb1 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb1[0] + "," + rgb1[1] + "," + rgb1[2] + ")"));
                    rgb2 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb2[0] + "," + rgb2[1] + "," + rgb2[2] + ")"));
                    rgb3 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb3[0] + "," + rgb3[1] + "," + rgb3[2] + ")"));
                    rgb4 = LightenColours.RGB_Linear_Shade(0.3, ("rgb(" + rgb4[0] + "," + rgb4[1] + "," + rgb4[2] + ")"));
                    this.setState({
                        albumColours1: rgb1,
                        albumColours2: rgb2,
                        albumColours3: rgb3,
                        albumColours4: rgb4
                    })}
                )
        }.bind(this));
    }

    /**
     * Fetches track data from my API, pre-processes the data, and generates a song card of the data.
     */
    waitFortrack = async () => {
        const songId = this.props.location.search;
        const data = await FetchData.fetchData(songId.substring(1, songId.length), 'analysis', 'tracks/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }
        this.setState({
            rawTrack: data,
            embedAlbum: <iframe
                src={"https://open.spotify.com/embed/album/" + data.album.id}
                width="350"
                height="350"
                frameBorder="0"
                allowTransparency="true"
                allow="encrypted-media"
            ></iframe>
        });

        // Fetch my API endpoint for sorting and truncating track data for song card:
        const sortTrackData = await fetch('/api/songSort/truncate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let response = await sortTrackData.json();

        // Generate songcard and save it to state:
        this.setState({
            songCard: <SongCard
                name={response.name}
                album={response.album}
                artist={response.artist}
                artwork={this.state.rawTrack.album.images[1].url}
            />,
            explicit: response.expl,
            artists: response.artists,
        })

    };

    /*
 * todo:
 *  refactor some of this to helper
 */
    waitForFeatures = async () => {
        const songId = this.props.location.search;
        const data = await FetchData.fetchData(songId.substring(1, songId.length), 'analysis', 'audio-features/');
        // Error handling if no search results are returned:
        if (data.length === 0) {
            this.setState({
                prompt: "Invalid song ID",
                invalid: true
            });
            return;
        }

        // Fetch my API endpoint for sorting track feature data:
        const sortTrackData = await fetch('/api/songSort/sortFeatures', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let response = await sortTrackData.json();

        this.setState({
            rawFeatures: data,
            live: response.live,
            acoustic: response.acoustic,
            instrumental: response.instrumental,
            musicality: response.musicality,
            key: response.key
        });
        if (data.mode === 1) {
            this.setState({modality: "Major"})
        } else if (data.mode === 0) {
            this.setState({modality: "Minor"})
        }
    };

    /**
     * Calls the FetchData helper and returns album analysis results from Spotify for a given album id. Saves the album
     * data to state.
     */
    waitForAlbum = async () => {
        if (this.state.invalid === true) {
            return;
        }
        const songId = this.props.location.search;
        const data = await FetchData.fetchData(this.state.rawTrack.album.id, 'analysis', 'albums/');
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

    /**
     * Scrolls to the bottom of the page to bring the mood feature descriptions into view.
     */
    featureInfoClick() {
        window.scrollTo(0,document.body.scrollHeight);
    }

    /**
     * Calls the Node server which generates options for creating a chart of mood features, and saves these options to state.
     */
    generateCharts = async () => {
        // Fetch my API endpoint for generating track feature chart:
        const sortTrackData = await fetch('/api/songSort/generateChart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.rawFeatures)
        });
        let response = await sortTrackData.json();
        this.setState(response);
    }

    /**
     * Renders the song results page.
     */
    render() {
        return (
            <div className="Main" style={{backgroundColor: this.state.albumColours1}}>
                <div style={{width: "1vw", marginLeft: "-1vw"}}>
                    <BackgroundSvgPaths fill={this.state.albumColours2}/>
                    <BackgroundSvgPaths fill={this.state.albumColours3} shiftDown="-100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours4} shiftDown="100vh"/>
                    <BackgroundSvgPaths fill={this.state.albumColours2} shiftDown="200vh"/>
                </div>
                <div className="Header">
                    <p>Song Analysis</p>
                    <p id="Song-card">{this.state.songCard}</p>
                </div>
                <div className="Container">
                    <div style={{display: "flex", fontSize: "2.5vh", padding: "1vh", textAlign: "left", paddingLeft: "3vh", alignContent: "left"}}><InfoOutlinedIcon style={{paddingRight: "0.3vw"}} /> Hover over an item for more information.</div>
                    <div>
                        <h2>Song Mood Features:<button style={{display: "flex", marginLeft: "2vw"}} onClick={this.featureInfoClick}>What's this?</button></h2>
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
                            'Instrumentalness' rating for this song is {this.state.rawFeatures.instrumental}.
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
                        {this.state.embedAlbum}
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
                            and how regular the musical pattern is. Danceability is determined on a scale of 0 - 10, with 10 being
                            the most danceable.
                        </p>
                        <h2>Positivity</h2>
                        <p>
                            The positivity or 'Valence' of a song is how positive it sounds. Tracks with high valence sound more positive
                            (happy, cheerful, euphoric) while tracks with low valence sound more negative (sad, depressed, angry).
                            Positivity is determined on a scale of 0 - 10, with 10 being the most positive sounding.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default SongResultsPage;