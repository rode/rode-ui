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

const Home = () => {
  const { theme } = useTheme();
  const { dispatch: resourceDispatch } = useResources();
  const { dispatch: policyDispatch } = usePolicies();

  useEffect(() => {
    resourceDispatch({
      type: resourceActions.SET_SEARCH_TERM,
      data: "",
    });

    policyDispatch({
      type: policyActions.SET_SEARCH_TERM,
      data: "",
    });
  }, []);

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <div className={styles.card}>
        <ResourceSearchBar />
      </div>
      <div className={styles.card}>
        <PolicySearchBar />
      </div>
    </div>
  );
};

export default Home;
