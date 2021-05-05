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
import { render } from "test/testing-utils/renderer";
import { useFetch } from "hooks/useFetch";
import { isServerSide } from "utils/shared-utils";
import ComponentUsingSafeLayout from "test/testing-utils/hook-components/usePolicyComponent";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("useSafeLayoutEffect", () => {
  let policy, fetchResponse;

  beforeEach(() => {
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
      id: chance.guid(),
    };

    fetchResponse = {
      data: policy,
      loading: false,
    };

    jest.spyOn(React, "useEffect");
    jest.spyOn(React, "useLayoutEffect");

    useFetch.mockReturnValue(fetchResponse);
    isServerSide.mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should use the correct effect hook when on the server", () => {
    isServerSide.mockReturnValue(true);
    render(<ComponentUsingSafeLayout id={policy.id} />);

    expect(React.useEffect).toHaveBeenCalled();
  });

  it("should use the correct effect hook when on the client", () => {
    isServerSide.mockReturnValue(false);
    render(<ComponentUsingSafeLayout id={policy.id} />);

    expect(React.useLayoutEffect).toHaveBeenCalled();
  });
});
