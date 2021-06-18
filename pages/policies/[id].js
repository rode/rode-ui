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

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import styles from "styles/modules/Policy.module.scss";
import { useTheme } from "providers/theme";
import PolicyBreadcrumbs from "components/policies/PolicyBreadcrumbs";
import Button from "components/Button";
import { usePolicy } from "hooks/usePolicy";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import PageHeader from "components/layout/PageHeader";
import PolicyDetails from "components/policies/PolicyDetails";
import DetailsHeader from "components/shared/DetailsHeader";
import DetailsNavigation from "../../components/shared/DetailsNavigation";

// TODO: pull out evaluate button into shared component

const createLinks = (baseUrl) => {
  return [
    {
      label: "Policy Details",
      href: `${baseUrl}#details`
    },
    {
      label: "History",
      href: `${baseUrl}#history`
    },
    {
      label: "Assignments",
      href: `${baseUrl}#assignments`
    }
  ]
}

const Policy = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { dispatch } = usePolicies();
  const [activeSection, setActiveSection] = useState("details")

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

  const navigationLinks = createLinks(`/policies/${id}`)

  useEffect(() => {
    const fullPath = router.asPath;
    const [, hash] = fullPath.split("#");

    setActiveSection(hash || navigationLinks[0].href.split("#")[1]);
  }, [router.asPath]);

  return (
    <>
      <PageHeader>
        <PolicyBreadcrumbs />
      </PageHeader>
      <div className={`${styles[theme]} ${styles.pageContainer}`}>
        <Loading loading={loading}>
          {policy ? (
            <>
              <DetailsHeader
                name={policy.name}
                subText={<p>{policy.description}</p>}
                actionButton={
                  <Button label={"Edit Policy"} onClick={editPolicy} />
                }
              />
              <DetailsNavigation 
                links={navigationLinks}
                activeSection={activeSection}
              />
              <Button
                label={"Evaluate in Policy Playground"}
                buttonType={"text"}
                onClick={evaluateInPlayground}
                className={styles.playgroundButton}
              />
                <PolicyDetails policy={policy} />
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
    </>
  );
};
export default Policy;
