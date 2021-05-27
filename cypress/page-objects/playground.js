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

// MESSAGES
export const SuccessfulEvaluationMessage = "The resource passed the policy.";
export const FailedEvaluationMessage = "The resource failed the policy.";
export const EvaluationErrorMessage =
  "An error occurred while evaluating. Please try again.";

// BUTTONS
export const OpenPolicySearchDrawerButton = createButtonSelector(
  "Search for policies"
);
export const OpenResourceSearchDrawerButton = createButtonSelector(
  "Search for resources"
);
export const EvaluatePlaygroundButton = createButtonSelector("Evaluate");
export const SelectResourceButton = createButtonSelector("Select Resource");
export const SelectResourceVersionButton = createButtonSelector(
  "Select Version"
);
export const SelectPolicyButton = createButtonSelector("Select Policy");
export const ShowEvaluationFailuresButton = createButtonSelector(
  "Show Failures"
);
export const HideEvaluationFailuresButton = createButtonSelector(
  "Hide Failures"
);
