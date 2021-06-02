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

import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import { useRouter } from "next/router";
import LabelWithValue from "components/LabelWithValue";
import { useTheme } from "providers/theme";
import styles from "styles/modules/Search.module.scss";
import { showError } from "utils/toast-utils";

const ResourceSearchResult = ({ searchResult }) => {
  const { id, name, type } = searchResult;
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/resource-versions?id=${encodeURIComponent(id)}&pageSize=1`
      );

      const { data } = await response.json();
      setLoading(false);
      router.push(
        `/resources/${encodeURIComponent(data[0].versionedResourceUri)}`
      );
    } catch (error) {
      showError("An unexpected error has occurred.");
      setLoading(false);
    }
  };

  return (
    <div className={`${styles[theme]} ${styles.searchCard}`}>
      <div>
        <LabelWithValue
          label={"Resource Name"}
          value={name}
          className={styles.cardHeader}
        />
        <LabelWithValue
          label={"Type"}
          value={type}
          className={styles.cardText}
        />
      </div>
      <Button onClick={onClick} label={"View Resource"} loading={loading} />
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default ResourceSearchResult;
