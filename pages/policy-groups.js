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
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import Button from "components/Button";
import PageHeader from "components/layout/PageHeader";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Loading from "components/Loading";
import styles from "styles/modules/PolicyGroupDashboard.module.scss";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import Text from "components/Text";

const PolicyGroups = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { dispatch } = useAppState();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    "/api/policy-groups",
    {},
    100
  );

  const navigateToPolicyGroupPage = (policyGroup) => {
    dispatch({
      type: stateActions.SET_CURRENT_POLICY_GROUP,
      data: policyGroup,
    });
    router.push(`/policy-groups/${encodeURIComponent(policyGroup.name)}`);
  };

  return (
    <div className={styles[theme]}>
      <Button
        label={"Create New Policy Group"}
        onClick={() => router.push("/policy-groups/new")}
        className={styles.createNewButton}
      />
      <PageHeader>
        <h1>Manage Policy Groups</h1>
      </PageHeader>
      <div className={styles.cardsContainer}>
        <Loading loading={loading}>
          {data?.length > 0 ? (
            <>
              {data.map((group) => (
                <button
                  key={group.name}
                  className={styles.card}
                  onClick={() => navigateToPolicyGroupPage(group)}
                >
                  <p className={styles.policyGroupName}>{group.name}</p>
                  {group.description && <p>{group.description}</p>}
                </button>
              ))}
              {!isLastPage && (
                <Button
                  buttonType="text"
                  onClick={goToNextPage}
                  label={"View More"}
                />
              )}
            </>
          ) : (
            <Text.Body1 className={styles.noGroupsMessage}>
              No policy groups exist.
            </Text.Body1>
          )}
        </Loading>
      </div>
    </div>
  );
};

export default PolicyGroups;
