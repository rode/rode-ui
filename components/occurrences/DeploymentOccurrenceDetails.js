import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DeploymentOccurrenceSection = ({occurrence}) => {
  console.log('deployment occurrence section occurrence', occurrence);
  return (
    <div>
      <p>Deployment</p>
    </div>
  )
};


DeploymentOccurrenceSection.propTypes = {
  occurrence: PropTypes.object.isRequired
};

export default DeploymentOccurrenceSection;