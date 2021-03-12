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

const ResourceSearchBar = () => {
  const { state, dispatch } = useResources();
  const router = useRouter();

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.searchTerm.trim().length) {
      router.push(`/resources?search=${state.searchTerm.trim()}`);
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
      label={"Search for a resource"}
      name={"resourceSearch"}
      searchTerm={state.searchTerm}
      placeholder={"ex: alpine@sha256:etcetcetc"}
      helpText={
        <>
          You can search by name, version, or{" "}
          <a href={"/resources?search=all"}>view all resources</a>.
        </>
      }
    />
  );
};

export default ResourceSearchBar;
