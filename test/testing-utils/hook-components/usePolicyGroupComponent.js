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
import PropTypes from "prop-types";
import Loading from "components/Loading";
import { usePolicyGroup } from "hooks/usePolicyGroup";

const PolicyComponent = ({ name }) => {
  const { policyGroup, loading } = usePolicyGroup(name);

  return (
    <Loading loading={loading}>
      <p>{policyGroup?.name}</p>
    </Loading>
  );
};

PolicyComponent.propTypes = {
  name: PropTypes.string,
};

export default PolicyComponent;
