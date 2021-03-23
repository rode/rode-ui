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
import Input from "components/Input";
import TextArea from "components/TextArea";
import Button from "components/Button";
import styles from "styles/modules/Policy.module.scss";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import ExternalLink from "components/ExternalLink";
import { schema } from "schemas/new-policy-form";
import { useFormValidation } from "hooks/useFormValidation";
import { showError } from "utils/toast-utils";
import PolicyValidationResult from "components/policies/PolicyValidationResult";

const NewPolicy = () => {
  const { theme } = useTheme();
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [regoContent, setRegoContent] = useState("");
  const router = useRouter();

  const { isValid, validateField, errors } = useFormValidation(schema);

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name,
      description,
      regoContent,
    };

    const validForm = isValid(formData);

    if (!validForm) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/policies", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!response.ok) {
      const parsedResponse = await response.json();

      if (parsedResponse?.errors) {
        setValidationResults(parsedResponse);
        showError(
          "Failed to create the policy due to invalid Rego code. See error(s) below for details."
        );
        return;
      }

      showError("Failed to create the policy.");
      return;
    }

    const { id } = await response.json();

    router.push(`/policies/${id}`);
  };

  const onValidate = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/policies/validate", {
      method: "POST",
      body: JSON.stringify({
        policy: regoContent,
      }),
    });

    const result = await response.json();

    setValidationResults(result);
  };

  return (
    <form onSubmit={onSubmit} className={`${styles.form} ${styles[theme]}`}>
      <h1 className={styles.heading}>Create New Policy</h1>
      <div className={styles.policyInputsContainer}>
        <Input
          name={"name"}
          label={"Policy Name"}
          onChange={(event) => setName(event.target.value)}
          value={name}
          error={errors.name}
          horizontal
          required
          onBlur={validateField}
        />
        <Input
          name={"description"}
          label={"Description"}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          error={errors.description}
          horizontal
          onBlur={validateField}
        />
        <TextArea
          name={"regoContent"}
          label={"Rego Policy Code"}
          value={regoContent}
          onChange={(event) => {
            setValidationResults(null);
            setRegoContent(event.target.value);
          }}
          error={errors.regoContent || validationResults?.isValid === false}
          required
          rows={10}
          onBlur={validateField}
        />
        <p className={styles.documentation}>
          Need help formulating? Check out the{" "}
          <ExternalLink
            href={
              "https://www.openpolicyagent.org/docs/latest/policy-language/"
            }
            label={"Rego documentation"}
          />
          .
        </p>
        <div className={styles.policyValidationContainer}>
          <Button
            label={"Validate Policy"}
            buttonType={"text"}
            onClick={onValidate}
            className={styles.validateButton}
            disabled={loading || !regoContent.length}
          />
          <PolicyValidationResult validation={validationResults} />
        </div>
      </div>
      <div className={styles.actionButtons}>
        <Button label={"Save Policy"} type={"submit"} loading={loading} />
        <Button
          label={"Cancel"}
          buttonType={"text"}
          onClick={router.back}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default NewPolicy;
