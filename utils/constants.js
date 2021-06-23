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

export const LIGHT_THEME = "lightTheme";
export const DARK_THEME = "darkTheme";
export const SEARCH_ALL = "all";
export const DATE_TIME_FORMAT = "h:mm:ssa | MMM D, YYYY";
export const DEFAULT_SEARCH_PAGE_SIZE = 10;
export const PLAYGROUND_SEARCH_PAGE_SIZE = 5;
export const DEFAULT_DEBOUNCE_DELAY = 500;
export const EXAMPLE_POLICY = `# This is an example policy. Use this as a template to incorporate your own policy logic. Any required fields are noted below.

# package is required
package fail_high_vulnerabilities

# pass is required
pass = true {
    count(violation_count) == 0
}

violation_count[v] {
    violations[v].pass == false
}

# violations set is required
violations[result] {
    maxViolations := 0
    
    # result is required and must contain the properties "id", "pass", "name", and "message"
    result := {
        "id": "fail_high_vulnerabilities",
        "name": "High Severity Vulnerability Count",
        "pass": count(high_vulnerabilities) <= maxViolations,
        "message": sprintf("Scan found %v high severity vulnerabilities (max: %v)", [count(high_vulnerabilities),maxViolations])
    }
}

high_vulnerabilities[o] {
    input.occurrences[i].vulnerability.effectiveSeverity == "HIGH"
    o := input.occurrences[i]
}`;
