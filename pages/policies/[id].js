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
import Link from "next/link";
import { useRouter } from "next/router";
import { useFetch } from "hooks/useFetch";
import Loading from "components/Loading";
import styles from "styles/modules/Policy.module.scss";
import { useTheme } from "providers/theme";
import PolicyBreadcrumbs from "components/policies/PolicyBreadcrumbs";
import Button from "components/Button";
import { usePolicies } from "../../providers/policies";
import { policyActions } from "../../reducers/policies";

const Policy = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {dispatch} = usePolicies();

  const { id } = router.query;

  const { data, loading } = useFetch(id ? `/api/policies/${id}` : null);

  const editPolicy = () => {
    // TODO: save policy in state so we don't have to fetch again
    console.log('dispatch', dispatch);
    dispatch({
      type: policyActions.SET_CURRENT_POLICY,
      data: data
    });
    router.push(`/policies/${id}/edit`);
  };

  return (
    <div className={`${styles[theme]} ${styles.pageContainer}`}>
      <PolicyBreadcrumbs />
      <div className={styles.detailsContainer}>
        <Loading loading={loading}>
          {data ? (
            <>
              <div>
                <p className={styles.policyName}>{data.name}</p>
                <p className={styles.policyDescription}>{data.description}</p>
                <Button label={"Edit Policy"} onClick={editPolicy} />
              </div>
              <div className={styles.regoContainer}>
                <p>Rego Policy Code</p>
                <pre>
                  <code>{data.regoContent}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className={styles.notFound}>
              <h1 className={styles.notFound}>
                No policy found under {`"${id}"`}
              </h1>
              <p>
                Try <Link href={"/policies"}>searching for a policy</Link>.
              </p>
            </div>
          )}
        </Loading>
      </div>
    </div>
  );
};

export default Policy;
