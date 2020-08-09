import LightenColours from "../../Helpers/LightenColours";

/**
 * Jest test for LightenColours.RGB_Linear_Shade().
 */
describe("RGB_Linear_Shade()", () => {
    it("should lighten rgb input colours without effecting their transparency", () => {
        // Input data:
        const rgb = [20, 20, 20];
        // Test:
        expect(LightenColours.RGB_Linear_Shade(0.5, ("rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")")))
            .toBe("rgb(138,138,138)");
    });
});