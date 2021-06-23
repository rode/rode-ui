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
import { useTheme } from "providers/theme";
import { LIGHT_THEME } from "utils/constants";

const ThemeComponent = () => {
  const { theme, toggleTheme } = useTheme();

  const getText = () => {
    if (theme === LIGHT_THEME) {
      return "light";
    } else {
      return "dark";
    }
  };

  return (
    <>
      <p>{getText()}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
};

ThemeComponent.propTypes = {};

export default ThemeComponent;
