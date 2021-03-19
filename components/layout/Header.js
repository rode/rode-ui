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
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";

const navigationLinks = [
  {
    href: "/resources",
    label: "Resources",
  },
  {
    href: "/policies",
    label: "Policies",
  },
];

const Header = () => {
  const { theme } = useTheme();
  const router = useRouter();

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
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
