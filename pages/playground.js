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
import ResourceSearchBar from "../components/resources/ResourceSearchBar";
import PolicySearchBar from "../components/policies/PolicySearchBar";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "../providers/theme";

const PolicyEvaluationPlayground = () => {
  const {theme} = useTheme();

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <div className={styles.leftContainer}>
        <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
        <p>Select a policy, select a resource and version, and evaluate.</p>
        <div>
          <PolicySearchBar
            onSubmit={() => {
              console.log("policy search");
            }}
          />
        </div>
        <div>
          <ResourceSearchBar
            onSubmit={() => {
              console.log("resource search");
            }}
          />
        </div>
      </div>
      <div className={styles.rightContainer}>
        <p>{"Resource: <resource name goes here>"}</p>
        <TextArea
          name={"regoContent"}
          label={"Rego Policy Code"}
          onChange={(event) =>
            console.log("here changing text", event.target.value)
          }
        />
        <Button
          label={"Evaluate"}
          onClick={() => {
            console.log("here evaluating policy");
          }}
          className={styles.evaluateButton}
        />
      </div>
    </div>
  );
};

export default PolicyEvaluationPlayground;
