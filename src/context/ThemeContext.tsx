import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';


export const Colors = {
  light: {
    background: "#F8F7FF",
    card: "#FFFFFF",
    text: "#1F2937",
    subText: "#6B7280",
    primary: "#0070EB",
    border: "#F3F4F6",
  },
  dark: {
    background: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    subText: "#94A3B8",
    primary: "#0070EB",
    border: "#334155",
  }
};

const ThemeContext = createContext({
  isDark: false,
  colors: Colors.light,
  setScheme: (scheme: 'light' | 'dark') => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const theme = {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
    setScheme: (scheme: 'light' | 'dark') => setIsDark(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);