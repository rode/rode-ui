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
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import Dropdown from "components/Dropdown";
import { resourceFilters } from "utils/resource-utils";

const ResourceSearchFilters = () => {
  const { state, dispatch } = useResources();

  const onChange = (selectedValues) => {
    dispatch({
      type: resourceActions.SET_TYPE_FILTER,
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
        value={state.searchTypeFilter}
      />
    </div>
  );
};

export default ResourceSearchFilters;
