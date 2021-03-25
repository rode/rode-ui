import React from "react";
import { render, screen, waitFor } from "test/testing-utils/renderer";
import { useFetch } from "hooks/useFetch";
import { isServerSide } from "utils/shared-utils";
import PolicyComponent from "test/testing-utils/hook-components/usePolicyComponent";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("usePolicy", () => {
  let policy, dispatchMock, policyState, fetchResponse;

  beforeEach(() => {
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
      id: chance.guid(),
    };
    dispatchMock = jest.fn();
    policyState = {
      currentPolicy: policy,
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

  it("should return the loading status", () => {
    fetchResponse.loading = true;
    render(<PolicyComponent id={policy.id} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should return the policy if it is already saved in state", () => {
    render(<PolicyComponent id={policy.id} />, { policyState: policyState });

    expect(useFetch).not.toHaveBeenCalledWith(`/api/policies/${policy.id}`);
    waitFor(() => {
      expect(screen.getByText(policy.name)).toBeInTheDocument();
    });
  });

  it("should fetch the policy if it is not saved in state", () => {
    render(<PolicyComponent id={policy.id} />, {
      policyState: {},
      policyDispatch: dispatchMock,
    });

    expect(useFetch).toHaveBeenCalledWith(`/api/policies/${policy.id}`);
    waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "SET_CURRENT_POLICY",
        data: policy,
      });
    });
  });

  it("should use the correct effect hook when on the server", () => {
    isServerSide.mockReturnValue(true);
    render(<PolicyComponent id={policy.id} />);

    expect(React.useEffect).toHaveBeenCalled();
  });

  it("should use the correct effect hook when on the client", () => {
    isServerSide.mockReturnValue(false);
    render(<PolicyComponent id={policy.id} />);

    expect(React.useLayoutEffect).toHaveBeenCalled();
  });
});
