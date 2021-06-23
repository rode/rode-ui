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

/* eslint-disable react/display-name,react/prop-types */
import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { AppStateProvider } from "providers/appState";
import { ThemeProvider } from "providers/theme";
import { LIGHT_THEME } from "utils/constants";
import { ToastContainer } from "react-toastify";

const Wrapper = ({ theme, state, dispatch, children }) => (
  <ThemeProvider value={{ theme, toggleTheme: jest.fn() }}>
    <AppStateProvider value={{ state, dispatch }}>
      <ToastContainer />
      {children}
    </AppStateProvider>
  </ThemeProvider>
);

const render = (
  Component,
  { state = {}, theme = LIGHT_THEME, dispatch = jest.fn(), ...options } = {}
) => {
  const rendered = rtlRender(Component, {
    wrapper: ({ children }) => (
      <Wrapper theme={theme} state={state} dispatch={dispatch}>
        {children}
      </Wrapper>
    ),
    ...options,
  });

  return {
    ...rendered,
    rerender: (component, options = {}) =>
      render(component, {
        container: rendered.container,
        wrapper: ({ children }) => (
          <Wrapper theme={theme} state={state} dispatch={dispatch}>
            {children}
          </Wrapper>
        ),
        ...options,
      }),
  };
};

export * from "@testing-library/react";
export { render };
/* eslint-enable react/display-name,react/prop-types */
