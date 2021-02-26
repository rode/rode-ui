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
import styles from "styles/modules/Resources.module.scss";
import Button from "components/Button";
import { useRouter } from "next/router";
import { getResourceDetails } from "utils/resource-utils";

const ResourceSearchResult = ({ searchResult }) => {
  const { resourceName, resourceVersion } = getResourceDetails(
    searchResult.uri
  );
  const router = useRouter();

  const onClick = () => {
    router.push(`/resources/${encodeURIComponent(searchResult.uri)}`);
  };

  return (
    <div className={styles.searchCard}>
      <div>
        <p className={styles.cardHeader}>{`Resource Name: ${resourceName}`}</p>
        <p className={styles.cardText}>{`Version: ${resourceVersion}`}</p>
      </div>
      <Button onClick={onClick} label={"View Details"} />
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default ResourceSearchResult;
