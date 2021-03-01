import React, { createContext, useReducer, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { resourceReducer } from "reducers/resources";

const ResourceContext = createContext();

const initialState = {
  searchTerm: "",
};

export const ResourcesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resourceReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ResourceContext.Provider value={contextValue}>
      {children}
    </ResourceContext.Provider>
  );
};

ResourcesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useResources = () => {
  const { state, dispatch } = useContext(ResourceContext);

  return {
    state,
    dispatch,
  };
};
