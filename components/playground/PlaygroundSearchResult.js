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
import styles from "styles/modules/Playground.module.scss";

const getDataForResultType = (searchResult, type) => {
  if (type === "policy") {
    return {
      main: `${searchResult.name}`,
      sub: `${searchResult.description}`,
      buttonText: "Select Policy",
    };
  } else {
    return {
      main: `${searchResult.name}`,
      sub: `Version: ${searchResult.version}`,
      buttonText: "Select Resource",
    };
  }
};

const PlaygroundSearchResult = ({ searchResult, type, onClick }) => {
  const {main, sub, buttonText} = getDataForResultType(searchResult, type);

  return (
    <div className={`${styles.searchCard}`}>
      <div>
        <p className={styles.cardHeader}>{main}</p>
        <p className={styles.cardText}>{sub}</p>
      </div>
      <Button onClick={onClick} buttonType={"text"} label={buttonText} />
    </div>
  );
};

PlaygroundSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["policy", "resource"]),
  onClick: PropTypes.func.isRequired,
};

export default PlaygroundSearchResult;
