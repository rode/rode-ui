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

const PolicyEvaluationPlayground = () => {
  const [policySearch, setPolicySearch] = useState(false);
  const [resourceSearch, setResourceSearch] = useState(false);
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
    resourceSearch ? "/api/policies" : null,
    {
      filter: resourceState.searchTerm,
    }
  );

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <div className={styles.leftContainer}>
        <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
        <p>Select a policy, select a resource and version, and evaluate.</p>
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

                    }}
                    key={result.id}
                  />
                ))
              ) : (
                <p>No policies found</p>
              )}
            </Loading>
          )}
        </div>
          <ResourceSearchBar
            onSubmit={(event) => {
              event.preventDefault();

              setResourceSearch(true)
            }}
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
                      setResourceToEvaluate(result);

                    }}
                    key={result.id}
                  />
                ))
              ) : (
                <p>No resources found</p>
              )}
            </Loading>
          )}
        </div>
      </div>
      <div className={styles.rightContainer}>
        <p>{`Resource: ${resourceToEvaluate?.name || "not selected"}`}</p>
        {resourceToEvaluate?.version && (
          <p>{`Version: ${resourceToEvaluate.version}`}</p>
        )}
        <TextArea
          name={"regoContent"}
          label={"Rego Policy Code"}
          onChange={() => {}}
          disabled
          value={policyToEvaluate.regoContent}
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
