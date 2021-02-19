import fetch from "node-fetch";
import {StatusCodes, ReasonPhrases} from 'http-status-codes';
import handler from "pages/api/resources";

jest.mock("node-fetch");

describe("/api/resources", () => {
    let request,
        response;

    beforeEach(() => {
        request = {
            method: "GET"
        };

        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("unimplemented method", () => {
        it("should return method not allowed", async () => {
            request.method = chance.word();

            await handler(request, response);

            expect(response.status)
                .toHaveBeenCalledTimes(1)
                .toHaveBeenCalledWith(StatusCodes.METHOD_NOT_ALLOWED);
        })
    });
})