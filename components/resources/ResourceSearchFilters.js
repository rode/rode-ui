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
import styles from "styles/modules/Search.module.scss";
import Dropdown from "components/Dropdown";
import { resourceFilters } from "utils/resource-utils";
import { useAppState } from "providers/appState";
import { policyActions } from "reducers/policies";

const ResourceSearchFilters = () => {
  const { state, dispatch } = useAppState();

  const onChange = (selectedValues) => {
    dispatch({
      type: policyActions.SET_RESOURCE_TYPE_SEARCH_FILTER,
      data: selectedValues,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <Dropdown
        options={resourceFilters}
        onChange={onChange}
        closeMenuOnSelect={false}
        isMulti={true}
        name={"resourceTypeFilter"}
        label={"Filter by Resource Type"}
        placeholder={"Resource Type"}
        hideSelectedOptions={false}
        tabSelectsValue={false}
        value={state.resourceTypeSearchFilter}
      />
    </div>
  );
};

export default ResourceSearchFilters;
