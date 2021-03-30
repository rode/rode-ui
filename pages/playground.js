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

// TODO: show the selected policy and resource in the left container when searching?

import React, { useState } from "react";
import ResourceSearchBar from "../components/resources/ResourceSearchBar";
import PolicySearchBar from "../components/policies/PolicySearchBar";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "../providers/theme";
import { useFetch } from "../hooks/useFetch";
import { usePolicies } from "../providers/policies";
import Loading from "../components/Loading";
import PlaygroundSearchResult from "../components/playground/PlaygroundSearchResult";
import { useResources } from "../providers/resources";
import { getResourceDetails } from "../utils/resource-utils";

const PolicyEvaluationPlayground = () => {
  const [policySearch, setPolicySearch] = useState(false);
  const [resourceSearch, setResourceSearch] = useState(false);

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

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
      <p className={styles.instructions}>
        Select a policy, select a resource, and evaluate.
      </p>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.searchContainer}>
            <ResourceSearchBar
              onSubmit={(event) => {
                event.preventDefault();

                setResourceSearch(true);
              }}
              // onChange={() => setResourceSearch(false)}
            />
            <div className={styles.resourceSearch}>
              {resourceSearch && (
                <Loading loading={resourceLoading}>
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
          <div className={styles.selectedResource}>
            <h2 className={styles.selectionTitle}>Selected Resource</h2>
            {resourceToEvaluate ? (
              <>
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
              </>
            ) : (
              <p className={styles.selectMessage}>
                Select a resource to evaluate.
              </p>
            )}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <PolicySearchBar
              onSubmit={(event) => {
                event.preventDefault();
                setPolicySearch(true);
              }}
              // onChange={() => setPolicySearch(false)}
            />
            <div className={styles.policySearch}>
              {policySearch && (
                <Loading loading={policyLoading}>
                  {policyResults?.length > 0 ? (
                    policyResults.map((result) => (
                      <PlaygroundSearchResult
                        searchResult={result}
                        type={"policy"}
                        onClick={() => {
                          setPolicyToEvaluate(result);
                          setPolicySearch(false);
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
          <div className={styles.selectedPolicy}>
            <h2 className={styles.selectionTitle}>Selected Policy</h2>
            {policyToEvaluate ? (
              <>
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
              </>
            ) : (
              <p className={styles.selectMessage}>
                Select a policy to evaluate against.
              </p>
            )}
          </div>
        </div>
      </div>
      <Button
        label={"Evaluate"}
        onClick={() => {
          console.log("here evaluating policy");
        }}
        className={styles.evaluateButton}
        disabled={!resourceToEvaluate || !policyToEvaluate}
      />
    </div>
  );
};

export default PolicyEvaluationPlayground;
