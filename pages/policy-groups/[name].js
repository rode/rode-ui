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
import { useFetch } from "hooks/useFetch";
import Loading from "components/Loading";
import Button from "components/Button";

// TODO: tests

const Policy = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const { name } = router.query;

  const { data, loading } = useFetch(`/api/policy-groups/${name}`);

  const editPolicy = () => {
    router.push(`/policy-groups/${name}/edit`);
  };

  return (
    <>
      <PageHeader>
        <h1>Manage Policy Groups</h1>
      </PageHeader>
      <div className={`${styles[theme]}`}>
        <Loading loading={loading}>
          {data ? (
            <div className={styles.policyGroupHeader}>
              <div>
                <p className={styles.policyGroupName}>{data.name}</p>
                <p className={styles.policyGroupDescription}>
                  {data.description}
                </p>
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
            <p>Policy Group not found.</p>
          )}
        </Loading>
      </div>
    </>
  );
};

export default Policy;
