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
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { copy as copyText } from "utils/shared-utils";
import styles from "styles/modules/Resource.module.scss";

const ResourceVersion = (props) => {
  const { version, copy, buttonClassName = "" } = props;

  const shortenedVersion =
    version?.length > 12 ? version.substring(0, 12) : version;

  return (
    <>
      <span className={styles.version}>
        {shortenedVersion}
        {copy && (
          <button
            className={`${styles.copyButton} ${buttonClassName}`}
            onClick={() => copyText(version)}
          >
            <Icon name={ICON_NAMES.CLIPBOARD_COPY} />
          </button>
        )}
      </span>
    </>
  );
};
ResourceVersion.propTypes = {
  version: PropTypes.string.isRequired,
  copy: PropTypes.bool,
  buttonClassName: PropTypes.string,
};

export default ResourceVersion;
