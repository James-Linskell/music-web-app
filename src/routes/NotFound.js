import React from 'react';
import '../styles/NotFound.css'

export default class NotFound extends React.Component {
    /**
     * Default constructor for main app.
     * @param props
     */

    render() {
        return(
            <div className="Not-found">
                <div>404 Not Found</div>
                <div>Oops! Something went wrong. Go back to the home page to continue.</div>
            </div>
        )
    }
}