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

const NewPolicy = () => {
  const { theme } = useTheme();
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

    const validForm = await isValid(formData);

    if (!validForm) {
      return;
    }

    const response = await fetch("/api/policies", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.log('here')
      //TODO: handle errors when rego is invalid
      showError("Failed to create the policy");
      return;
    }

    const { id } = await response.json();

    router.push(`/policies/${id}`);
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
          error={errors["name"]}
          horizontal
          required
          onBlur={validateField}
        />
        <Input
          name={"description"}
          label={"Description"}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          error={errors["description"]}
          horizontal
          onBlur={validateField}
        />
        <TextArea
          name={"regoContent"}
          label={"Rego Policy Code"}
          value={regoContent}
          onChange={(event) => {
            setRegoContent(event.target.value);
          }}
          error={errors["regoContent"]}
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
            onClick={() => {}}
            className={styles.validateButton}
          />
        </div>
      </div>
      <div className={styles.actionButtons}>
        <Button label={"Save Policy"} type={"submit"} />
        <Button label={"Cancel"} buttonType={"text"} onClick={router.back} />
      </div>
    </form>
  );
};

export default NewPolicy;
