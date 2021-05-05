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
import { getResourceDetails } from "utils/resource-utils";
import ResourceVersion from "./ResourceVersion";
import LabelWithValue from "components/LabelWithValue";
import { useTheme } from "providers/theme";
import styles from "styles/modules/Search.module.scss";

const ResourceSearchResult = ({ searchResult }) => {
  const { resourceName, resourceVersion, resourceType } = getResourceDetails(
    searchResult.uri
  );
  const router = useRouter();
  const { theme } = useTheme();

  const onClick = () => {
    router.push(`/resources/${encodeURIComponent(searchResult.uri)}`);
  };

  return (
    <div className={`${styles[theme]} ${styles.searchCard}`}>
      <div>
        <LabelWithValue
          label={"Resource Name"}
          value={resourceName}
          className={styles.cardHeader}
        />
        <LabelWithValue
          label={"Version"}
          value={<ResourceVersion version={resourceVersion} />}
          className={styles.cardText}
        />
        <LabelWithValue
          label={"Type"}
          value={resourceType}
          className={styles.cardText}
        />
      </div>
      <Button onClick={onClick} label={"View Resource"} />
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default ResourceSearchResult;
