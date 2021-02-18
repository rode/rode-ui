import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "components/Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  let onClick, label;

  beforeEach(() => {
    onClick = jest.fn();
    label = chance.string();
  });

  it("should render the button with defaults", () => {
    render(<Button onClick={onClick} label={label} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveTextContent(label);
    expect(renderedButton).toHaveClass("primary");
  });

  it("should call the passed onClick function", () => {
    render(<Button onClick={onClick} label={label} />);

    const renderedButton = screen.getByLabelText(label);

    userEvent.click(renderedButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render the children if the button needs to render more than just the label", () => {
    const children = chance.string();

    render(
      <Button onClick={onClick} label={label}>
        {children}
      </Button>
    );

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveTextContent(children);
  });

  it("should allow a button type of 'icon'", () => {
    render(<Button onClick={onClick} label={label} buttonType={"icon"} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveClass("icon");
  });
});
