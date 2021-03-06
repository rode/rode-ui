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

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { LIGHT_THEME, DARK_THEME } from "utils/constants";
import { isServerSide } from "utils/shared-utils";
import { useSafeLayoutEffect } from "hooks/useSafeLayoutEffect";
const LOCAL_STORAGE_THEME_KEY = "rode-ui-theme";

const ThemeContext = React.createContext({
  theme: LIGHT_THEME,
  toggleTheme: () => {},
});

const getInitialTheme = () => {
  if (isServerSide()) {
    return LIGHT_THEME;
  }

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
    .matches;
  if (prefersDarkScheme) {
    return DARK_THEME;
  }

  return LIGHT_THEME;
};

export const ThemeProvider = (props) => {
  const [theme, setTheme] = React.useState(LIGHT_THEME);

  useSafeLayoutEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(getInitialTheme());
    }
  }, []);

  const toggleTheme = () => {
    if (theme === LIGHT_THEME) {
      setTheme(DARK_THEME);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, DARK_THEME);
    } else {
      setTheme(LIGHT_THEME);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, LIGHT_THEME);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return { theme, toggleTheme };
};
