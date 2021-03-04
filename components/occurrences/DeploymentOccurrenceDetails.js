import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DeploymentOccurrenceSection = ({occurrences}) => {
  console.log('deployment occurrence section occurrences', occurrences);
  return (
    <div>
      <p>Deployment</p>
    </div>
  )
};


DeploymentOccurrenceSection.propTypes = {
  occurrences: PropTypes.array.isRequired
};

export default DeploymentOccurrenceSection;