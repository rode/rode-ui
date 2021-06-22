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
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";

const ResourceComponent = ({ newSearchTerm }) => {
  const { state, dispatch } = useResources();

  return (
    <>
      {Object.keys(state).map((key) => (
        <p key={key}>{`${key}: ${state[key]}`}</p>
      ))}
      <button
        onClick={() =>
          dispatch({
            type: resourceActions.SET_RESOURCE_SEARCH_TERM,
            data: newSearchTerm,
          })
        }
      >
        Update search term
      </button>
    </>
  );
};

ResourceComponent.propTypes = {
  newSearchTerm: PropTypes.string.isRequired,
};

export default ResourceComponent;
