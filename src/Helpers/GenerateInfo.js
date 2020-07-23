class GenerateInfo {
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