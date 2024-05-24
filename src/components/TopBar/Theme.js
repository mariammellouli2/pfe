// src/components/TopBar/Theme.js
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('currentMode') || 'light');

  useEffect(() => {
    localStorage.setItem('currentMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#0E3A5D',
            },
            background: {
              default: '#f4f4f4',
              paper: '#ffffff',
            },
            text: {
              primary: '#000000',
              secondary: '#555555',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
              paper: '#1d1d1d',
            },
            text: {
              primary: '#ffffff',
              secondary: '#90caf9',
            },
          }),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#0E3A5D' : '#333333',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
          },
          columnHeaders: {
            backgroundColor: mode === 'light' ? '#f0f0f0' : '#333333',
            color: mode === 'light' ? '#555' : '#ffffff',
          },
          cell: {
            borderBottom: 'none',
            color: mode === 'light' ? '#000000' : '#ffffff',
          },
        },
      },
    },
  }), [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
