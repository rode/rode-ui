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
import styles from "styles/modules/DetailsNavigation.module.scss";
import { useTheme } from "providers/theme";
import Link from "next/link";

// TODO: tests

const DetailsNavigation = (props) => {
  const { links, activeSection } = props;
  const { theme } = useTheme();

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      {links.map(({ label, href }) => {
        let className = styles.link;

        if (href.endsWith(activeSection)) {
          className = styles.activeLink;
        }

        return (
          <Link key={href} href={href} passHref>
            <p className={className}>{label}</p>
          </Link>
        );
      })}
    </div>
  );
};

DetailsNavigation.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeSection: PropTypes.string.isRequired,
};

export default DetailsNavigation;
