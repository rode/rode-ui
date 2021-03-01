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
import { useRouter } from "next/router";
import Input from "components/Input";
import styles from "styles/modules/Resources.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";

const ResourceSearchBar = () => {
  const { state, dispatch } = useResources();
  const router = useRouter();

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.searchTerm.trim().length) {
      router.push(`/resources?search=${state.searchTerm.trim()}`);
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
        onChange={(e) =>
          dispatch({
            type: resourceActions.SET_SEARCH_TERM,
            data: e.target.value,
          })
        }
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
        value={state.searchTerm}
      />
      <Button
        label={"Search"}
        buttonType={"icon"}
        disabled={!state.searchTerm}
        type={"submit"}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
    </form>
  );
};

ResourceSearchBar.propTypes = {};

export default ResourceSearchBar;
