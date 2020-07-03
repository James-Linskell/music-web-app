class FetchSearchData {
    /**
     * Calls Spotify API using token. Takes a search query string and a string
     * for search type (track, artist, playlist etc).
     * @returns {Promise<void>}
     */
    static fetchData = async (searchQuery, searchType) => {
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
        searchQuery = searchQuery.replace(/\\|#|%|{|}|\^|\||`/g, "")
        console.log(searchQuery)
        const endpoint = 'https://api.spotify.com/v1/search?';
        const query = 'q=' + searchQuery;
        const type = '&type=' + searchType;
        const url = endpoint + query + type;

        const response = await fetch(url, myOptions)
        data = await response.json();
        console.log(data);
        return data;
    }
}

export default FetchSearchData;