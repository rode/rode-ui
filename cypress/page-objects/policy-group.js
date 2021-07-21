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

export const PolicyGroupDashboardHeader = "Manage Policy Groups";

//MESSAGES
export const NoPolicyGroupsFoundMessage = "No policy groups exist.";
export const NoPolicyGroupAssignmentsMessage =
  "No policies are assigned to this policy group.";
export const InvalidPolicyGroupNameMessage =
  "Invalid character(s). Please refer to the name guidelines.";

// BUTTONS
export const CreateNewPolicyGroupButton = createButtonSelector(
  "Create New Policy Group"
);
export const SavePolicyGroupButton = createButtonSelector("Save Policy Group");
export const EditPolicyGroupButton = createButtonSelector("Edit Policy Group");
export const UpdatePolicyGroupButton = createButtonSelector(
  "Update Policy Group"
);
export const EditAssignmentsButton = createButtonSelector("Edit Assignments");
const CancelButton = createButtonSelector("Cancel");
export const AssignToPolicyGroupButton = createButtonSelector(
  "Assign to Policy Group"
);
export const RemoveFromPolicyGroupButton = createButtonSelector(
  "Remove Policy Assignment"
);
export const SaveAssignmentsButton = createButtonSelector("Save Assignments");

// INPUTS
export const PolicyGroupNameInput = "#name";
export const PolicyGroupDescriptionInput = "#description";

// FORMS
export const CreatePolicyGroupForm = {
  fields: [PolicyGroupNameInput, PolicyGroupDescriptionInput],
  buttons: [SavePolicyGroupButton, CancelButton],
};
export const EditPolicyGroupForm = {
  fields: [PolicyGroupNameInput, PolicyGroupDescriptionInput],
  buttons: [UpdatePolicyGroupButton, CancelButton],
};
