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
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import PolicySearchBar from "components/policies/PolicySearchBar";
import TextArea from "components/TextArea";
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "providers/theme";
import { useFetch } from "hooks/useFetch";
import { usePolicies } from "providers/policies";
import Loading from "components/Loading";
import PlaygroundSearchResult from "components/playground/PlaygroundSearchResult";
import { useResources } from "providers/resources";
import { getResourceDetails } from "utils/resource-utils";
import { resourceActions } from "reducers/resources";
import { policyActions } from "reducers/policies";
import { showError } from "utils/toast-utils";
import { ICON_NAMES } from "../utils/icon-utils";
import Icon from "../components/Icon";

const PolicyEvaluationPlayground = () => {
  const [policySearch, setPolicySearch] = useState(false);
  const [resourceSearch, setResourceSearch] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);

  // TODO: need to move this out in policy state so we can go from resource details to playground/policy details to playground
  const [policyToEvaluate, setPolicyToEvaluate] = useState("");
  const [resourceToEvaluate, setResourceToEvaluate] = useState("");
  const { theme } = useTheme();
  const { state: policyState, dispatch: policyDispatch } = usePolicies();
  const { state: resourceState, dispatch: resourceDispatch } = useResources();

  const { data: policyResults, loading: policyLoading } = useFetch(
    policySearch ? "/api/policies" : null,
    {
      filter: policyState.searchTerm,
    }
  );
  const { data: resourceResults, loading: resourceLoading } = useFetch(
    resourceSearch ? "/api/resources" : null,
    {
      filter: resourceState.searchTerm,
    }
  );

  const evaluatePolicy = async (event) => {
    event.preventDefault();
    const requestBody = {
      resourceUri: resourceToEvaluate.resource.resourceUri
    };

    const response = await fetch(`/api/policies/${policyToEvaluate.id}/attest`, {
      method: "POST",
      body: JSON.stringify(requestBody)
    });

    const parsedResponse = await response.json();

    console.log('parsedResponse', parsedResponse);

    if (!response.ok) {

      console.log('response not ok');
      showError("An error occurred while evaluating. Please try again.");
    }

    setEvaluationResults(parsedResponse);
  }

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
      <p className={styles.instructions}>
        Choose a resource, pick a policy, and evaluate.
      </p>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.searchContainer}>
            <ResourceSearchBar
              onSubmit={(event) => {
                event.preventDefault();

                setResourceSearch(true);
              }}
              onChange={() => setResourceSearch(false)}
            />
            <div className={styles.resourceSearch}>
              {resourceSearch && (
                <Loading loading={resourceLoading} type={"button"}>
                  {resourceResults?.length > 0 ? (
                    resourceResults.map((result) => (
                      <PlaygroundSearchResult
                        searchResult={result}
                        type={"resource"}
                        onClick={() => {
                          const {
                            resourceName,
                            resourceVersion,
                          } = getResourceDetails(result.uri);

                          setResourceToEvaluate({
                            resource: result,
                            name: resourceName,
                            version: resourceVersion,
                          });
                          setResourceSearch(false);
                          resourceDispatch({
                            type: resourceActions.SET_SEARCH_TERM,
                            data: "",
                          });
                        }}
                        key={result.uri}
                        selected={
                          result.uri === resourceToEvaluate?.resource?.uri
                        }
                      />
                    ))
                  ) : (
                    <p>No resources found</p>
                  )}
                </Loading>
              )}
            </div>
          </div>
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
                onClick={() => setResourceToEvaluate(null)}
              />
            </div>
          )}
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <PolicySearchBar
              onSubmit={(event) => {
                event.preventDefault();
                setPolicySearch(true);
              }}
              onChange={() => setPolicySearch(false)}
            />
            <div className={styles.policySearch}>
              {policySearch && (
                <Loading loading={policyLoading} type={"button"}>
                  {policyResults?.length > 0 ? (
                    policyResults.map((result) => (
                      <PlaygroundSearchResult
                        searchResult={result}
                        type={"policy"}
                        onClick={() => {
                          setPolicyToEvaluate(result);
                          setPolicySearch(false);
                          policyDispatch({
                            type: policyActions.SET_SEARCH_TERM,
                            data: "",
                          });
                        }}
                        key={result.id}
                        selected={result.id === policyToEvaluate?.id}
                      />
                    ))
                  ) : (
                    <p>No policies found</p>
                  )}
                </Loading>
              )}
            </div>
          </div>
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
                onClick={() => setPolicyToEvaluate(null)}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        label={"Evaluate"}
        onClick={evaluatePolicy}
        className={styles.evaluateButton}
        disabled={!resourceToEvaluate || !policyToEvaluate}
      />
      {
        evaluationResults &&
          <div>
            {
              evaluationResults.pass ?
                <>
                  <Icon name={ICON_NAMES.BADGE_CHECK} />
                <p>The resource passed the policy.</p>
                </>
                :
                <div>
                  <Icon name={ICON_NAMES.EXCLAMATION} />
                  <p>The resource failed the policy.</p>
                  <pre>
                    <code>{evaluationResults.explanation}</code>
                  </pre>
                  </div>
            }
          </div>
      }
    </div>
  );
};

export default PolicyEvaluationPlayground;
