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

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "styles/modules/Header.module.scss";
import RodeLogo from "./RodeLogo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "providers/theme";
import Auth from "components/Auth";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useRouter } from "next/router";

const resourceLinks = [
  {
    href: "/resources",
    label: "Resource Search",
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

const adminLinks = [
  {
    href: "/policy-groups",
    label: "Policy Groups",
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
  {
    title: "Admin",
    links: adminLinks,
  },
];

const Header = ({ auth = {} }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const ref = useRef(null);
  const [showNavigation, setShowNavigation] = useState(false);

  const toggleNavigation = () => {
    setShowNavigation(!showNavigation);
  };

  const closeNavigationWhenClickingOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowNavigation(false);
    }
  };

  useEffect(() => {
    setShowNavigation(false);
  }, [router]);

  useEffect(() => {
    if (showNavigation) {
      document.addEventListener(
        "mousedown",
        closeNavigationWhenClickingOutside
      );
    } else {
      document.removeEventListener(
        "mousedown",
        closeNavigationWhenClickingOutside
      );
    }
  }, [showNavigation]);

  return (
    <header className={`${styles.container} ${styles[theme]}`} ref={ref}>
      <div
        className={
          showNavigation ? styles.fixedLogoContainer : styles.logoContainer
        }
      >
        <Link href={"/"}>
          <a href={"/"} className={styles.logo}>
            <RodeLogo theme={theme} />
          </a>
        </Link>
      </div>

      <div
        className={
          showNavigation ? styles.expandedNavigation : styles.hiddenNavigation
        }
      >
        <Button
          label={"Toggle Navigation"}
          buttonType={"icon"}
          onClick={toggleNavigation}
          className={
            showNavigation ? styles.expandedToggle : styles.hiddenToggle
          }
        >
          <Icon name={ICON_NAMES.MENU} size={"large"} />
        </Button>
        <div
          className={showNavigation ? "" : styles.hidden}
          data-testid={"navigationContainer"}
        >
          <Auth {...auth} />
          {navigationSections.map((section) => {
            return (
              <div key={section.title} className={styles.section}>
                <p className={styles.sectionTitle}>{section.title}</p>
                {section.links.map((link) => {
                  return (
                    <Link href={link.href} key={link.label}>
                      <a className={styles.link}>{link.label}</a>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div
          className={
            showNavigation ? styles.themeToggleContainer : styles.hidden
          }
        >
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  auth: PropTypes.object,
};

export default Header;
