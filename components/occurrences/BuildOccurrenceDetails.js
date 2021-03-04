import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BuildOccurrenceDetails = ({occurrence}) => {
  return (
    <div>
      <p>Build</p>
      <a href={occurrence.sourceUri}>View Source</a>
      <a href={occurrence.logsUri}>View Logs</a>
      <p>Started {occurrence.started}</p>
      <p>Completed {occurrence.completed}</p>
      <p>Created by {occurrence.creator}</p>

      {
        occurrence.artifacts?.map((artifact) => (
          <div key={artifact.id}>
            <p>{artifact.names.join(',')}</p>
            <p>{artifact.id}</p>
            <p>{artifact.checksum}</p>
          </div>
        ))
      }
    </div>
  )
};


BuildOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired
};

export default BuildOccurrenceDetails;