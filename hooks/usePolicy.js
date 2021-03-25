import React from "react";
import { useFetch } from "./useFetch";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import { isServerSide } from "utils/theme-utils";

// TODO: test this

export const usePolicy = (policyId) => {
  const [policy, setPolicy] = React.useState(null);
  const {
    state: { currentPolicy },
    dispatch,
  } = usePolicies();

  const { data, loading } = useFetch(
    policyId !== currentPolicy?.id ? `/api/policies/${policyId}` : null
  );

  const useEffect = isServerSide() ? React.useEffect : React.useLayoutEffect;

  useEffect(() => {
    if (policyId === currentPolicy?.id) {
      setPolicy(currentPolicy);
    } else if (data) {
      setPolicy(data);

      dispatch({
        type: policyActions.SET_CURRENT_POLICY,
        data,
      });
    }
  }, [policyId, currentPolicy, data]);

  return { policy, loading };
};
