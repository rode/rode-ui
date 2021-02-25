import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useTheme } from "hooks/useTheme";
import useSWR from "swr";
import styles from 'styles/modules/Resources.module.scss';

// TODO: look into hard reload errors

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getImageParts = (uri) => {
  const splitResource = uri.split("@");

  return [splitResource[0], uri.replace(`${splitResource[0]}@`, "")];
};

const Resource = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { resourceUri } = router.query;
  const [resourceName, version] = getImageParts(resourceUri);

  const { data } = useSWR(
    resourceUri
      ? `/api/occurrences?resourceUri=${encodeURIComponent(resourceUri)}`
      : null,
    fetcher
  );

  console.log("data", data);

  return (
    <div className={`${styles[theme]}`}>
      <div className={styles.resourceHeader}>
        <p className={styles.resourceName}>{resourceName}</p>
        <p>Type: Docker Image</p>
        <p>Version: {version}</p>
      </div>
      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.map((occurrence) => (
            <React.Fragment key={occurrence.name}>
              <p>{occurrence.name}</p>
              <p>{occurrence.kind}</p>
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};

Resource.propTypes = {};

export default Resource;
