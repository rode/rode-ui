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
import { DARK_THEME, LIGHT_THEME } from "utils/theme-utils";

const themeMap = {
  [DARK_THEME]: {
    id: "darkThemeLiatrioLogo",
    outerFill: "#FFFFFF",
    innerfill: "#FFFFFF",
  },
  [LIGHT_THEME]: {
    id: "lightThemeLiatrioLogo",
    outerFill: "#24AE1D",
    innerfill: "#89DF00",
  },
};

const Liatrio = ({ theme }) => {
  const { id, outerFill, innerfill } = themeMap[theme];
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 82 124"
      data-testid={id}
    >
      <title>Liatrio Logo</title>
      <path
        fill={outerFill}
        d="M32.5,64.3C22.4,54.4,17,23.7,30.8,9.8c5-5.1,11.5-8.5,18.6-9.8c-2.3,2.8-3.6,6.3-3.7,9.9
	c0,6.4,1.4,12.4,18.7,31.6c14,15.6,17.7,24.3,17.6,41c0,2.8-0.3,5.5-1,8.2c-0.3-8.4-3.6-16.4-9.5-22.4C55.3,51.8,40.2,44.5,38,28.2
	c-2.5,16.1,12.6,25,29.3,40.7l0,0c10,9.5,12.1,24.1,6.6,36c-1.6,3.6-3.9,6.8-6.6,9.6c-12.5,12.6-32.9,12.6-45.4,0c0,0,0,0,0,0
	c-0.5-0.5-1.2-1.3-1.6-1.7c-5.1-5.8-8.5-13.3-9.9-22.2C7.7,73,1.7,68,0,66.4c10.8,0,14.7,15.5,15.5,22.1c1,7.4,3.6,14.8,8.9,20.7
	l0.1,0.1l0.1,0.1c7.7,7.7,20.1,7.6,27.7-0.1c3.7-3.7,5.7-8.7,5.7-13.9c0.1-5.2-2-10.2-5.8-13.8C42,72.5,39,70.7,32.5,64.3z"
      />
      <path
        fill={innerfill}
        d="M49.5,84.4c2.9,2.9,4.6,6.8,4.6,11c0.1,8.7-6.9,15.8-15.6,15.9c-4.2,0-8.3-1.6-11.3-4.6
	c-15.7-17.7-4.8-50.8-4.8-50.8C29.2,72.1,34.4,69.2,49.5,84.4z"
      />
    </svg>
  );
};

Liatrio.propTypes = {
  theme: PropTypes.oneOf([DARK_THEME, LIGHT_THEME]),
};

export default Liatrio;
