/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createButtonSelector } from "./utils";

//MESSAGES
export const NoResourcesFoundMessage = "No resources found";

// BUTTONS
export const SearchResourceButton = createButtonSelector("Search Resources");
export const SearchResourceVersionButton = createButtonSelector(
  "Search Versions"
);
export const ViewResourceButton = createButtonSelector("View Resource");
export const EvaluateResourceInPlaygroundButton = createButtonSelector(
  "Evaluate in Policy Playground"
);
export const ShowJsonButton = createButtonSelector("Show JSON");

// OCCURRENCES
export const OccurrenceSection = /^Occurrences$/;
export const BuildOccurrence = /produced \d artifact(s?)/i;
export const VulnerabilityOccurrence = /\d vulnerabilities found/i;
export const DeploymentOccurrence = /deployment to \w+/i;

// INPUTS
export const ResourceSearchInput = "#resourceSearchDisplay";
export const ResourceVersionSearchInput = "#resourceVersionSearchDisplay";
