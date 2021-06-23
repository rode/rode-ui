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

export const usePolicyGroup = (policyGroupName) => {
  const [policyGroup, setPolicyGroup] = React.useState(null);
  const {
    state: { currentPolicyGroup },
    dispatch,
  } = useAppState();

  const { data, loading } = useFetch(
    policyGroupName !== currentPolicyGroup?.name
      ? `/api/policy-groups/${policyGroupName}`
      : null
  );

  useSafeLayoutEffect(() => {
    if (policyGroupName === currentPolicyGroup?.name) {
      setPolicyGroup(currentPolicyGroup);
    } else if (data) {
      setPolicyGroup(data);

      dispatch({
        type: stateActions.SET_CURRENT_POLICY_GROUP,
        data,
      });
    }
  }, [policyGroupName, currentPolicyGroup, data]);

  return { policyGroup, loading };
};
