import fetch from "node-fetch";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import handler from "pages/api/resources";

jest.mock("node-fetch");

describe("/api/resources", () => {
  let request, response, allResources, rodeResponse;

  beforeEach(() => {
    request = {
      method: "GET",
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    allResources = chance.n(
      () => ({
        [chance.word()]: chance.word(),
        name: chance.name(),
        uri: chance.url(),
      }),
      chance.d4()
    );

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        resources: allResources,
      }),
    };

    fetch.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("unimplemented method", () => {
    it("should return method not allowed", async () => {
      request.method = chance.word();

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.METHOD_NOT_ALLOWED);

      expect(response.json)
        .toBeCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
    });
  });

  describe("successful call to Rode", () => {
    let rodeUrlEnv;

    beforeEach(() => {
      rodeUrlEnv = process.env.RODE_URL;
      delete process.env.RODE_URL;
    });

    afterEach(() => {
      process.env.RODE_URL = rodeUrlEnv;
    });

    it("should hit the Rode API", async () => {
      const expectedUrl = "http://localhost:50052/v1alpha1/resources";

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should take the Rode URL from the environment if set", async () => {
      const rodeUrl = chance.url();
      const expectedUrl = `${rodeUrl}/v1alpha1/resources`;
      process.env.RODE_URL = rodeUrl;

      await handler(request, response);

      delete process.env.RODE_URL;
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return the mapped resources", async () => {
      const expectedResources = allResources.map((resource) => ({
        name: resource.name,
        uri: resource.uri,
      }));

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedResources);
    });
  });

  describe("call to Rode fails", () => {
    const assertInternalServerError = () => {
      expect(response.status)
        .toBeCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    };

    it("should return an internal server error on a non-200 response from Rode", async () => {
      rodeResponse.ok = false;

      await handler(request, response);

      assertInternalServerError();
    });

    it("should return an internal server error on a network or other fetch error", async () => {
      fetch.mockRejectedValue(new Error());

      await handler(request, response);

      assertInternalServerError();
    });

    it("should return an internal server error when JSON is invalid", async () => {
      rodeResponse.json.mockRejectedValue(new Error());

      await handler(request, response);

      assertInternalServerError();
    });
  });
});
