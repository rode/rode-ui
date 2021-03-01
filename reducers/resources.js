const setSearchTerm = (state, data) => {
  return {
    ...state,
    searchTerm: data,
  };
};

const actionMap = {
  SET_SEARCH_TERM: setSearchTerm,
};

export const resourceReducer = (state, action) => {
  const { type, data } = action;

  return actionMap[type](state, data);
};

export const resourceActions = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
};
