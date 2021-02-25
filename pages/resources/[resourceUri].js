import React from "react";
// import PropTypes from "prop-types";
import { useRouter } from "next/router";
// import { useTheme } from "../../hooks/useTheme";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Resource = () => {
  // const { theme } = useTheme();
  const router = useRouter();
  const { resourceUri } = router.query;

  const { data } = useSWR(
    resourceUri
      ? `/api/occurrences?resourceUri=${encodeURIComponent(resourceUri)}`
      : null,
    fetcher
  );

  console.log("data", data);

  return (
    <div>
      <p>Resource: {resourceUri}</p>
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
