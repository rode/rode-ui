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
import { usePaginatedFetch } from "hooks/usePaginatedFetch";

const PaginatedFetchComponent = ({ url, query, pageSize }) => {
  const { data, loading, error, isLastPage, goToNextPage } = usePaginatedFetch(
    url,
    query,
    pageSize
  );

  if (data) {
    return (
      <>
        {data.map(({ name }) => (
          <p key={name}>{name}</p>
        ))}
        {isLastPage && <p>Last Page</p>}
        <button onClick={goToNextPage}>Next page please</button>
      </>
    );
  }

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return null;
};

PaginatedFetchComponent.propTypes = {
  url: PropTypes.string,
  query: PropTypes.object,
  pageSize: PropTypes.number.isRequired,
};

export default PaginatedFetchComponent;
