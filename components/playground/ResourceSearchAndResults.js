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
import PropTypes from "prop-types";
import styles from "styles/modules/Playground.module.scss";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import Loading from "components/Loading";
import PlaygroundSearchResult from "./PlaygroundSearchResult";
import { getResourceDetails } from "utils/resource-utils";
import { resourceActions } from "reducers/resources";
import { useFetch } from "hooks/useFetch";
import { useResources } from "providers/resources";

// TODO: tests

const ResourceSearchAndResults = ({resource, setResource, clearEvaluation}) => {
  const [resourceSearch, setResourceSearch] = useState(false);
  const {state, dispatch} = useResources();

  const { data: resourceResults, loading: resourceLoading } = useFetch(
    resourceSearch ? "/api/resources" : null,
    {
      filter: state.searchTerm,
    }
  );

  useEffect(() => {
    clearEvaluation();
  }, [resourceSearch]);

  return (
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

                    setResource({
                      resource: result,
                      name: resourceName,
                      version: resourceVersion,
                    });
                    setResourceSearch(false);
                    dispatch({
                      type: resourceActions.SET_SEARCH_TERM,
                      data: "",
                    });
                  }}
                  key={result.uri}
                  selected={
                    result.uri === resource?.resource?.uri
                  }
                />
              ))
            ) : (
              <p>{ `No resources found matching "${state.searchTerm}"` }</p>
            )}
          </Loading>
        )}
      </div>
    </div>
  )
};

ResourceSearchAndResults.propTypes = {
  resource: PropTypes.object,
  setResource: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired
}

export default ResourceSearchAndResults