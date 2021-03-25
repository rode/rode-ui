import React from "react";
import PropTypes from "prop-types";
import Loading from "components/Loading";
import { usePolicy } from "hooks/usePolicy";

const PolicyComponent = ({ id }) => {
  const { policy, loading } = usePolicy(id);

  return (
    <Loading loading={loading}>
      <p>{policy?.name}</p>
    </Loading>
  );
};

PolicyComponent.propTypes = {
  id: PropTypes.string,
};

export default PolicyComponent;
