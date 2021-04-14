import { createButtonSelector } from "./utils";

// MESSAGES
export const SuccessfulEvaluationMessage = "The resource passed the policy.";
export const FailedEvaluationMessage = "The resource failed the policy.";

// BUTTONS
export const EvaluatePlaygroundButton = createButtonSelector("Evaluate");
export const SelectResourceButton = createButtonSelector("Select Resource");
export const SelectPolicyButton = createButtonSelector("Select Policy");
export const ShowEvaluationFailuresButton = createButtonSelector("Show Failures");
export const HideEvaluationFailuresButton = createButtonSelector("Hide Failures");

