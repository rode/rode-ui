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
import Loading from "components/Loading";
import styles from "styles/modules/Policy.module.scss";
import textStyles from "styles/modules/Typography.module.scss";
import { useTheme } from "providers/theme";
import PolicyBreadcrumbs from "components/policies/PolicyBreadcrumbs";
import Button from "components/Button";
import { usePolicy } from "hooks/usePolicy";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import PageHeader from "components/layout/PageHeader";
import Code from "components/Code";

// TODO: creating a policy and navigating to policy page does not show correct information

const Policy = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { dispatch } = usePolicies();

  const { id } = router.query;

  const { policy, loading } = usePolicy(id);

  const editPolicy = () => {
    router.push(`/policies/${id}/edit`);
  };

  const evaluateInPlayground = () => {
    dispatch({
      type: policyActions.SET_EVALUATION_POLICY,
      data: policy,
    });
    router.push("/playground");
  };

  return (
    <>
      <PageHeader>
        <PolicyBreadcrumbs />
      </PageHeader>
      <div className={`${styles[theme]} ${styles.pageContainer}`}>
        <div className={styles.detailsContainer}>
          <Loading loading={loading}>
            {policy ? (
              <>
                <div className={styles.detailsHeader}>
                  <div className={styles.detailsHeaderTextContainer}>
                    <p className={styles.policyName}>{policy.name}</p>
                    <p className={styles.policyDescription}>
                      {policy.description}
                    </p>
                  </div>
                  <Button label={"Edit Policy"} onClick={editPolicy} />
                </div>
                <Button
                  label={"Evaluate in Policy Playground"}
                  buttonType={"text"}
                  onClick={evaluateInPlayground}
                  className={styles.playgroundButton}
                />
                <div className={styles.regoContainer}>
                  <p className={textStyles.label}>Rego Policy Code</p>
                  <Code code={policy.regoContent} language={"rego"} />
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
    </>
  );
};

export default Policy;
