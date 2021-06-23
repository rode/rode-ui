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

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "providers/theme";
import styles from "styles/modules/Resource.module.scss";
import { getResourceDetails } from "utils/resource-utils";
import ResourceOccurrences from "components/resources/ResourceOccurrences";
import ResourceBreadcrumbs from "components/resources/ResourceBreadcrumbs";
import Button from "components/Button";
import { policyActions } from "reducers/policies";
import { usePolicies } from "providers/appState";
import PageHeader from "components/layout/PageHeader";
import ResourceVersion from "components/resources/ResourceVersion";
import LabelWithValue from "components/LabelWithValue";
import ChangeVersionDrawer from "components/resources/ChangeVersionDrawer";
import { useFetch } from "hooks/useFetch";
import Loading from "components/Loading";
import { useSafeLayoutEffect } from "hooks/useSafeLayoutEffect";
import DetailsHeader from "components/shared/DetailsHeader";
import EvaluateInPlaygroundButton from "components/shared/EvaluateInPlaygroundButton";

const Resource = () => {
  const { theme } = useTheme();
  const { state, dispatch } = usePolicies();
  const router = useRouter();
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const { resourceUri } = router.query;

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri,
  });

  useSafeLayoutEffect(() => {
    dispatch({
      type: policyActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });

    return () => {
      dispatch({
        type: policyActions.SET_CURRENT_RESOURCE,
        data: {},
      });
    };
  }, []);

  useSafeLayoutEffect(() => {
    dispatch({
      type: policyActions.SET_CURRENT_RESOURCE,
      data: getResourceDetails(resourceUri),
    });
  }, [resourceUri]);

  const evaluateInPlayground = () => {
    dispatch({
      type: policyActions.SET_EVALUATION_RESOURCE,
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
              <EvaluateInPlaygroundButton onClick={evaluateInPlayground} />
              <ResourceOccurrences occurrences={data} />
            </>
          ) : (
            <p className={styles.notFound}>
              No resource found for <wbr /> {`"${resourceUri}"`}
            </p>
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
