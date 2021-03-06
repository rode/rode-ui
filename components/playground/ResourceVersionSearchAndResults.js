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
import styles from "styles/modules/PlaygroundSearchAndResults.module.scss";
import Loading from "components/Loading";
import {
  buildResourceVersionQueryParams,
  getResourceDetails,
} from "utils/resource-utils";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { PLAYGROUND_SEARCH_PAGE_SIZE, SEARCH_ALL } from "utils/constants";
import ResourceVersion from "components/resources/ResourceVersion";
import LabelWithValue from "components/LabelWithValue";
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";
import useDebouncedValue from "hooks/useDebouncedValue";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { useTheme } from "providers/theme";
import Text from "components/Text";

const ResourceVersionSearchAndResults = ({
  selectedResource,
  onVersionSelect,
}) => {
  const [versionSearch, setVersionSearch] = useState(!!selectedResource);
  const [debounceDelay, setDebounceDelay] = useState(500);
  const { theme } = useTheme();
  const { state, dispatch } = useAppState();

  const debouncedSearch = useDebouncedValue(
    state.resourceVersionSearchTerm,
    debounceDelay
  );

  if (!selectedResource) {
    return <p>Select a resource to view a list of versions</p>;
  }

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    "/api/resource-versions",
    buildResourceVersionQueryParams(selectedResource.id, debouncedSearch),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  return (
    <div className={`${styles[theme]} ${styles.searchContainer}`}>
      <ResourceVersionSearchBar
        onSubmit={(event) => {
          event.preventDefault();
          setVersionSearch(true);
        }}
        onBlur={() => setDebounceDelay(0)}
        onChange={() => {
          setDebounceDelay(500);
        }}
        helpText={
          <Button
            className={styles.viewAllButton}
            buttonType={"text"}
            label={"View all versions"}
            onClick={() => {
              setVersionSearch(true);
              dispatch({
                type: stateActions.SET_RESOURCE_VERSION_SEARCH_TERM,
                data: SEARCH_ALL,
              });
            }}
          />
        }
      />
      {versionSearch && (
        <Loading loading={loading} type={"button"}>
          {data?.length > 0 ? (
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
                        className={styles.cardHeader}
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
          ) : (
            <Text.Body1>{`No versions found matching "${state.resourceVersionSearchTerm}"`}</Text.Body1>
          )}
        </Loading>
      )}
    </div>
  );
};

ResourceVersionSearchAndResults.propTypes = {
  selectedResource: PropTypes.object.isRequired,
  onVersionSelect: PropTypes.func.isRequired,
};

export default ResourceVersionSearchAndResults;
