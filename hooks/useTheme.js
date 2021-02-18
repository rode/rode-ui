import React, { useContext } from "react";
import PropTypes from "prop-types";
import { LIGHT_THEME, DARK_THEME } from "utils/theme-utils";

const LOCAL_STORAGE_THEME_KEY = "rode-ui-theme";

const ThemeContext = React.createContext({
  theme: LIGHT_THEME,
  toggleTheme: () => {},
});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = React.useState(LIGHT_THEME);

  React.useLayoutEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

    setTheme(savedTheme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === LIGHT_THEME) {
      setTheme(DARK_THEME);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, DARK_THEME);
    } else {
      setTheme(LIGHT_THEME);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, LIGHT_THEME);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return { theme, toggleTheme };
};
