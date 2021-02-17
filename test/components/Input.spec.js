import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Input from "../../components/Input";

describe("Input", () => {
  let name, label, onChange;

  beforeEach(() => {
    name = chance.string();
    label = chance.string();
    onChange = jest.fn();
  });

  it("should render the input with default values", () => {
    render(<Input name={name} label={label} onChange={onChange} />);

    const renderedComponent = screen.getByLabelText(label);

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveAttribute("type", "text");
    expect(renderedComponent).toHaveAttribute("id", name);
    expect(renderedComponent).toHaveAttribute("placeholder", label);
  });

  it("should call the onChange event", () => {
    render(<Input name={name} label={label} onChange={onChange} />);

    const textToType = chance.string();
    const renderedComponent = screen.getByLabelText(label);
    userEvent.type(renderedComponent, textToType);

    expect(onChange).toHaveBeenCalledTimes(textToType.length);
  });

  it("should allow overriding the default input type", () => {
    const inputType = chance.pickone(["number", "date"]);
    render(
      <Input name={name} label={label} onChange={onChange} type={inputType} />
    );

    expect(screen.getByLabelText(label)).toHaveAttribute("type", inputType);
  });

  it("should render the placeholder if specified", () => {
    const placeholder = chance.string();
    render(
      <Input
        name={name}
        label={label}
        onChange={onChange}
        placeholder={placeholder}
      />
    );

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });
});
