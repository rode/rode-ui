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
import { policyReducer } from "reducers/policies";

const PolicyContext = createContext();

const initialState = {
  policySearchTerm: "",
  currentPolicy: null,
  evaluationResource: null,
  evaluationPolicy: null,
  currentPolicyGroup: null,
  resourceSearchTerm: "",
  resourceVersionSearchTerm: "",
  resourceTypeSearchFilter: [],
  occurrenceDetails: null,
  currentResource: {},
};

export const PoliciesProvider = ({ value, children }) => {
  const [state, dispatch] = useReducer(policyReducer, initialState);

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
    <PolicyContext.Provider value={contextValue}>
      {children}
    </PolicyContext.Provider>
  );
};

PoliciesProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.node.isRequired,
};

export const usePolicies = () => {
  const { state, dispatch } = useContext(PolicyContext);

  return {
    state,
    dispatch,
  };
};
