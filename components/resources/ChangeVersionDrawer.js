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
import styles from "styles/modules/ChangeResourceVersionDrawer.module.scss";
import LabelWithValue from "components/LabelWithValue";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useRouter } from "next/router";
import {
  buildResourceVersionQueryParams,
  getResourceDetails,
} from "utils/resource-utils";
import { DATE_TIME_FORMAT, SEARCH_ALL } from "utils/constants";
import dayjs from "dayjs";
import ResourceVersionSearchBar from "components/resources/ResourceVersionSearchBar";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { useTheme } from "providers/theme";
import Text from "components/Text";

const ChangeVersionDrawer = (props) => {
  const { isOpen, closeDrawer } = props;
  const router = useRouter();
  const { theme } = useTheme();
  const { state, dispatch } = useAppState();
  const {
    resourceName,
    resourceVersion: currentVersion,
    genericName,
  } = state.currentResource;

  const { data, loading, goToNextPage, isLastPage } = usePaginatedFetch(
    genericName ? "/api/resource-versions" : null,
    buildResourceVersionQueryParams(
      genericName,
      state.resourceVersionSearchTerm
    ),
    10
  );

  const selectVersion = (uri) => {
    router.push(`/resources/${encodeURIComponent(uri)}`);
    dispatch({
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });
    closeDrawer();
  };

  useEffect(() => {
    if (!isOpen) {
      dispatch({
        type: stateActions.SET_RESOURCE_VERSION_SEARCH_TERM,
        data: SEARCH_ALL,
      });
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer}>
      <div className={`${styles[theme]}`}>
        <div className={styles.headerContainer}>
          <Text.Body1>{resourceName}</Text.Body1>
          <Text.Body2 className={styles.instructions}>
            Select from the list below to see occurrences related to that
            version
          </Text.Body2>
        </div>
        <div className={styles.searchContainer}>
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
                    type: stateActions.SET_RESOURCE_VERSION_SEARCH_TERM,
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
                        className={styles.cardSubtext}
                      />
                      <LabelWithValue
                        label={"Created"}
                        value={dayjs(version.created).format(DATE_TIME_FORMAT)}
                        className={styles.cardSubtext}
                      />
                    </div>
                    <Button
                      buttonType={"text"}
                      label={isCurrentVersion ? "Selected" : "Select"}
                      disabled={isCurrentVersion}
                      className={styles.actionButton}
                      onClick={() =>
                        selectVersion(version.versionedResourceUri)
                      }
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
            <Text.Body1
              className={styles.notFoundMessage}
            >{`No versions found matching the given criteria.`}</Text.Body1>
          )}
        </Loading>
      </div>
    </Drawer>
  );
};
ChangeVersionDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default ChangeVersionDrawer;
