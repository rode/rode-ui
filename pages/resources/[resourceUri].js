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
import { useRouter } from "next/router";
import { useTheme } from "providers/theme";
import styles from "styles/modules/Resource.module.scss";
import { getResourceDetails } from "utils/resource-utils";
import ResourceOccurrences from "components/resources/ResourceOccurrences";
import ResourceBreadcrumbs from "components/resources/ResourceBreadcrumbs";
import Button from "components/Button";
import { stateActions } from "reducers/appState";
import { useAppState } from "providers/appState";
import PageHeader from "components/layout/PageHeader";
import ResourceVersion from "components/resources/ResourceVersion";
import LabelWithValue from "components/LabelWithValue";
import ChangeVersionDrawer from "components/resources/ChangeVersionDrawer";
import { useFetch } from "hooks/useFetch";
import Loading from "components/Loading";
import { useSafeLayoutEffect } from "hooks/useSafeLayoutEffect";
import DetailsHeader from "components/shared/DetailsHeader";
import EvaluateInPlaygroundButton from "components/shared/EvaluateInPlaygroundButton";
import DetailsNavigation from "components/shared/DetailsNavigation";
import EvaluationHistory from "components/resources/EvaluationHistory";
import Text from "components/Text";
import Link from "next/link";

const EVALUATION_HISTORY = "evaluationHistory";
const OCCURRENCES = "occurrences";
const createLinks = (baseUrl) => {
  return [
    {
      label: "Evaluation History",
      href: `${baseUrl}#${EVALUATION_HISTORY}`,
    },
    {
      label: "Occurrences",
      href: `${baseUrl}#${OCCURRENCES}`,
    },
  ];
};

const Resource = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const [activeSection, setActiveSection] = useState(EVALUATION_HISTORY);
  const { resourceUri } = router.query;

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri,
  });

  const navigationLinks = createLinks(
    `/resources/${encodeURIComponent(resourceUri)}`
  );

  useEffect(() => {
    const fullPath = router.asPath;
    const [, hash] = fullPath.split("#");

    setActiveSection(hash || navigationLinks[0].href.split("#")[1]);
  }, [router.asPath]);

  useSafeLayoutEffect(() => {
    dispatch({
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });

    return () => {
      dispatch({
        type: stateActions.SET_CURRENT_RESOURCE,
        data: {},
      });
    };
  }, []);

  useSafeLayoutEffect(() => {
    dispatch({
      type: stateActions.SET_CURRENT_RESOURCE,
      data: getResourceDetails(resourceUri),
    });
  }, [resourceUri]);

  const evaluateInPlayground = () => {
    dispatch({
      type: stateActions.SET_EVALUATION_RESOURCE,
      data: {
        versionedResourceUri: resourceUri,
      },
    });
    router.push("/playground");
  };

  return (
    <>
      <PageHeader>
        <ResourceBreadcrumbs />
      </PageHeader>
      <div className={`${styles[theme]} ${styles.container}`}>
        <Loading loading={loading}>
          {data ? (
            <>
              <DetailsHeader
                name={state.currentResource.resourceName}
                subText={
                  <div className={styles.resourceDetails}>
                    <LabelWithValue
                      label={"Type"}
                      value={state.currentResource.resourceLabel}
                    />
                    <LabelWithValue
                      label={"Version"}
                      value={
                        <ResourceVersion
                          version={state.currentResource.resourceVersion}
                          copy={true}
                        />
                      }
                    />
                  </div>
                }
                actionButton={
                  <Button
                    onClick={() => setShowVersionDrawer(true)}
                    label={"Change Version"}
                  />
                }
              />
              <DetailsNavigation
                links={navigationLinks}
                activeSection={activeSection}
              />
              <EvaluateInPlaygroundButton onClick={evaluateInPlayground} />
              {activeSection === EVALUATION_HISTORY && (
                <EvaluationHistory resourceUri={resourceUri} />
              )}
              {activeSection === OCCURRENCES && (
                <ResourceOccurrences occurrences={data} />
              )}
            </>
          ) : (
            <div className={styles.notFound}>
              <Text.Heading1>
                No resource found under {`"${resourceUri}"`}
              </Text.Heading1>
              <Text.Body1>
                Try <Link href={"/resources"}>searching for a resource</Link>.
              </Text.Body1>
            </div>
          )}
        </Loading>
      </div>
      <ChangeVersionDrawer
        isOpen={showVersionDrawer}
        closeDrawer={() => setShowVersionDrawer(false)}
      />
    </>
  );
};
export default Resource;
export { getServerSideProps } from "utils/server";
