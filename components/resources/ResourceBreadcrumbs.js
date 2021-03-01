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
import { useResources } from "providers/resources";
import styles from "styles/modules/Resources.module.scss";
import Link from "next/link";

const createBreadcrumbs = (searchTerm) => {
  return [
    {
      label: `"${searchTerm}"`,
      href: `/resources?search=${encodeURIComponent(searchTerm)}`,
    },
  ];
};

const ResourceBreadcrumbs = () => {
  const { state } = useResources();

  if (!state.searchTerm) {
    return null;
  }

  const breadcrumbs = createBreadcrumbs(state.searchTerm);

  return (
    <div className={styles.breadcrumbs}>
      <p>Resource Search</p>
      <p>/</p>
      {breadcrumbs
        .map((crumb) => (
          <Link key={crumb.href} href={crumb.href}>
            <a>{crumb.label}</a>
          </Link>
        ))
        .reduce((prev, curr) => [prev, "/", curr])}
    </div>
  );
};

export default ResourceBreadcrumbs;
