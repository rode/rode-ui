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
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";

// TODO: clear values when they're leftover from other searches
// TODO: manually test changes to double check they're okay, make some passing policies to see what's up
// TODO: wait for Ahmed's additional changes to rode branch and make sure things are handled correctly

const PolicyEvaluationPlayground = () => {
  const { theme } = useTheme();
  const { state, dispatch } = usePolicies();

  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const evaluatePolicy = async (event) => {
    event.preventDefault();
    const requestBody = {
      resourceUri: state.evaluationResource.uri,
    };

    setEvaluationLoading(true);
    const response = await fetch(
      `/api/policies/${state.evaluationPolicy.id}/attest`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    const parsedResponse = await response.json();

    setEvaluationLoading(false);
    console.log("parsedResponse", parsedResponse);

    if (!response.ok) {
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
            resource={state.evaluationResource}
            setResource={(data) =>
              dispatch({
                type: policyActions.SET_EVALUATION_RESOURCE,
                data,
              })
            }
            clearEvaluation={() => setEvaluationResults(null)}
          />
          {state.evaluationResource && (
            <div className={styles.selectionContainer}>
              <h2 className={styles.selectionTitle}>Selected Resource</h2>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Name</span>
                <span>{state.evaluationResource.name}</span>
              </p>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Version</span>
                <span className={styles.break}>
                  {state.evaluationResource.version}
                </span>
              </p>
              <Button
                buttonType={"textDestructive"}
                label={"Clear Resource"}
                onClick={() => {
                  dispatch({
                    type: policyActions.SET_EVALUATION_RESOURCE,
                    data: null,
                  });
                  setEvaluationResults(null);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.rightContainer}>
          <PolicySearchAndResults
            policy={state.evaluationPolicy}
            setPolicy={(data) =>
              dispatch({
                type: policyActions.SET_EVALUATION_POLICY,
                data,
              })
            }
            clearEvaluation={() => setEvaluationResults(null)}
          />
          {state.evaluationPolicy && (
            <div className={styles.selectionContainer}>
              <h2 className={styles.selectionTitle}>Selected Policy</h2>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Name</span>
                <span>{state.evaluationPolicy.name}</span>
              </p>
              <p className={styles.selectionDetails}>
                <span className={styles.label}>Description</span>
                <span>{state.evaluationPolicy.description}</span>
              </p>
              <TextArea
                name={"regoContent"}
                label={"Rego Policy Code"}
                disabled
                value={state.evaluationPolicy.regoContent}
              />
              <Button
                buttonType={"textDestructive"}
                label={"Clear Policy"}
                onClick={() => {
                  dispatch({
                    type: policyActions.SET_EVALUATION_POLICY,
                    data: null,
                  });
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
        disabled={!state.evaluationResource || !state.evaluationPolicy}
      />
      <EvaluationResult results={evaluationResults} />
    </div>
  );
};

export default PolicyEvaluationPlayground;
