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
import styles from "styles/modules/PolicyGroupAssignments.module.scss";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import Drawer from "components/Drawer";
import { DATE_TIME_FORMAT } from "utils/constants";
import dayjs from 'dayjs';

// TODO: show "selected" for current version
// TODO: show "latest" on latest version

const PolicyVersionDrawer = ({ isOpen, onClose, assignedPolicy, onVersionSelect }) => {
  if (!assignedPolicy) {
    return null
  }

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    `/api/policies/${assignedPolicy.policyId}/versions`,
    {},
    15
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div>
        <p>{assignedPolicy.policyName}</p>
        <p>Target a specific version of the policy when evaluating this policy group.</p>
      </div>
      <Loading loading={loading}>
        {data ? (
          <>
            {data.map((version) => {
              return (
                <div key={version.id}>
                  <div>
                  <p>{version.version}</p>
                    <p>{dayjs(version.created).format(DATE_TIME_FORMAT)}</p>
                  </div>
                  <div>
                    <Button label={"Select Version"} onClick={() => onVersionSelect(version, assignedPolicy)}/>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p>No versions found</p>
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
    </Drawer>
  );
};

PolicyVersionDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  assignedPolicy: PropTypes.object,
  onVersionSelect: PropTypes.func.isRequired
};

export default PolicyVersionDrawer;
