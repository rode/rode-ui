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
import TextArea from "components/TextArea";
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "providers/theme";
import { showError } from "utils/toast-utils";
import ResourceSearchAndResults from "components/playground/ResourceSearchAndResults";
import PolicySearchAndResults from "components/playground/PolicySearchAndResults";
import EvaluationResult from "components/playground/EvaluationResult";

// TODO: tests

const PolicyEvaluationPlayground = () => {
  const { theme } = useTheme();
  // TODO: future need to move this out in policy state so we can go from resource details to playground/policy details to playground
  const [policyToEvaluate, setPolicyToEvaluate] = useState("");
  const [resourceToEvaluate, setResourceToEvaluate] = useState("");

  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const evaluatePolicy = async (event) => {
    event.preventDefault();
    const requestBody = {
      resourceUri: resourceToEvaluate.resource.resourceUri,
    };

    setEvaluationLoading(true);
    const response = await fetch(
      `/api/policies/${policyToEvaluate.id}/attest`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    const parsedResponse = await response.json();

    setEvaluationLoading(false);
    console.log("parsedResponse", parsedResponse);

    if (!response.ok) {
      console.log("response not ok");
      showError("An error occurred while evaluating. Please try again.");
    }

    setEvaluationResults(parsedResponse);
  };

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
      <p className={styles.instructions}>
        Choose a resource, pick a policy, and evaluate.
      </p>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <ResourceSearchAndResults
            resource={resourceToEvaluate}
            setResource={setResourceToEvaluate}
            clearEvaluation={() => setEvaluationResults(null)}
          />
          {resourceToEvaluate && (
            <div className={styles.selectedResource}>
              <h2 className={styles.selectionTitle}>Selected Resource</h2>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Name</span>
                <span>{resourceToEvaluate.name}</span>
              </p>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Version</span>
                <span className={styles.break}>
                  {resourceToEvaluate.version}
                </span>
              </p>
              <Button
                buttonType={"textDestructive"}
                label={"Clear Resource"}
                onClick={() => {
                  setResourceToEvaluate(null);
                  setEvaluationResults(null);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.rightContainer}>
          <PolicySearchAndResults
            policy={policyToEvaluate}
            setPolicy={setPolicyToEvaluate}
            clearEvaluation={() => setEvaluationResults(null)}
          />
          {policyToEvaluate && (
            <div className={styles.selectedPolicy}>
              <h2 className={styles.selectionTitle}>Selected Policy</h2>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Name</span>
                <span>{policyToEvaluate.name}</span>
              </p>
              <TextArea
                name={"regoContent"}
                label={"Rego Policy Code"}
                onChange={() => {}}
                disabled
                value={policyToEvaluate.regoContent}
              />
              <Button
                buttonType={"textDestructive"}
                label={"Clear Policy"}
                onClick={() => {
                  setPolicyToEvaluate(null);
                  setEvaluationResults(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        label={"Evaluate"}
        onClick={evaluatePolicy}
        className={styles.evaluateButton}
        loading={evaluationLoading}
        disabled={!resourceToEvaluate || !policyToEvaluate}
      />
      <EvaluationResult results={evaluationResults}/>
    </div>
  );
};

export default PolicyEvaluationPlayground;
