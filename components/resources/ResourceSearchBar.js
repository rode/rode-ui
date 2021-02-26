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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Input from "components/Input";
import styles from "styles/modules/Resources.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";

const ResourceSearchBar = ({ currentSearch }) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const router = useRouter();

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const onSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.trim().length) {
      router.push(`/resources?search=${searchTerm.trim()}`);
    }
  };

  return (
    <form
      role="search"
      className={styles.searchBarContainer}
      onSubmit={onSubmit}
    >
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
        value={searchTerm}
      />
      <Button
        label={"Search"}
        buttonType={"icon"}
        disabled={!searchTerm}
        type={"submit"}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
    </form>
  );
};

ResourceSearchBar.propTypes = {
  currentSearch: PropTypes.string,
};

export default ResourceSearchBar;
