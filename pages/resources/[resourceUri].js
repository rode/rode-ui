import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useTheme } from "hooks/useTheme";
import useSWR from "swr";
import styles from 'styles/modules/Resources.module.scss';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getImageParts = (uri) => {
  const splitResource = uri.split("@");

  return [splitResource[0], uri.replace(`${splitResource[0]}@`, "")];
};

const Resource = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [resourceName, setResourceName] = useState('');
  const [resourceVersion, setResourceVersion] = useState('');
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
      <div className={styles.resourceHeader}>
        <p className={styles.resourceName}>{resourceName}</p>
        <p>Type: Docker Image</p>
        <p>Version: {resourceVersion}</p>
      </div>
      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.map((occurrence) => (
            <div key={occurrence.name} className={styles.resourceOccurrence}>
              <p>{occurrence.name}</p>
              <p>{occurrence.kind}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

Resource.propTypes = {};

export default Resource;
