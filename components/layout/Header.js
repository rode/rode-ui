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
import Link from "next/link";
import styles from "styles/modules/Header.module.scss";
import RodeLogo from "./RodeLogo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

const navigationLinks = [
  {
    href: "/resources",
    label: "Resources",
  },
];

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className={`${styles.container} ${styles[theme]}`}>
      <Link href={"/"}>
        <a href={"/"}>
          <RodeLogo theme={theme} />
        </a>
      </Link>

      <div className={styles.links}>
        {navigationLinks.map((link) => {
          return (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
