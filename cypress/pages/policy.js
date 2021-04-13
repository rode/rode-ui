export const PolicySearchInput = "#policySearch";
export const NoPoliciesFound = "No policies found";
export const EditPolicyButton = "Edit Policy";
export const EditPolicyForm = {
  fields: [
    {
      label: "Policy Name",
      selector: "#name",
    },
    {
      label: "Description",
      selector: "#description",
    },
    {
      label: "Rego Policy Code",
      selector: "#regoContent",
    },
  ],
  buttons: ["Validate Policy", "Update Policy", "Cancel", "Delete Policy"],
};
