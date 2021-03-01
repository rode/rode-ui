import React from "react";
import PropTypes from "prop-types";
import { useFetch } from "hooks/useFetch";

const FetchComponent = ({ url, query }) => {
  const { data, loading, error } = useFetch(url, query);

  if (data) {
    return <p>Data: {data}</p>;
  }

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return null;
};

FetchComponent.propTypes = {
  url: PropTypes.string,
  query: PropTypes.object,
};

export default FetchComponent;
