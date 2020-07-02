import React from 'react';
import '../styles/SearchResult.css';

class SearchResult extends React.Component {
    render() {
        return (
            <div className="Result-card">
                <table className="Card-table">
                    <tr className="Class-row">
                        <td rowSpan="0" className="Col-art">
                            <img className="Album-art" src={this.props.artwork} alt="album artwork"></img>
                        </td>
                        <div style={{opacity: 0.25, position: "absolute", maxWidth: "21vh", maxHeight: "18vh", overflow: "hidden", textIndent: "-10vh"}}>
                        <img src={this.props.artwork} style={{height: "45vh", width: "45vh"}} alt="album art"/>
                        </div>
                        <td className="Song-info">
                            <div className="Info-name" >{this.props.name}</div>
                            <div className="Info" >{this.props.album}</div>
                            <div className="Info">{this.props.artist}</div>
                        </td>
                        <div style={{backgroundImage: "url(" + this.props.artwork + ")", opacity: 0.2}}>

                        </div>
                    </tr>
                </table>
            </div>
        );
    }

}

export default SearchResult;