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
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";

const Resource = () => {
  const { theme } = useTheme();
  const { dispatch } = useResources();
  const router = useRouter();
  const [resourceName, setResourceName] = useState("");
  const [resourceVersion, setResourceVersion] = useState("");
  const [resourceType, setResourceType] = useState("");
  const { resourceUri } = router.query;

  useEffect(() => {
    dispatch({
      type: resourceActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });
  }, []);

  useEffect(() => {
    if (resourceUri) {
      const {
        resourceName: name,
        resourceVersion: version,
        resourceType: type,
      } = getResourceDetails(resourceUri);
      setResourceName(name);
      setResourceVersion(version);
      setResourceType(type);
    }
  }, [resourceUri]);

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <ResourceBreadcrumbs />
      <div className={styles.resourceHeader}>
        <div>
          <p className={styles.resourceName}>{resourceName}</p>
          <p>Type: {resourceType}</p>
        </div>
        <div className={styles.versionContainer}>
          <p className={styles.version}>Version: {resourceVersion}</p>
        </div>
      </div>

      <ResourceOccurrences resourceUri={resourceUri} />
    </div>
  );
};

export default Resource;
