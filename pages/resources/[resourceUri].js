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
import { useTheme } from "hooks/useTheme";
import useSWR from "swr";
import styles from "styles/modules/Resources.module.scss";
import ResourceOccurrenceCard from "components/occurrences/ResourceOccurrenceCard";
import { getResourceDetails } from "utils/resource-utils";
import Loading from "../../components/Loading";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Resource = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [resourceName, setResourceName] = useState("");
  const [resourceVersion, setResourceVersion] = useState("");
  const [resourceType, setResourceType] = useState("");
  const { resourceUri } = router.query;

  const { data } = useSWR(
    resourceUri
      ? `/api/occurrences?resourceUri=${encodeURIComponent(resourceUri)}`
      : null,
    fetcher
  );

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
      <div className={styles.resourceHeader}>
        <div>
          <p className={styles.resourceName}>{resourceName}</p>
          <p>Type: {resourceType}</p>
        </div>
        <div className={styles.versionContainer}>
          <p>Version: {resourceVersion}</p>
        </div>
      </div>
      {!data ? (
        <Loading />
      ) : (
        <>
          {data?.map((occurrence) => (
            <ResourceOccurrenceCard
              key={occurrence.name}
              occurrence={occurrence}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Resource;
