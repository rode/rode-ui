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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import Button from "components/Button";
import Input from "components/Input";
import styles from "styles/modules/PolicyGroupForm.module.scss";
import PageHeader from "components/layout/PageHeader";
import { useFormValidation } from "hooks/useFormValidation";
import { schema } from "schemas/policy-group-form";
import { showError, showSuccess } from "utils/toast-utils";
import { AUTHORIZATION_ERROR_MESSAGE } from "utils/constants";
import { stateActions } from "reducers/appState";
import { useAppState } from "providers/appState";
import { StatusCodes } from "http-status-codes";
import Text from "components/Text";

const PolicyGroupForm = (props) => {
  const {
    title,
    method,
    endpoint,
    verb,
    submitButtonText,
    policyGroup = {},
  } = props;
  const creatingNewPolicyGroup = method === "POST";
  const { theme } = useTheme();
  const router = useRouter();
  const { dispatch } = useAppState();

  const [name, setName] = useState(policyGroup.name || "");
  const [description, setDescription] = useState(policyGroup.description || "");
  const [loading, setLoading] = useState(false);

  const { isValid, validateField, errors } = useFormValidation(schema);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      name,
      description,
    };

    const validForm = isValid(formData);

    if (!validForm) {
      return;
    }

    setLoading(true);
    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(false);

    if (response.status === StatusCodes.CONFLICT) {
      showError(`Policy Group "${formData.name}" already exists.`);
      return;
    }

    if (response.status === StatusCodes.FORBIDDEN) {
      showError(AUTHORIZATION_ERROR_MESSAGE);
      return;
    }

    if (!response.ok) {
      showError(`Failed to ${verb} the policy group.`);
      return;
    }

    dispatch({
      type: stateActions.SET_CURRENT_POLICY_GROUP,
      data: formData,
    });

    router.push(`/policy-groups/${formData.name}`);
  };

  const onDelete = async (event) => {
    event.preventDefault();

    setLoading(true);
    const response = await fetch(`/api/policy-groups/${policyGroup.name}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (response.status === StatusCodes.FORBIDDEN) {
      showError(AUTHORIZATION_ERROR_MESSAGE);
      return;
    }

    if (!response.ok) {
      showError(
        "An error occurred while deleting the policy group. Please try again."
      );
      return;
    }

    showSuccess("Policy group was successfully deleted.");
    router.push("/policy-groups");
  };

  return (
    <>
      <PageHeader>
        <Text.Heading1>{title}</Text.Heading1>
      </PageHeader>
      <div className={`${styles.pageContainer} ${styles[theme]}`}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formContentContainer}>
            <Input
              name={"name"}
              label={"Policy Group Name"}
              placeholder={"ex: pci-bundle"}
              onChange={(event) => {
                setName(event.target.value);
              }}
              value={name}
              horizontal
              onBlur={(event) => validateField(event, true)}
              required
              error={errors.name}
              disabled={!creatingNewPolicyGroup}
            />
            {creatingNewPolicyGroup && (
              <Text.Caption
                as={"p"}
                className={styles.hint}
                spacing={"Policy Group Name"}
              >
                <span>Please note:</span> Policy Group Name cannot be changed
                after creation.
              </Text.Caption>
            )}
            <Input
              name={"description"}
              label={"Description"}
              placeholder={
                "A summary of the intended use for this policy group"
              }
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              value={description}
              horizontal
              onBlur={validateField}
              error={errors.description}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <div className={styles.primaryButtonsContainer}>
              <Button
                label={submitButtonText}
                type={"submit"}
                loading={loading}
              />

              <Button
                label={"Cancel"}
                onClick={() => router.back()}
                buttonType={"text"}
                disabled={loading}
              />
            </div>
            {!creatingNewPolicyGroup && (
              <div>
                <Button
                  label={"Delete Policy Group"}
                  onClick={onDelete}
                  buttonType={"textDestructive"}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </form>
        <div
          className={
            creatingNewPolicyGroup ? styles.formNotes : styles.emptyFormNotes
          }
        >
          {creatingNewPolicyGroup && (
            <>
              <div>
                <Text.Heading2>Policy Group Name Guidelines</Text.Heading2>
                <ul>
                  <li>Must be unique</li>
                  <li>Lowercase</li>
                  <li>Alphanumeric Characters</li>
                  <li>Dashes or Hyphens</li>
                  <li>Underscores</li>
                </ul>
              </div>
              <div>
                <Text.Heading3>Examples</Text.Heading3>
                <code>development_3</code>
                <code>pci-requirements</code>
                <code>docker_images_prod</code>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

PolicyGroupForm.propTypes = {
  title: PropTypes.string.isRequired,
  method: PropTypes.oneOf(["POST", "PATCH"]).isRequired,
  endpoint: PropTypes.string.isRequired,
  verb: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  policyGroup: PropTypes.object,
};

export default PolicyGroupForm;
