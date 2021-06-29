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

import React from "react";
import PropTypes from "prop-types";
import Loading from "components/Loading";
import styles from "styles/modules/PolicyVersionDrawer.module.scss";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import Drawer from "components/Drawer";
import { DATE_TIME_FORMAT } from "utils/constants";
import dayjs from "dayjs";
import { useTheme } from "providers/theme";
import LabelWithValue from "components/LabelWithValue";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const PolicyVersionDrawer = ({
  isOpen,
  onClose,
  assignedPolicy,
  onVersionSelect,
}) => {
  if (!assignedPolicy) {
    return null;
  }

  const { theme } = useTheme();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    `/api/policies/${assignedPolicy.policyId}/versions`,
    {},
    15
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className={`${styles[theme]}`}>
        <div className={styles.drawerHeader}>
          <p className={styles.policyName}>{assignedPolicy.policyName}</p>
          <p className={styles.instructions}>Target a specific version of this policy</p>
        </div>
        <Loading loading={loading}>
          {data ? (
            <>
              {data.map((version, index) => {
                const isSelected = assignedPolicy.policyVersion === version.version;

                return (
                  <div key={version.id} className={styles.versionCard}>
                    <div>
                      <LabelWithValue
                        label={"Version"}
                        value={`${version.version} ${index === 0 ? " (latest)" : ""}`}
                      />
                      <LabelWithValue
                        label={"Created"}
                        value={dayjs(version.created).format(DATE_TIME_FORMAT)}
                        className={styles.cardDetails}
                      />
                    </div>
                    <div>
                      <Button
                        label={isSelected ? "Selected" : "Select Version"}
                        buttonType={"text"}
                        onClick={() => onVersionSelect(version, assignedPolicy)}
                        disabled={isSelected}
                      >
                        {isSelected && (
                          <>
                            <Icon name={ICON_NAMES.CHECK} />
                            <p>Selected</p>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className={styles.noVersionsMessage}>No versions found</p>
          )}
          {!isLastPage && (
            <Button
              buttonType="text"
              onClick={goToNextPage}
              label={"View More"}
              className={styles.viewMoreResultsButton}
            />
          )}
        </Loading>
      </div>
    </Drawer>
  );
};

PolicyVersionDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  assignedPolicy: PropTypes.object,
  onVersionSelect: PropTypes.func.isRequired,
};

export default PolicyVersionDrawer;
