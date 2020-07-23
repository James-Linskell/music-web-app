class FetchData {
    /**
     * Calls Spotify API using token. Takes an input string, a call type string (search, features etc.) and a string
     * for search type (track, artist, playlist etc) (if applicable).
     * @returns {Promise<void>}
     */
    static fetchData = async (input, type, searchType) => {
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
        let url = "";
        if (type === "search") {
            // Replaces special characters in query:
            input = input.replace(/\\|#|%|{|}|\^|\||`/g, "")
            const endpoint = 'https://api.spotify.com/v1/search?';
            const query = 'q=' + input;
            const type = '&type=' + searchType;
            url = endpoint + query + type;
        } else if (type === "analysis") {
            const endpoint = 'https://api.spotify.com/v1/';
            const ty = searchType;
            const id = input;
            url = endpoint + ty + id;
        }

        const response = await fetch(url, myOptions)
        data = await response.json();
        return data;
    }
}

export default FetchData;