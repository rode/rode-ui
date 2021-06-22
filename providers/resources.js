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

import React, { createContext, useReducer, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { resourceReducer } from "reducers/resources";

const ResourceContext = createContext();

const initialState = {
  resourceSearchTerm: "",
  resourceVersionSearchTerm: "",
  searchTypeFilter: [],
  occurrenceDetails: null,
  currentResource: {},
};

export const ResourcesProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(resourceReducer, initialState);

  const contextValue = useMemo(() => {
    if (value) {
      return {
        state: {
          ...state,
          ...value.state,
        },
        dispatch: value.dispatch,
      };
    }

    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ResourceContext.Provider value={contextValue}>
      {children}
    </ResourceContext.Provider>
  );
};

ResourcesProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.node.isRequired,
};

export const useResources = () => {
  const { state, dispatch } = useContext(ResourceContext);

  return {
    state,
    dispatch,
  };
};
