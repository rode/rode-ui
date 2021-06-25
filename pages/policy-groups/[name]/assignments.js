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
import { useRouter } from "next/router";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import Loading from "components/Loading";
import Link from "next/link";
import styles from "styles/modules/PolicyGroupAssignments.module.scss";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import PolicySearchAndResults from "components/policy-groups/PolicySearchAndResults";
import { useTheme } from "providers/theme";
import Icon from "../../../components/Icon";
import { ICON_NAMES } from "../../../utils/icon-utils";
import PageHeader from "../../../components/layout/PageHeader";

const EditPolicyGroupAssignments = () => {
  const router = useRouter();

  const { name } = router.query;
  const { theme } = useTheme();

  const { policyGroup, loading } = usePolicyGroup(name);

  const {
    data: assignmentData,
    loading: loadingAssignments,
  } = usePaginatedFetch(
    policyGroup ? `/api/policy-groups/${policyGroup.name}/assignments` : null,
    {},
    50
  );

  return (
    <>
      <PageHeader>
        <h1>Edit Policy Group Assignments</h1>
      </PageHeader>
      <div className={`${styles[theme]} ${styles.pageContainer}`}>
        <Loading loading={loading}>
          {policyGroup ? (
            <div className={styles.contentContainer}>
              <div className={styles.assignmentsContainer}>
                <p>{policyGroup.name}</p>
                <p>Assigned Policies</p>
                <Loading loading={loadingAssignments}>
                  {assignmentData?.length > 0 ? (
                    <>
                      {assignmentData.map((assignment) => {
                        return (
                          <div key={assignment.id} className={styles.assignmentChip}>
                            <div className={styles.assignmentDetails}>
                              <p>{assignment.policyName}</p>
                              <p>Version {assignment.policyVersion}</p>
                            </div>
                            <Button
                              label={"Remove Policy Assignment"}
                              buttonType={"icon"}
                              onClick={() => {}}
                            >
                              <Icon name={ICON_NAMES.X_CIRCLE} size={"large"} />
                            </Button>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>No policies are assigned to this policy group.</p>
                  )}
                </Loading>
              </div>
              <PolicySearchAndResults />
            </div>
          ) : (
            <div className={styles.notFoundContainer}>
              <h1>No policy group found under {`"${name}"`}</h1>
              <p>
                Go to the <Link href={"/policy-groups"}>dashboard</Link> to view
                all policy groups
              </p>
            </div>
          )}
        </Loading>

        <div className={styles.actionButtonsContainer}>
          <Button label={"Save Assignments"} type={"button"} onClick={() => {}}/>
          <Button label={"Cancel"} buttonType={"text"} type={"button"} onClick={router.back}/>
        </div>
      </div>
    </>
  );
};

export default EditPolicyGroupAssignments;
