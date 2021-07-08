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

//MESSAGES
import { createButtonSelector } from "./utils";

export const NoPoliciesFoundMessage = "No policies found";
export const DeletePolicyConfirmMessage =
  "Are you sure you want to delete this policy?";
export const DeleteSuccessMessage = "Policy was successfully deleted.";
export const PolicyNameRequiredMessage = "Policy Name is a required field";
export const PolicyRegoRequiredMessage = "Rego Policy Code is a required field";
export const PolicyFailedValidationMessage = "This policy failed validation";
export const PolicyPassedValidationMessage = "This policy passes validation";
export const PolicyFailedUpdateInvalidRegoMessage =
  "Failed to update the policy due to invalid Rego code.";
export const PolicyFailedUpdateMessage = "Failed to update the policy.";
export const PolicyFailedDeleteMessage =
  "An error occurred while deleting the policy. Please try again.";
export const NewPolicyVersionMessage =
  "By updating the Rego Policy Code, you are creating a new version of this policy.";

// BUTTONS
export const SearchPolicyButton = createButtonSelector("Search Policies");
export const EditPolicyButton = createButtonSelector("Edit Policy");
export const ViewPolicyButton = createButtonSelector("View Policy");
export const EvaluatePolicyInPlaygroundButton = createButtonSelector(
  "Evaluate in Policy Playground"
);
export const UpdatePolicyButton = createButtonSelector("Update Policy");
export const SavePolicyButton = createButtonSelector("Save Policy");
export const ValidatePolicyButton = createButtonSelector("Validate Policy");
export const CancelButton = createButtonSelector("Cancel");
export const DeletePolicyButton = createButtonSelector("Delete Policy");
export const ConfirmUpdatePolicyButton = createButtonSelector(
  "Update & Save Policy"
);

// SECTIONS
export const PolicyDetailsSection = /^Policy Details$/;
export const HistorySection = /^History$/;
export const Assignments = /^Assignments$/;

// INPUTS
export const PolicySearchInput = "#policySearchDisplay";
export const PolicyNameInput = "#name";
export const PolicyDescriptionInput = "#description";
export const PolicyRegoContentInput = "#regoContent";
export const PolicyUpdateMessageInput = "#message";

// MODALS
export const DeletePolicyModal = "div[role='dialog']";
export const UpdatePolicyModal = "div[role='dialog']";

// FORMS
export const EditPolicyForm = {
  fields: [PolicyNameInput, PolicyDescriptionInput, PolicyRegoContentInput],
  buttons: [
    ValidatePolicyButton,
    UpdatePolicyButton,
    CancelButton,
    DeletePolicyButton,
  ],
};

export const CreatePolicyForm = {
  fields: [PolicyNameInput, PolicyDescriptionInput, PolicyRegoContentInput],
  buttons: [ValidatePolicyButton, SavePolicyButton, CancelButton],
};
