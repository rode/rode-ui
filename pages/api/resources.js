import { StatusCodes, ReasonPhrases } from "http-status-codes";
import fetch from "node-fetch";

const getRodeUrl = () => process.env.RODE_URL || "http://localhost:50052";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const response = await fetch(`${rodeUrl}/v1alpha1/resources`);
    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listResourcesResponse = await response.json();
    const resources = listResourcesResponse.resources.map(({ name, uri }) => ({
      name,
      uri,
    }));

    res.status(StatusCodes.OK).json(resources);
  } catch (error) {
    console.error("Error listing resources", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
