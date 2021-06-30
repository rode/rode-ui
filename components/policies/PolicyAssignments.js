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
import LabelWithValue from "components/LabelWithValue";
import styles from "styles/modules/PolicyAssignments.module.scss";
import { useTheme } from "providers/theme";
import { useFetch } from "hooks/useFetch";
import Button from "components/Button";
import { useRouter } from "next/router";

// TODO: tests
const PolicyAssignments = ({ policy }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, loading } = useFetch(`/api/policies/${policy.id}/assignments`);

  return (
    <div className={styles[theme]}>
      <Loading loading={loading}>
        {data && data?.policyAssignments?.length > 0 ? (
          <>
            {data.policyAssignments.map((assignment) => {
              return (
                <div key={assignment.id} className={styles.assignmentCard}>
                  <div>
                    <LabelWithValue
                      label={"Policy Group"}
                      value={assignment.policyGroup}
                    />
                    <LabelWithValue
                      label={"Policy Version"}
                      value={assignment.policyVersionId.split(".")[1]}
                    />
                  </div>
                  <div>
                    <Button
                      buttonType={"text"}
                      label={"View Policy Group"}
                      onClick={() =>
                        router.push(`/policy-groups/${assignment.policyGroup}`)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p className={styles.noAssignmentsMessage}>
            This policy is not assigned to any policy groups.
          </p>
        )}
      </Loading>
    </div>
  );
};

PolicyAssignments.propTypes = {
  policy: PropTypes.object.isRequired,
};

export default PolicyAssignments;
