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
              title={link.label}
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
