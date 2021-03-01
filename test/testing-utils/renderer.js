import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { ResourcesProvider } from "../../providers/resources";
import { ThemeProvider } from "../../providers/theme";
import { LIGHT_THEME } from "../../utils/theme-utils";

const render = (
  Component,
  { resourceState = {}, theme = LIGHT_THEME, ...options } = {}
) => {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <ThemeProvider value={{ theme, toggleTheme: jest.fn() }}>
      <ResourcesProvider value={{ state: resourceState, dispatch: jest.fn() }}>
        {children}
      </ResourcesProvider>
    </ThemeProvider>
  );
  return rtlRender(Component, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { render };
