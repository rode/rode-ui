import React from "react";
import styles from "styles/modules/Footer.module.scss";
import { useTheme } from "providers/theme";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const footerLinks = [
  {
    href: "https://github.com/rode",
    label: "Github",
    icon: ICON_NAMES.GITHUB,
  },
  {
    href: "https://www.liatrio.com/",
    label: "Liatrio",
    icon: ICON_NAMES.LIATRIO,
    iconSize: "xlarge",
  },
  {
    href: "https://twitter.com/liatrio",
    label: "Twitter",
    icon: ICON_NAMES.TWITTER,
  },
];

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.contentContainer}>
        <div>
          <p className={styles.title}>rode</p>
          <p className={styles.subtitle}>
            Services and tools for enabling Enterprise Automated Governance,
            Policy as Code
          </p>
        </div>
        <div className={styles.links}>
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              target="_blank"
              rel={"noreferrer"}
            >
              <Icon name={link.icon} size={link.iconSize} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
