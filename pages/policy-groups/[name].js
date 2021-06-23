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
import { usePolicies } from "providers/appState";
import { policyActions } from "reducers/policies";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import Link from "next/link";

const PolicyGroup = () => {
  const router = useRouter();
  const { dispatch } = usePolicies();
  const { theme } = useTheme();

  const { name } = router.query;

  const { policyGroup, loading } = usePolicyGroup(name);

  const editPolicy = () => {
    dispatch({
      type: policyActions.SET_CURRENT_POLICY_GROUP,
      data: policyGroup,
    });
    router.push(`/policy-groups/${name}/edit`);
  };

  return (
    <>
      <PageHeader>
        <h1>Manage Policy Groups</h1>
      </PageHeader>
      <div className={`${styles[theme]}`}>
        <Loading loading={loading}>
          {policyGroup ? (
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
