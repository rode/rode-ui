import React from "react";
import PropTypes from "prop-types";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { copy as copyText } from "utils/shared-utils";
import styles from "styles/modules/Resource.module.scss";

const ResourceVersion = (props) => {
  const { version, copy, buttonClassName = "" } = props;

  const shortenedVersion =
    version.length > 12 ? version.substring(0, 12) : version;

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
