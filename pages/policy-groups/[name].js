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
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import LabelWithValue from "components/LabelWithValue";

// TODO: add edit version to this screen?

const PolicyGroup = () => {
  const router = useRouter();
  const { dispatch } = useAppState();
  const { theme } = useTheme();

  const { name } = router.query;

  const { policyGroup, loading } = usePolicyGroup(name);

  const { data, loading: loadingAssignments } = usePaginatedFetch(
    policyGroup ? `/api/policy-groups/${policyGroup.name}/assignments` : null,
    {},
    50
  );

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
                  {data?.length > 0 ? (
                    <>
                      {data.map((assignment) => {
                        return (
                          <div
                            key={assignment.id}
                            className={styles.assignmentCard}
                          >
                            <div>
                              <LabelWithValue label={"Policy"} value={assignment.policyName}/>
                              <LabelWithValue label={"Version"} value={assignment.policyVersion}/>
                            </div>
                            <Button
                              label={"View Policy"}
                              buttonType={"text"}
                              onClick={() =>
                                router.push(`/policies/${assignment.policyId}`)
                              }
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p className={styles.noAssignments}>No policies are assigned to this policy group.</p>
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
