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
import { useFetch } from "./useFetch";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export const usePolicy = (policyId) => {
  const [policy, setPolicy] = React.useState(null);
  const {
    state: { currentPolicy },
    dispatch,
  } = usePolicies();

  const { data, loading } = useFetch(
    policyId !== currentPolicy?.id ? `/api/policies/${policyId}` : null
  );

  useSafeLayoutEffect(() => {
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
