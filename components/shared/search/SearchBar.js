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
import styles from "styles/modules/Search.module.scss";
import Input from "components/Input";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { SEARCH_ALL } from "utils/constants";

const SearchBar = (props) => {
  const {
    onSubmit,
    onChange,
    searchTerm,
    label,
    name,
    placeholder,
    helpText,
    buttonLabel,
  } = props;

  const displayValue = searchTerm === SEARCH_ALL ? "" : searchTerm;
  return (
    <form role="search" className={styles.form} onSubmit={onSubmit}>
      <div className={styles.inputContainer}>
        <Input
          name={`${name}Display`}
          label={label}
          onChange={onChange}
          placeholder={placeholder}
          value={displayValue}
        />
        <input type="hidden" name={name} value={searchTerm} />
        <Button
          label={buttonLabel || "Search"}
          buttonType={"icon"}
          type={"submit"}
        >
          <Icon name={ICON_NAMES.SEARCH} size={"large"} />
        </Button>
      </div>
      {helpText && <p className={styles.searchHelp}>{helpText}</p>}
    </form>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  placeholder: PropTypes.string,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  buttonLabel: PropTypes.string,
};

export default SearchBar;
