import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const LIGHT = 'light';
const DARK = 'dark';
const LOCAL_STORAGE_THEME_KEY = 'rode-ui-theme';

const ThemeContext = React.createContext({ 
  theme: LIGHT,
  toggleTheme: () => {}
});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = React.useState(LIGHT);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

    setTheme(savedTheme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === LIGHT) {
      setTheme(DARK);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, DARK);
    } else {
      setTheme(LIGHT);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, LIGHT);
    }
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>{props.children}</ThemeContext.Provider>
  )
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return { theme, toggleTheme};
}
