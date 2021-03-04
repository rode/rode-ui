import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BuildOccurrenceDetails = ({occurrences}) => {
  return (
    <div>
      <p>Build</p>
      <a href={occurrences.sourceUri}>View Source</a>
      <a href={occurrences.logsUri}>View Logs</a>
      <p>Started {occurrences.started}</p>
      <p>Completed {occurrences.completed}</p>
      <p>Created by {occurrences.creator}</p>

      {
        occurrences.artifacts?.map((artifact) => (
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
  occurrences: PropTypes.array.isRequired
};

export default BuildOccurrenceDetails;