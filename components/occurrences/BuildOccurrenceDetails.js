/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BuildOccurrenceDetails = ({ occurrence }) => {
  return (
    <div>
      <p>Build</p>
      <a href={occurrence.sourceUri}>View Source</a>
      <a href={occurrence.logsUri}>View Logs</a>
      <p>Started {occurrence.started}</p>
      <p>Completed {occurrence.completed}</p>
      <p>Created by {occurrence.creator}</p>

      {occurrence.artifacts?.map((artifact) => (
        <div key={artifact.id}>
          <p>{artifact.names.join(",")}</p>
          <p>{artifact.id}</p>
          <p>{artifact.checksum}</p>
        </div>
      ))}
    </div>
  );
};

BuildOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default BuildOccurrenceDetails;
