import React from 'react';

/**
 * Takes song data as props and produces card elements for all data entered. Renders the card grid to he DOM.
 */
class CardMaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: Array({
                name: '',
                artist: '',
                album: '',
                art: null
            }),
        };
    }
}

export default CardMaker;