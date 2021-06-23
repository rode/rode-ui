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
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import styles from "styles/modules/Search.module.scss";
import LabelWithValue from "components/LabelWithValue";
import { useTheme } from "providers/theme";

const PolicySearchResult = ({ searchResult }) => {
  const { name, description, id } = searchResult;
  const router = useRouter();
  const { dispatch } = useAppState();
  const { theme } = useTheme();

  const onClick = () => {
    dispatch({
      type: stateActions.SET_CURRENT_POLICY,
      data: searchResult,
    });
    router.push(`/policies/${encodeURIComponent(id)}`);
  };

  return (
    <div className={`${styles[theme]} ${styles.searchCard}`}>
      <div>
        <LabelWithValue
          label={"Policy Name"}
          value={name}
          className={styles.cardHeader}
        />
        <p className={styles.cardText}>{description}</p>
      </div>
      <Button onClick={onClick} label={"View Policy"} />
    </div>
  );
};

PolicySearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default PolicySearchResult;
