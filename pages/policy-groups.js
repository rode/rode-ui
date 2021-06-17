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

const PolicyGroups = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    "/api/policy-groups",
    {},
    100
  );

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
                <div key={group.name} className={styles.card}>
                  <p className={styles.policyGroupName}>{group.name}</p>
                  <p>{group.description}</p>
                </div>
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
            <p>No policy groups exist.</p>
          )}
        </Loading>
      </div>
    </div>
  );
};

export default PolicyGroups;
