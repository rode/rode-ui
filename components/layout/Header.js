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

import React, { useState } from "react";
import Link from "next/link";
import styles from "styles/modules/Header.module.scss";
import RodeLogo from "./RodeLogo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import Button from "../Button";
import Icon from "../Icon";
import { ICON_NAMES } from "../../utils/icon-utils";

const resourceLinks = [
  {
    href: "/resources",
    label: "Resources",
  },
];

const policyLinks = [
  {
    href: "/policies",
    label: "Policy Search",
  },
  {
    href: "/playground",
    label: "Policy Playground",
  },
  {
    href: "/policies/new",
    label: "Create New Policy",
  },
];

const navigationSections = [
  {
    title: "Resources",
    links: resourceLinks,
  },
  {
    title: "Policies",
    links: policyLinks,
  },
];

const Header = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [showNavigation, setShowNavigation] = useState(false);

  const toggleNavigation = () => {
    setShowNavigation(!showNavigation);
  };

  return (
    <header className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.logoContainer}>
        <Link href={"/"}>
          <a href={"/"} className={styles.logo}>
            <RodeLogo theme={theme} />
          </a>
        </Link>
      </div>

      <div className={showNavigation ? styles.expandedNavigation : styles.hiddenNavigation}>
        <Button label={"Toggle Navigation"} buttonType={"icon"} onClick={toggleNavigation} className={showNavigation ? styles.expandedToggle : styles.hiddenToggle}>
          <Icon
            name={ICON_NAMES.MENU}
            size={"large"}
          />
        </Button>
        {navigationSections.map((section) => {
          return (
            <React.Fragment key={section.title}>
              <p>{section.title}</p>
              {section.links.map((link) => {
                return (
                  <Link href={link.href} key={link.label}>
                    <a
                      className={
                        router.pathname.startsWith(link.href)
                          ? styles.active
                          : styles.link
                      }
                    >
                      {link.label}
                    </a>
                  </Link>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
