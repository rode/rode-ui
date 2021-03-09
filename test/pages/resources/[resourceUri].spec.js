import React from "react";
import { render, screen } from "test/testing-utils/renderer";
import Resource from "pages/resources/[resourceUri]";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("next/router");

describe("Resource Details page", () => {
  let state, router;

  beforeEach(() => {
    router = {
      query: {
        resourceUri: createMockResourceUri(),
      },
    };
    state = {
      searchTerm: chance.string(),
    };

    useRouter.mockReturnValue(router);
    render(<Resource />, { resourceState: state });
  });

  it("should render the resource header information", () => {
    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      router.query.resourceUri
    );

    expect(screen.getByText(resourceName)).toBeInTheDocument();
    expect(screen.getByText(`Type: ${resourceType}`)).toBeInTheDocument();
    expect(screen.getByText(`Version: ${resourceVersion}`)).toBeInTheDocument();
  });
});
