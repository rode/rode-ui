import { isServerSide } from "utils/shared-utils";

describe("shared utils", () => {
  /* eslint-disable no-undef*/
  describe("isServerSide", () => {
    it("should return true when on the server", () => {
      delete global.window;
      expect(isServerSide()).toBe(true);
    });

    it("should return false when on the client", () => {
      global.window = chance.string();
      expect(isServerSide()).toBe(false);
    });
  });
  /* eslint-enable no-undef */
});