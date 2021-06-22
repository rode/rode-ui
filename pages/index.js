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

import React, { useEffect } from "react";
import styles from "styles/modules/Home.module.scss";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import PolicySearchBar from "components/policies/PolicySearchBar";
import { useTheme } from "providers/theme";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import Link from "next/link";
import { useRouter } from "next/router";
import { SEARCH_ALL } from "utils/constants";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { state: resourceState, dispatch: resourceDispatch } = useResources();
  const { state: policyState, dispatch: policyDispatch } = usePolicies();

  useEffect(() => {
    resourceDispatch({
      type: resourceActions.SET_RESOURCE_SEARCH_TERM,
      data: "",
    });

    policyDispatch({
      type: policyActions.SET_POLICY_SEARCH_TERM,
      data: "",
    });
  }, []);

  const onSubmit = (event, url, searchTerm) => {
    event.preventDefault();

    if (searchTerm.trim().length) {
      router.push(`/${url}?search=${searchTerm.trim()}`);
    } else {
      router.push(`/${url}?search=${SEARCH_ALL}`);
    }
  };

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <div className={styles.card}>
        <ResourceSearchBar
          onSubmit={(event) =>
            onSubmit(event, "resources", resourceState.searchTerm)
          }
          helpText={
            <>
              You can search by resource name or{" "}
              <Link href={`/resources?search=${SEARCH_ALL}`}>
                view all resources
              </Link>
              .
            </>
          }
        />
      </div>
      <div className={styles.card}>
        <PolicySearchBar
          onSubmit={(event) =>
            onSubmit(event, "policies", policyState.policySearchTerm)
          }
          helpText={
            <>
              You can search by policy name or{" "}
              <Link href={`/policies?search=${SEARCH_ALL}`}>
                view all policies
              </Link>
              .
            </>
          }
        />
      </div>
    </div>
  );
};

export default Home;
