import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "hooks/useTheme";
import useSWR from "swr";
import styles from "styles/modules/Resources.module.scss";
import ResourceOccurrenceCard from "components/occurrences/ResourceOccurrenceCard";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getImageParts = (uri) => {
  const splitResource = uri.split("@");

  return [splitResource[0], uri.replace(`${splitResource[0]}@`, "")];
};

const Resource = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [resourceName, setResourceName] = useState("");
  const [resourceVersion, setResourceVersion] = useState("");
  const { resourceUri } = router.query;

  const { data } = useSWR(
    resourceUri
      ? `/api/occurrences?resourceUri=${encodeURIComponent(resourceUri)}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (resourceUri) {
      const [name, version] = getImageParts(resourceUri);
      setResourceName(name);
      setResourceVersion(version);
    }
  }, [resourceUri]);

  return (
    <div className={`${styles[theme]}`}>
      <p>Breadcrumbs will go here</p>
      <div className={styles.resourceHeader}>
        <div>
          <p className={styles.resourceName}>{resourceName}</p>
          <p>Type: Docker Image</p>
        </div>
        <div className={styles.versionContainer}>
          <p>Version: {resourceVersion}</p>
        </div>
      </div>
      {!data ? (
        <p>Loading...</p>
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
