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
import Button from "components/Button";
import { useRouter } from "next/router";
import SearchResult from "components/shared/search/SearchResult";

const PolicySearchResult = ({ searchResult }) => {
  const { name, description, id } = searchResult;
  const router = useRouter();

  const onClick = () => {
    // TODO: save policy in state when chosen
    router.push(`/policies/${encodeURIComponent(id)}`);
  };

  return (
    <SearchResult
      mainText={`Policy Name: ${name}`}
      subText={`Description: ${description}`}
      actionButton={<Button onClick={onClick} label={"View Policy"} />}
    />
  );
};

PolicySearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default PolicySearchResult;
