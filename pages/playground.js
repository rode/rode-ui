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

import React, { useState, useEffect } from "react";
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "providers/theme";
import { showError } from "utils/toast-utils";
import EvaluationResult from "components/playground/EvaluationResult";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import PageHeader from "components/layout/PageHeader";
import SelectedPolicy from "components/playground/SelectedPolicy";
import SelectedResource from "components/playground/SelectedResource";
import Text from "components/Text";

const PolicyPlayground = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useAppState();

  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const evaluatePolicy = async (event) => {
    event.preventDefault();
    const requestBody = {
      resourceUri: state.evaluationResource.versionedResourceUri,
    };

    setEvaluationLoading(true);
    const response = await fetch(
      `/api/policies/${state.evaluationPolicy.id}/attest`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const parsedResponse = await response.json();

    setEvaluationLoading(false);

    if (!response.ok) {
      showError("An error occurred while evaluating. Please try again.");
      return;
    }

    setEvaluationResults(parsedResponse);
  };

  const resetPlayground = () => {
    dispatch({
      type: stateActions.SET_EVALUATION_RESOURCE,
      data: null,
    });
    dispatch({
      type: stateActions.SET_EVALUATION_POLICY,
      data: null,
    });
    setEvaluationResults(null);
  };

  useEffect(() => {
    dispatch({
      type: stateActions.SET_RESOURCE_SEARCH_TERM,
      data: "",
    });
    dispatch({
      type: stateActions.SET_POLICY_SEARCH_TERM,
      data: "",
    });

    setEvaluationResults(null);

    return () => resetPlayground();
  }, []);

  return (
    <div className={`${styles[theme]} ${styles.pageContainer}`}>
      <PageHeader>
        <Text.Heading1>Policy Playground</Text.Heading1>
        <Text.Body1 className={styles.instructions}>
          Choose a resource, pick a policy, and evaluate.
        </Text.Body1>
      </PageHeader>
      <div className={styles.policyContainer}>
        <SelectedPolicy
          policy={state.evaluationPolicy}
          setPolicy={(data) =>
            dispatch({
              type: stateActions.SET_EVALUATION_POLICY,
              data,
            })
          }
          clearEvaluation={() => setEvaluationResults(null)}
        />
      </div>
      <div className={styles.resourceContainer}>
        <SelectedResource
          resourceUri={state.evaluationResource?.versionedResourceUri}
          setEvaluationResource={(data) =>
            dispatch({
              type: stateActions.SET_EVALUATION_RESOURCE,
              data,
            })
          }
          clearEvaluation={() => setEvaluationResults(null)}
        />
      </div>
      <div className={styles.evaluationContainer}>
        {evaluationResults ? (
          <EvaluationResult results={evaluationResults} />
        ) : (
          <Button
            label={"Evaluate"}
            onClick={evaluatePolicy}
            className={styles.evaluateButton}
            loading={evaluationLoading}
            disabled={!state.evaluationResource || !state.evaluationPolicy}
          />
        )}
      </div>
    </div>
  );
};

export default PolicyPlayground;
export { getServerSideProps } from "utils/server";
