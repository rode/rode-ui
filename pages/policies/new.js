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

const NewPolicy = () => {
  const { theme } = useTheme();
  // const [validationResult, setValidationResult] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [regoContent, setRegoContent] = useState("");
  const router = useRouter();

  // const validatePolicy = () => {
  //   console.log("here validating policy");
  //   setValidationResult("this policy is valid");
  // };

  const onSubmit = async (event) => {
    event.preventDefault();

    // TODO: form validation, name and rego inputs should be required

    const formData = {
      name,
      description,
      regoContent,
    };

    const response = await fetch("/api/policies", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      //TODO: show error message for failure to save, could be because of invalid rego so that logic goes here
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
          name={"policyName"}
          label={"Policy Name"}
          onChange={(event) => setName(event.target.value)}
          value={name}
          horizontal
        />
        <Input
          name={"policyDescription"}
          label={"Description"}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          horizontal
        />
        <TextArea
          name={"policyCode"}
          label={"Rego Policy Code"}
          value={regoContent}
          onChange={(event) => {
            // setValidationResult(null);
            setRegoContent(event.target.value);
          }}
          rows={10}
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
        {/*<div className={styles.policyValidationContainer}>*/}
        {/*  <Button*/}
        {/*    label={"Validate Policy"}*/}
        {/*    buttonType={"text"}*/}
        {/*    onClick={validatePolicy}*/}
        {/*    className={styles.validateButton}*/}
        {/*  />*/}
        {/*  {validationResult && <p>{validationResult}</p>}*/}
        {/*</div>*/}
      </div>
      <div className={styles.actionButtons}>
        <Button label={"Save Policy"} type={"submit"} />
        <Button
          label={"Cancel"}
          buttonType={"text"}
          onClick={() => router.back()}
        />
      </div>
    </form>
  );
};

export default NewPolicy;
