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
import styles from "styles/modules/Breadcrumbs.module.scss";
import Link from "next/link";
import { useAppState } from "providers/appState";
import { SEARCH_ALL } from "utils/constants";
import { useTheme } from "providers/theme";
import Text from "components/Text";

const getSearchTermText = (searchTerm) => {
  if (searchTerm === SEARCH_ALL) {
    return "View all policies";
  } else {
    return `"${searchTerm}"`;
  }
};

const PolicyBreadcrumbs = () => {
  const {
    state: { policySearchTerm },
  } = useAppState();
  const { theme } = useTheme();

  if (!policySearchTerm) {
    return null;
  }

  return (
    <div className={`${styles[theme]} ${styles.breadcrumbs}`}>
      <Text.Body1 className={styles.rootCrumb}>Policy Search</Text.Body1>
      <Text.Body1 className={styles.rootCrumb}>/</Text.Body1>
      <Link href={`/policies?search=${encodeURIComponent(policySearchTerm)}`}>
        <a>{getSearchTermText(policySearchTerm)}</a>
      </Link>
    </div>
  );
};

export default PolicyBreadcrumbs;
