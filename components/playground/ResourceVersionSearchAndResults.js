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
import PropTypes from "prop-types";
import styles from "styles/modules/Playground.module.scss";
import Loading from "components/Loading";
import {
  buildResourceVersionQueryParams,
  getResourceDetails,
} from "utils/resource-utils";
import { resourceActions } from "reducers/resources";
import { useResources } from "providers/resources";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { PLAYGROUND_SEARCH_PAGE_SIZE, SEARCH_ALL } from "utils/constants";
import ResourceVersion from "components/resources/ResourceVersion";
import LabelWithValue from "components/LabelWithValue";
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";

const ResourceVersionSearchAndResults = ({
  genericResource,
  onVersionSelect,
}) => {
  const [versionSearch, setVersionSearch] = useState(!!genericResource);
  const { state, dispatch } = useResources();

  if (!genericResource) {
    return <p>Select a resource to view a list of versions</p>;
  }

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    state.versionSearchTerm ? "/api/resource-versions" : null,
    buildResourceVersionQueryParams(
      genericResource.id,
      state.versionSearchTerm
    ),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  return (
    <div className={styles.searchContainer}>
      <ResourceVersionSearchBar
        onSubmit={(event) => {
          event.preventDefault();
          setVersionSearch(true);
        }}
        onChange={() => setVersionSearch(false)}
        helpText={
          <Button
            className={styles.viewAllButton}
            buttonType={"text"}
            label={"View all versions"}
            onClick={() => {
              setVersionSearch(true);
              dispatch({
                type: resourceActions.SET_VERSION_SEARCH_TERM,
                data: SEARCH_ALL,
              });
            }}
          />
        }
      />
      {versionSearch && (
        <Loading loading={loading} type={"button"}>
          {data?.length > 0 && (
            <>
              {data.map((version) => {
                const {
                  resourceVersion,
                  aliasLabel,
                  aliases,
                } = getResourceDetails(version.versionedResourceUri, version);

                return (
                  <div
                    className={`${styles.searchCard}`}
                    key={version.versionedResourceUri}
                  >
                    <div>
                      <LabelWithValue
                        label={"Version"}
                        value={<ResourceVersion version={resourceVersion} />}
                        className={styles.cardText}
                      />
                      <LabelWithValue
                        label={aliasLabel}
                        value={aliases.join(", ")}
                        className={styles.cardText}
                      />
                    </div>
                    <Button
                      onClick={() => onVersionSelect(version)}
                      buttonType={"text"}
                      label={"Select Version"}
                      className={styles.actionButton}
                    />
                  </div>
                );
              })}
              {!isLastPage && (
                <Button
                  buttonType={"text"}
                  label={"See More Versions"}
                  onClick={goToNextPage}
                  id={"viewMoreVersionsButton"}
                  className={styles.viewMoreButton}
                />
              )}
            </>
          )}
        </Loading>
      )}
    </div>
  );
};

ResourceVersionSearchAndResults.propTypes = {
  genericResource: PropTypes.object.isRequired,
  onVersionSelect: PropTypes.func.isRequired,
};

export default ResourceVersionSearchAndResults;
