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

import React from "react";
import PropTypes from "prop-types";
import Loading from "components/Loading";
import { usePolicyGroupAssignments } from "hooks/usePolicyGroupAssignments";

const PolicyComponent = ({ policyGroupName }) => {
  const { assignments, loading } = usePolicyGroupAssignments(policyGroupName);

  return (
    <Loading loading={loading}>
      {assignments && assignments?.length > 1 ? (
        assignments.map((assignment) => {
          return <p key={assignment.id}>{assignment.id}</p>;
        })
      ) : (
        <p>No assignments</p>
      )}
    </Loading>
  );
};

PolicyComponent.propTypes = {
  policyGroupName: PropTypes.string,
};

export default PolicyComponent;
