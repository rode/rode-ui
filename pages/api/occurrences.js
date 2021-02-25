import { StatusCodes, ReasonPhrases } from "http-status-codes";
import fetch from "node-fetch";

// TODO: move into a helper
const getRodeUrl = () => process.env.RODE_URL || "http://localhost:50052";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const resourceUri = req.query.resourceUri;
    const filter = `"resource.uri"=="${resourceUri}"`;
    const response = await fetch(
      `${rodeUrl}/v1alpha1/occurrences?filter=${encodeURIComponent(filter)}`
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listOccurrencesResponse = await response.json();
    const occurrences = listOccurrencesResponse.occurrences;

    res.status(StatusCodes.OK).json(occurrences);
  } catch (error) {
    console.error("Error listing occurrences", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
