const createButtonSelector = (label) => `button[aria-label="${label}"]`;

//MESSAGES
export const NoPoliciesFoundMessage = "No policies found";
export const DeletePolicyConfirmMessage =
  "Are you sure you want to delete this policy?";
export const DeleteSuccessMessage = "Policy was successfully deleted.";
export const PolicyNameRequiredMessage = "Policy Name is a required field";
export const PolicyRegoRequiredMessage = "Rego Policy Code is a required field";
export const PolicyFailedValidationMessage = "This policy failed validation";
export const PolicyPassedValidationMessage = "This policy passes validation";

// BUTTONS
export const PolicySearchButton = createButtonSelector('Search Policies');
export const EditPolicyButton = createButtonSelector('Edit Policy');
export const ViewPolicyButton = createButtonSelector('View Policy');
export const EvaluatePlaygroundButton = createButtonSelector('Evaluate in Policy Playground');
export const UpdatePolicyButton = createButtonSelector('Update Policy');
export const SavePolicyButton = createButtonSelector('Save Policy');
export const ValidatePolicyButton = createButtonSelector('Validate Policy');
export const CancelButton = createButtonSelector('Cancel');
export const DeletePolicyButton = createButtonSelector('Delete Policy');

// INPUTS
export const PolicySearchInput = "#policySearch";
export const PolicyNameInput = "#name";
export const PolicyDescriptionInput = "#description";
export const PolicyRegoInput = "#regoContent";

// MODALS
export const DeletePolicyModal = "div[role='dialog']";

// FORMS
export const EditPolicyForm = {
  fields: [PolicyNameInput, PolicyDescriptionInput, PolicyRegoInput],
  buttons: [
    ValidatePolicyButton,
    UpdatePolicyButton,
    CancelButton,
    DeletePolicyButton,
  ],
};

export const CreatePolicyForm = {
  fields: [PolicyNameInput, PolicyDescriptionInput, PolicyRegoInput],
  buttons: [
    ValidatePolicyButton,
    SavePolicyButton,
    CancelButton
  ]
}
