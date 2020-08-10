import FetchData from "../../Helpers/FetchData";
// Run with 'npm test', not 'jest'.

/**
 * Jest test for FetchData.fetchData(). The other function in this module, getToken() is a private method called only
 * by fetchData() so is included in this test. This is a unit test and is not concerned with API access, so should just catch
 * network errors.
 */
describe("fetchData()", () => {
    it("should throw a network error ('There was a problem connecting to the Songmapper service.')", () => {
        // Test:
        expect(() => {FetchData.fetchData("search query string",'search','playlist').toThrow(Error)});
        expect(() => {FetchData.fetchData(4 ,null,undefined).toThrow(TypeError)});
    });
});