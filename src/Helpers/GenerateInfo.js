/**
 * helper module which simplifies song/playlist data from raw json (from Spotify API) to an array of simplified json objects.
 */
class GenerateInfo {
    /**
     * Simplifies playlist data.
     * @param data raw Spotify json
     * @return array of simplified json objects
     */
    static generatePlaylistInfo(data) {
        const playlists = []

        data.forEach(playlist => {
                playlists.push({
                    playlistId: playlist.id
                });
            }
        );
        return playlists;
    }

    /**
     * Simplifies song data.
     * @param data raw Spotify json
     * @return array of simplified json objects
     */
    static generateSongInfo(data) {
        const songs = []

        data.forEach(song => {
                songs.push({
                    name: song.name,
                    artist: song.artists[0].name,
                    album: song.album.name,
                    art: song.album.images[1].url,
                    songId: song.id
                });
            }
        );
        return songs;
    }
}

export default GenerateInfo;