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
import { useRouter } from "next/router";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import SearchBar from "components/shared/search/SearchBar";

const PolicySearchBar = () => {
  // TODO: create policy store
  const { state, dispatch } = useResources();
  const router = useRouter();

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.searchTerm.trim().length) {
      router.push(`/policies?search=${state.searchTerm.trim()}`);
    }
  };

  const onChange = (event) => {
    dispatch({
      type: resourceActions.SET_SEARCH_TERM,
      data: event.target.value,
    });
  };

  return (
    <SearchBar
      onSubmit={onSubmit}
      onChange={onChange}
      label={"Search for a policy"}
      name={"policySearch"}
      searchTerm={state.searchTerm}
      placeholder={"Ex: max-severe-vulnerabilities"}
      helpText={
        <>
          You can search by policy name or{" "}
          <a href={"/policies?search=all"}>view all policies</a>.
        </>
      }
    />
  );
};

export default PolicySearchBar;
