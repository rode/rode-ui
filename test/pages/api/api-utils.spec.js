import { getRodeUrl } from "pages/api/api-utils";

describe("api-utils", () => {
  describe("getRodeUrl", () => {
    it("should return the environment variable if set", () => {
      const expected = chance.string();
      process.env.RODE_URL = expected;

      const actual = getRodeUrl();

      expect(actual).toEqual(expected);
    });

    it("should return the default url if environment is not set", () => {
      delete process.env.RODE_URL;
      const actual = getRodeUrl();

      expect(actual).toEqual("http://localhost:50052");
    });
  });
});
