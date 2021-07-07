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
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import PageHeader from "components/layout/PageHeader";
import PolicyDetails from "components/policies/PolicyDetails";
import DetailsHeader from "components/shared/DetailsHeader";
import DetailsNavigation from "components/shared/DetailsNavigation";
import PolicyHistory from "components/policies/PolicyHistory";
import EvaluateInPlaygroundButton from "components/shared/EvaluateInPlaygroundButton";
import PolicyAssignments from "components/policies/PolicyAssignments";
import Text from "components/Text";

const DETAILS = "details";
const HISTORY = "history";
const ASSIGNMENTS = "assignments";

const createLinks = (baseUrl) => {
  return [
    {
      label: "Policy Details",
      href: `${baseUrl}#${DETAILS}`,
    },
    {
      label: "History",
      href: `${baseUrl}#${HISTORY}`,
    },
    {
      label: "Assignments",
      href: `${baseUrl}#${ASSIGNMENTS}`,
    },
  ];
};

const Policy = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { dispatch } = useAppState();
  const [activeSection, setActiveSection] = useState(DETAILS);

  const { id } = router.query;

  const { policy, loading } = usePolicy(id);

  const editPolicy = () => {
    router.push(`/policies/${id}/edit`);
  };

  const evaluateInPlayground = () => {
    dispatch({
      type: stateActions.SET_EVALUATION_POLICY,
      data: policy,
    });
    router.push("/playground");
  };

  const navigationLinks = createLinks(`/policies/${id}`);

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
                name={`${policy.name} v${policy.policyVersion}`}
                subText={
                  <div className={styles.policyDetails}>
                    <Text.Body2>Latest Version {policy.currentVersion}</Text.Body2>
                    <Text.Body2>{policy.description}</Text.Body2>
                  </div>
                }
                actionButton={
                  <Button label={"Edit Policy"} onClick={editPolicy} />
                }
              />
              <EvaluateInPlaygroundButton onClick={evaluateInPlayground} />
              <DetailsNavigation
                links={navigationLinks}
                activeSection={activeSection}
              />
              {activeSection === DETAILS && <PolicyDetails policy={policy} />}
              {activeSection === HISTORY && <PolicyHistory policy={policy} />}
              {activeSection === ASSIGNMENTS && (
                <PolicyAssignments policy={policy} />
              )}
            </>
          ) : (
            <div className={styles.notFound}>
              <Text.Heading1>No policy found under {`"${id}"`}</Text.Heading1>
              <Text.Body1>
                Try <Link href={"/policies"}>searching for a policy</Link>.
              </Text.Body1>
            </div>
          )}
        </Loading>
      </div>
    </>
  );
};
export default Policy;
