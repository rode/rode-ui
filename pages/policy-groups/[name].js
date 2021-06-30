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
import styles from "styles/modules/PolicyGroupDetails.module.scss";
import { useTheme } from "providers/theme";
import PageHeader from "components/layout/PageHeader";
import Loading from "components/Loading";
import Button from "components/Button";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import Link from "next/link";
import PolicyAssignmentCard from "components/policy-groups/PolicyAssignmentCard";
import { usePolicyGroupAssignments } from "hooks/usePolicyGroupAssignments";

const PolicyGroup = () => {
  const router = useRouter();
  const { dispatch } = useAppState();
  const { theme } = useTheme();

  const { name } = router.query;

  const { policyGroup, loading } = usePolicyGroup(name);

  const {
    assignments,
    loading: loadingAssignments,
  } = usePolicyGroupAssignments(policyGroup?.name);

  const editPolicy = () => {
    dispatch({
      type: stateActions.SET_CURRENT_POLICY_GROUP,
      data: policyGroup,
    });
    router.push(`/policy-groups/${name}/edit`);
  };

  return (
    <>
      <PageHeader>
        <h1>Manage Policy Groups</h1>
      </PageHeader>
      <div className={`${styles[theme]} ${styles.pageContainer}`}>
        <Loading loading={loading}>
          {policyGroup ? (
            <>
              <div className={styles.policyGroupHeader}>
                <div>
                  <p className={styles.policyGroupName}>{policyGroup.name}</p>
                  {policyGroup.description && (
                    <p className={styles.policyGroupDescription}>
                      {policyGroup.description}
                    </p>
                  )}
                </div>
                <div>
                  <Button
                    label={"Edit Policy Group"}
                    onClick={editPolicy}
                    buttonType={"text"}
                  />
                </div>
              </div>
              <div className={styles.policyGroupDetailsContainer}>
                <div className={styles.assignmentsHeaderContainer}>
                  <p className={styles.assignmentsHeader}>Assigned Policies</p>
                  <Button
                    label={"Edit Assignments"}
                    buttonType={"text"}
                    onClick={() =>
                      router.push(`/policy-groups/${name}/assignments`)
                    }
                  />
                </div>
                <Loading loading={loadingAssignments}>
                  {assignments?.length > 0 ? (
                    <>
                      {assignments.map((assignment) => {
                        return (
                          <PolicyAssignmentCard
                            key={assignment.id}
                            policy={assignment}
                            actions={
                              <Button
                                label={"View Policy"}
                                buttonType={"text"}
                                onClick={() =>
                                  router.push(
                                    `/policies/${assignment.policyId}`
                                  )
                                }
                              />
                            }
                          />
                        );
                      })}
                    </>
                  ) : (
                    <p className={styles.noAssignments}>
                      No policies are assigned to this policy group.
                    </p>
                  )}
                </Loading>
              </div>
            </>
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
      </div>
    </>
  );
};

export default PolicyGroup;
