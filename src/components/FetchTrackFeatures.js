class FetchTrackFeatures {
    /**
     * Calls Spotify API using token. Type = 'features' or 'analysis'.
     * @returns {Promise<void>}
     */
    static fetchData = async (songId, type) => {
        let data = '';
        /**
         * Calls my node server which requests a Spotify client access token.
         * @returns {Promise<any>} Json body containing Spotify client token and test message
         */
        const getToken = async () => {
            const response = await fetch('/authenticate');
            const body = await response.json();

            if (response.status !== 200) {
                throw Error(body.message)
            }
            return body;
        };
        const requestToken = await getToken();
        const token = requestToken.myToken;
        var myOptions = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        // Replaces special characters in query:
        const endpoint = 'https://api.spotify.com/v1/';
        const ty = type;
        const id = songId;
        const url = endpoint + ty + id;

        const response = await fetch(url, myOptions)
        data = await response.json();
        return data;
    }
}

export default FetchTrackFeatures;