import { createButtonSelector } from "./utils";

//MESSAGES
export const NoResourcesFoundMessage = "No resources found";

// BUTTONS
export const SearchResourceButton = createButtonSelector("Search Resources");
export const ViewResourceButton = createButtonSelector("View Resource");
export const EvaluateResourceInPlaygroundButton = createButtonSelector(
  "Evaluate in Policy Playground"
);
export const ShowJsonButton = createButtonSelector("Show JSON");

// OCCURRENCES
export const BuildOccurrence = /produced \d artifact(s?)/i;
export const VulnerabilityOccurrence = /\d vulnerabilities found/i;
export const DeploymentOccurrence = /deployment to \w+/i;

// INPUTS
export const ResourceSearchInput = "#resourceSearch";
