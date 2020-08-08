import React from 'react';
import '../styles/NotFound.css'

/**
 * Module for Not Found screen. Contains a '404 Not Found' error message. Broken links or thrown errors in other routes
 * redirect here.
 */
export default class NotFound extends React.Component {
    /**
     * Renders the 404 Not Found page.
     * @returns <NotFound/>
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