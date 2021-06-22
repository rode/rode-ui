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
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";

const PolicyComponent = ({ newSearchTerm }) => {
  const { state, dispatch } = usePolicies();

  return (
    <>
      {Object.keys(state).map((key) => (
        <div key={key}>
          <h1>{key}</h1>
          <span>:</span>
          <h2>{state[key]}</h2>
        </div>
      ))}
      <button
        onClick={() =>
          dispatch({
            type: policyActions.SET_POLICY_SEARCH_TERM,
            data: newSearchTerm,
          })
        }
      >
        Update search term
      </button>
    </>
  );
};

PolicyComponent.propTypes = {
  newSearchTerm: PropTypes.string.isRequired,
};

export default PolicyComponent;
