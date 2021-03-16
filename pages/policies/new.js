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

import React from "react";
import Input from "components/Input";
import TextArea from "components/TextArea";
import Button from "components/Button";
import styles from "styles/modules/Policy.module.scss";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import ExternalLink from "components/ExternalLink";

const NewPolicy = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const validatePolicy = () => {
    console.log("here validating policy");
  };
  const onSubmit = (event) => {
    event.preventDefault();

    console.log("event", event);

    // validate rego code
    validatePolicy();
    // save to api
  };

  return (
    <form onSubmit={onSubmit} className={`${styles.form} ${styles[theme]}`}>
      <h1 className={styles.heading}>Create New Policy</h1>
      <div className={styles.policyDetailsContainer}>
        <Input
          name={"policyName"}
          label={"Policy Name"}
          onChange={(event) => console.log(event.target.value)}
          horizontal
        />
        <Input
          name={"policyDescription"}
          label={"Description"}
          onChange={(event) => console.log(event.target.value)}
          horizontal
        />
        <TextArea
          name={"policyCode"}
          label={"Rego Policy Code"}
          onChange={(event) => console.log(event.target.value)}
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
        <Button
          label={"Validate Policy"}
          buttonType={"text"}
          onClick={validatePolicy}
          className={styles.validateButton}
        />
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
