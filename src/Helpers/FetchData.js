/**
 * Helper class with methods which formulate and make calls to the spotify web API.
 */
class FetchData {
    /**
     * Calls my node server which requests a Spotify client access token.
     * @returns {Promise} Json body containing Spotify client token and test message
     */
    static getToken = async () => {
        const response = await fetch('/authenticate');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
    /**
     * Calls Spotify API using client access token. Takes an input string, a call type string (search or analysis) and a string
     * for search type ('tracks/artists/playlists' for searches or 'audio-features/?ids=' for audio data).
     * @returns {Promise} Spotify search or audio analysis data
     */
    static fetchData = async (input, type, searchType) => {
        let data = '';
        const requestToken = await this.getToken();
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