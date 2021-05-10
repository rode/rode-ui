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

import React, {useEffect} from "react";
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

// TODO: tests

const ChangeVersionDrawer = (props) => {
  const { isOpen, closeDrawer } = props;
  const router = useRouter();
  const { state, dispatch } = useResources();
  const {
    resourceName,
    resourceVersion: currentVersion,
    searchableName,
  } = state.currentResource;

  const { data, loading, goToNextPage, isLastPage } = usePaginatedFetch(
    searchableName ? "/api/resource-versions" : null,
    { resource: searchableName },
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
    if (data && isOpen) {
      document.getElementById("firstVersion")?.focus();
    }
  }, [data, isOpen]);

  return (
    <>
      <Drawer isOpen={isOpen} onClose={closeDrawer}>
        <Loading loading={loading}>
          {data?.length > 0 ? (
            <>
              <div className={styles.versionSelectionHeader}>
                <p className={styles.versionSelectionName}>{resourceName}</p>
                <p className={styles.versionSelectionInstructions}>
                  Select from the list below to see occurrences related to that
                  version
                </p>
              </div>
              {data.map(({ resourceVersion, uri }, index) => {
                const isCurrentVersion = resourceVersion === currentVersion;
                const versionId = index === 0 ? "firstVersion" : "";

                return (
                  <div key={resourceVersion} className={styles.versionCard}>
                    <div>
                      <LabelWithValue
                        label={"Version"}
                        value={<ResourceVersion version={resourceVersion} />}
                      />
                    </div>
                    <Button
                      buttonType={"text"}
                      label={isCurrentVersion ? "Selected" : "Select"}
                      disabled={isCurrentVersion}
                      className={styles.versionSelectionButton}
                      onClick={() => selectVersion(uri)}
                      id={versionId}
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
            <p>{`No versions found matching the resource "${resourceName}"`}</p>
          )}
        </Loading>
      </Drawer>
    </>
  );
};

ChangeVersionDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default ChangeVersionDrawer;
