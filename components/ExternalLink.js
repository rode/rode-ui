import React from "react";
import PropTypes from "prop-types";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "./Icon";
import styles from "styles/modules/Typography.module.scss";
import { useTheme } from "providers/theme";

const ExternalLink = (props) => {
  const { theme } = useTheme();
  const { href, label } = props;

  if (!href) {
    return null;
  }

  return (
    <a
      className={`${styles[theme]} ${styles.externalLink}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {label}
      <Icon name={ICON_NAMES.EXTERNAL_LINK} size={"small"} />
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ExternalLink;
