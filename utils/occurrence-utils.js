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

export const getVulnerabilityBreakdown = (vulnerabilities) => {
  let low = 0;
  let medium = 0;
  let high = 0;
  let unknown = 0;

  vulnerabilities.forEach((vuln) => {
    if (vuln.effectiveSeverity === "LOW") {
      low++;
    } else if (vuln.effectiveSeverity === "MEDIUM") {
      medium++;
    } else if (vuln.effectiveSeverity === "HIGH") {
      high++;
    } else {
      unknown++;
    }
  });

  const values = [
    high && `${high} high`,
    medium && `${medium} medium`,
    low && `${low} low`,
    unknown && `${unknown} unknown`,
  ];
  return values.filter((val) => val).join(", ");
};
