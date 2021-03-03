import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useResources } from "../../providers/resources";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";

const OccurrenceDetails = () => {
  const {state} = useResources();

  const {occurrenceDetails} = state;

  console.log('occurrenceDetails', occurrenceDetails);

  return (
    <div>
      <p>Occurrence Details go here</p>
      <OccurrenceCodeBlock occurrence={occurrenceDetails?.original}/>
    </div>
  )
};

OccurrenceDetails.propTypes = {};

export default OccurrenceDetails;