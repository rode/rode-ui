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
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export const usePolicyGroupAssignments = (policyGroupName) => {
  const [assignments, setAssignments] = React.useState(null);
  const {
    state: { currentPolicyGroupAssignments },
    dispatch,
  } = useAppState();

  const { data, loading } = useFetch(
    policyGroupName
      ? `/api/policy-groups/${policyGroupName}/assignments`
      : null,
    {}
  );

  useSafeLayoutEffect(() => {
    if (policyGroupName === currentPolicyGroupAssignments?.[0]?.policyGroup) {
      setAssignments(currentPolicyGroupAssignments);
    } else if (data) {
      setAssignments(data.data);

      dispatch({
        type: stateActions.SET_CURRENT_POLICY_GROUP_ASSIGNMENTS,
        data: data.data,
      });
    }
  }, [policyGroupName, currentPolicyGroupAssignments, data]);

  return { assignments, loading };
};
