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
import PropTypes from 'prop-types';
import Select from 'react-select';
import styles from "styles/modules/Search.module.scss";
import textStyles from "styles/modules/Typography.module.scss";
import { useResources } from "providers/resources";
import { resourceActions } from "../../reducers/resources";

// TODO: create dropdown component that takes in label and does the styling for me
// TODO: turn this into a const and build out remaining types
const resourceLabels = {
  "DOCKER": "Docker",
  "GIT": "Git",
  "NPM": "NPM"
};

const options = [
  {label: "Docker", value: "DOCKER"},
  {label: "Git", value: "GIT"},
  {label: "NPM", value: "NPM"},
  {label: "RPM", value: "RPM"},
]

const ResourceSearchFilters = ({resources}) => {
  const {state, dispatch} = useResources();
  const resourceTypes = Array.from(new Set(resources.map((resource) => resource.type)));
  // const options = resourceTypes.map((type) => ({
  //   label: resourceLabels[type],
  //   value: type
  // }));

  const onChange = (selectedValues) => {
    dispatch({
      type: resourceActions.SET_TYPE_FILTER,
      data: selectedValues.map(({value}) => value)
    })
  }

  return (
    <div className={styles.filterContainer}>
      <p className={textStyles.label}>Filter by Resource Type</p>
      <Select
        options={options}
        onChange={onChange}
        closeMenuOnSelect={false}
        isMulti={true}
        name={"resourceTypeFilter"}
        placeholder={"Resource Type"}
        className={styles.filterDropdown}
      />
    </div>
  );
};

ResourceSearchFilters.propTypes = {
  resources: PropTypes.array.isRequired
};

export default ResourceSearchFilters;
