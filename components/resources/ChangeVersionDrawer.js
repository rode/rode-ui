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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import Drawer from "components/Drawer";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Loading from "components/Loading";
import ResourceVersion from "./ResourceVersion";
import styles from "styles/modules/Drawer.module.scss";
import LabelWithValue from "components/LabelWithValue";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useRouter } from "next/router";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import {
  buildResourceVersionQueryParams,
  getResourceDetails,
} from "utils/resource-utils";
import { DATE_TIME_FORMAT, SEARCH_ALL } from "utils/constants";
import dayjs from "dayjs";
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";

const ChangeVersionDrawer = (props) => {
  const { isOpen, closeDrawer } = props;
  const router = useRouter();
  const { state, dispatch } = useResources();
  const {
    resourceName,
    resourceVersion: currentVersion,
    genericName,
  } = state.currentResource;

  const { data, loading, goToNextPage, isLastPage } = usePaginatedFetch(
    genericName ? "/api/resource-versions" : null,
    buildResourceVersionQueryParams(genericName, state.versionSearchTerm),
    10
  );

  const selectVersion = (uri) => {
    router.push(`/resources/${encodeURIComponent(uri)}`);
    dispatch({
      type: resourceActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });
    closeDrawer();
  };

  useEffect(() => {
    if (!isOpen) {
      dispatch({
        type: resourceActions.SET_VERSION_SEARCH_TERM,
        data: SEARCH_ALL,
      });
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer}>
      <div className={styles.versionSelectionHeader}>
        <p className={styles.versionSelectionName}>{resourceName}</p>
        <p className={styles.versionSelectionInstructions}>
          Select from the list below to see occurrences related to that version
        </p>
      </div>
      <div className={styles.versionSearchContainer}>
        <ResourceVersionSearchBar
          onSubmit={(event) => {
            event.preventDefault();
          }}
          helpText={
            <Button
              className={styles.viewAllButton}
              buttonType={"text"}
              label={"View all versions"}
              onClick={() => {
                dispatch({
                  type: resourceActions.SET_VERSION_SEARCH_TERM,
                  data: SEARCH_ALL,
                });
              }}
            />
          }
        />
      </div>
      <Loading loading={loading}>
        {data?.length > 0 ? (
          <>
            {data.map((version) => {
              const {
                resourceVersion,
                aliasLabel,
                aliases,
              } = getResourceDetails(version.versionedResourceUri, version);
              const isCurrentVersion = resourceVersion === currentVersion;

              return (
                <div key={resourceVersion} className={styles.versionCard}>
                  <div>
                    <LabelWithValue
                      label={"Version"}
                      value={<ResourceVersion version={resourceVersion} />}
                    />
                    <LabelWithValue
                      label={aliasLabel}
                      value={aliases.join(", ")}
                      className={styles.versionNames}
                    />
                    <LabelWithValue
                      label={"Created"}
                      value={dayjs(version.created).format(DATE_TIME_FORMAT)}
                      className={styles.versionNames}
                    />
                  </div>
                  <Button
                    buttonType={"text"}
                    label={isCurrentVersion ? "Selected" : "Select"}
                    disabled={isCurrentVersion}
                    className={styles.versionSelectionButton}
                    onClick={() => selectVersion(version.versionedResourceUri)}
                  >
                    {isCurrentVersion && (
                      <>
                        <Icon name={ICON_NAMES.CHECK} />
                        <p>Selected</p>
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
            {!isLastPage && (
              <Button
                buttonType="text"
                onClick={goToNextPage}
                label={"View More"}
                className={styles.viewMoreResultsButton}
              />
            )}
          </>
        ) : (
          <p
            className={styles.notFoundMessage}
          >{`No versions found matching the given criteria.`}</p>
        )}
      </Loading>
    </Drawer>
  );
};
ChangeVersionDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default ChangeVersionDrawer;
