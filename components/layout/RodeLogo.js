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

const RodeLogo = ({ theme, title = "" }) => {
  if (theme === DARK_THEME) {
    return (
      <svg data-testid={ "darkThemeLogo" }
           height="100%"
           width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
        <title>{ `Rode Logo ${ title }` }</title>
        <defs>
          <mask id="mask" x="20.06" y="208.68" width="738.78" height="961.32" maskUnits="userSpaceOnUse">
            <path className="cls-1"
                  fill="#fff"
                  d="M568.83,213.59,56.49,434.07a60.36,60.36,0,0,0-35.95,63.11c33,259.57,128.45,474.82,278,651.63A60.07,60.07,0,0,0,344.48,1170h248.2V208.68A60.41,60.41,0,0,0,568.83,213.59Zm-170,512.12a15.19,15.19,0,0,1-14.53,19.6H222.77a15.19,15.19,0,0,1-14.54-19.6l32.19-106.1A97.73,97.73,0,0,1,305,447.31c52.44.73,95.32,43.4,96.3,95.85a97.52,97.52,0,0,1-34.56,76.45Z" />
            <line className="cls-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#000"
                  strokeWidth="180px"
                  x1="668.84" y1="769.19" x2="530.63" y2="630.96" />
          </mask>
          <symbol id="Rode_Logomark_Reverse" data-name="Rode_Logomark_Reverse" viewBox="0 0 1200 1200">
            <path className="cls-3"
                  fill="#24ae1d"
                  stroke="#24ae1d"
                  strokeMiterlimit="10"
                  strokeWidth="60px"
                  d="M956.32,248.37l.87-47.82H869.48l.36-81.92-183-1,.1-87.63H498.46v87.63H315.53v82.92H228.19v47.82L573.69,99.69a60,60,0,0,1,48,.26Z" />
            <g className="cls-4" mask="url(#mask)">
              <path className="cls-5"
                    fill="#24ae1d"
                    d="M568.83,213.59,56.49,434.07a60.36,60.36,0,0,0-35.95,63.11c33,259.57,128.45,474.82,278,651.63A60.07,60.07,0,0,0,344.48,1170h248.2V208.68A60.41,60.41,0,0,0,568.83,213.59Zm-202.14,406,38.14,125.7H202.29l38.13-125.7A97.73,97.73,0,0,1,305,447.31c52.44.73,95.32,43.4,96.3,95.85A97.52,97.52,0,0,1,366.69,619.61Z" />
            </g>
            <path className="cls-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#24ae1d"
                  strokeWidth="40px"
                  d="M1107.26,754.55q46.53-140.59,62.62-302.82L592.66,203.34,56.3,434.15a59.93,59.93,0,0,0-35.83,62.49C54.73,766.91,156.68,989.15,316.94,1170H572.59" />
            <path className="cls-7"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60px" stroke="#f8f8f8"
                  d="M677.14,709.1l-12.53,12.53a30.15,30.15,0,0,1-42.62,0L609.46,709.1l-73.61-73.6" />
            <path className="cls-7"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60px" stroke="#f8f8f8"
                  d="M986.42,1018.31l-12.53,12.53a30.15,30.15,0,0,1-42.63,0l-12.53-12.53-145.07-145-12.53-12.53a30.12,30.12,0,0,1,0-42.61l12.53-12.53" />
            <path className="cls-7"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60px" stroke="#f8f8f8"
                  d="M650.89,619.13l12.53-12.53a30.14,30.14,0,0,1,42.62,0l12.53,12.53,145.08,145,12.53,12.52a30.14,30.14,0,0,1,0,42.62l-12.53,12.52" />
            <path className="cls-7"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="60px" stroke="#f8f8f8"
                  d="M960.17,928.34l12.53-12.52a30.14,30.14,0,0,1,42.62,0l12.53,12.52,120.79,120.78,12.53,12.52a30.14,30.14,0,0,1,0,42.62l-56.93,56.91a30.14,30.14,0,0,1-42.62,0l-46.37-46.36" />
          </symbol>
        </defs>
        <g id="Layer_6" data-name="Layer 6">
          <use width="1200" height="1200" xlinkHref="#Rode_Logomark_Reverse" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      data-testid={"lightThemeLogo"}
      height="100%"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1200"
    >
      <title>{`Rode Logo ${title}`}</title>
      <defs>
        <mask
          id="mask"
          x="88.64"
          y="272.9"
          width="677.17"
          height="837.1"
          maskUnits="userSpaceOnUse"
        >
          <path
            fill={"#fff"}
            d="M595.84,272.9V1110h-233a30,30,0,0,1-23.15-10.9A1111.78,1111.78,0,0,1,176.3,831.68C134.54,734.74,105.19,628.45,89,515.43a30,30,0,0,1,17.83-31.87Z"
          />
          <line
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#000"}
            strokeWidth={"180px"}
            x1="675.81"
            y1="770.95"
            x2="538.24"
            y2="633.32"
          />
        </mask>
        <symbol
          id="Rode_Logomark"
          data-name="Rode_Logomark"
          viewBox="0 0 1200 1200"
        >
          <path
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#262626"}
            strokeWidth={"60px"}
            d="M1090,818c38.24-97.72,65-203.59,79.52-318.13a59.94,59.94,0,0,0-35.82-62.57l-510-219.51a60,60,0,0,0-47.44,0L66.27,437.3a60.08,60.08,0,0,0-35.78,62.84c32.84,258.42,127.85,472.73,276.77,648.77A59.82,59.82,0,0,0,352.94,1170h242"
          />
          <g
          mask={"url(#mask)"}
          >
            <path
              fill={"#24ae1d"}
              d="M595.84,272.9V1110h-233a30,30,0,0,1-23.15-10.9A1111.78,1111.78,0,0,1,176.3,831.68C134.54,734.74,105.19,628.45,89,515.43a30,30,0,0,1,17.83-31.87Z"
            />
          </g>
          <path
            fill={"#262626"}
            d="M407.09,727.65,375.05,622a97.16,97.16,0,0,0,34.4-76.11c-1-52.22-43.66-94.71-95.86-95.43A97.3,97.3,0,0,0,249.36,622l-32,105.63a15.13,15.13,0,0,0,14.47,19.53H392.62A15.13,15.13,0,0,0,407.09,727.65Z"
          />
          <path
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#262626"}
            strokeWidth={"60px"}
            d="M679.4,711.12l-12.47,12.47a30,30,0,0,1-42.43,0L612,711.12l-73.28-73.28"
          />
          <path
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#262626"}
            strokeWidth={"60px"}
            d="M987.26,1019l-12.48,12.47a30,30,0,0,1-42.42,0L919.88,1019,775.47,874.57,763,862.1a30,30,0,0,1,0-42.43l12.47-12.47"
          />
          <path
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#262626"}
            strokeWidth={"60px"}
            d="M653.27,621.54l12.47-12.47a30,30,0,0,1,42.43,0l12.47,12.47L865.05,766l12.47,12.47a30,30,0,0,1,0,42.42l-12.47,12.48"
          />
          <path
            fill={"none"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            stroke={"#262626"}
            strokeWidth={"60px"}
            d="M961.13,929.4l12.47-12.47a30,30,0,0,1,42.42,0l12.48,12.47,120.24,120.25,12.47,12.47a30,30,0,0,1,0,42.43l-56.66,56.66a30,30,0,0,1-42.43,0L1016,1115.06"
          />
          <path
            stroke={"#262626"}
            strokeWidth={"60px"}
            fill={"#262626"}
            strokeMiterlimit={10}
            d="M957.83,257.36l.86-47.61h-87.3l.35-92.51H689.55l.1-87.24H502.06v87.24H320v92.51H233v47.61l343.8-148a60.05,60.05,0,0,1,48.06.27Z"
          />
        </symbol>
      </defs>
      <g id="Layer_3" data-name="Layer 3">
        <use width="1200" height="1200" xlinkHref="#Rode_Logomark" />
      </g>
    </svg>
  );
};

RodeLogo.propTypes = {
  theme: PropTypes.oneOf([LIGHT_THEME, DARK_THEME]).isRequired,
  title: PropTypes.string,
};

export default RodeLogo;
