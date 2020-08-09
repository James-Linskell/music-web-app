import GenerateInfo from "../../Helpers/GenerateInfo";
// Run with 'npm test', not 'jest'.

/**
 * Jest test for GenerateInfo.generatePlaylistInfo().
 */
describe("generatePlaylistInfo()", () => {
    it("should simplify raw Spotify playlist json into simpler json of playlist ids", () => {
        // Input data:
        const inputData = [{
            name: "playlist1",
            id: "id1",
            album: {
                artwork: "test"
            }
        }, {
            name: "playlist2",
            id: "id2"
        }, {
            name: "playlist3",
            id: "id3",
            album: {
                artwork: "test"
            }
        }]
        // Test:
        expect(GenerateInfo.generatePlaylistInfo(inputData)).toStrictEqual(
            [{playlistId: "id1"}, {playlistId: "id2"}, {playlistId: "id3"}]);
        expect(() => GenerateInfo.generatePlaylistInfo(null)).toThrow(TypeError);
    });
});

/**
 * Jest test for GenerateInfo.generateSongInfo().
 */
describe("generateSongInfo()", () => {
    it("should simplify raw Spotify song json into simpler json of song info", () => {
        // Input data:
        const inputData = [{
            name: "song name",
            artists: [
                {
                    name: "artist 1"
                },
                {
                    name: "artist 2",
                }
            ],
            album: {
                name: "album name",
                id: "album id",
                images: [
                    {
                        url: "image small url"
                    },
                    {
                        url: "image large url"
                    }
                ]
            },
            id: "song id",
        }]
        // Test:
        expect(GenerateInfo.generateSongInfo(inputData)).toStrictEqual(
            [{name: "song name", artist: "artist 1", album: "album name", art: "image large url", songId: "song id"}]);
        expect(() => GenerateInfo.generateSongInfo(null)).toThrow(TypeError);
    });
});