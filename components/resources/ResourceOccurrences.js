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

import Loading from "../Loading";
import ResourceOccurrenceCard from "./ResourceOccurrenceCard";
import React from "react";
import PropTypes from "prop-types";
import { useFetch } from "hooks/useFetch";

const ResourceOccurrences = (props) => {
  const { resourceUri } = props;

  const { data, loading } = useFetch(
    resourceUri
      ? `/api/occurrences?resourceUri=${encodeURIComponent(resourceUri)}`
      : null
  );
  return (
    <>
      {loading && <Loading />}
      {data && (
        <>
          {data?.map((occurrence) => (
            <ResourceOccurrenceCard
              key={occurrence.name}
              occurrence={occurrence}
            />
          ))}
        </>
      )}
    </>
  );
};

ResourceOccurrences.propTypes = {
  resourceUri: PropTypes.string.isRequired,
};

export default ResourceOccurrences;