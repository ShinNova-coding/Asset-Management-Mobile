import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    background: "#F8F7FF",
    card: "#FFFFFF",
    text: "#1F2937",
    subText: "#6B7280",
    primary: "#0070EB",
    border: "#F3F4F6",
    head: "rgb(210, 228, 255)-"
  },
  dark: {
    background: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    subText: "#94A3B8",
    primary: "#0070EB",
    border: "#334155",
    head: "#2D3748"
  }
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof Colors.light;
  setScheme: (scheme: "light" | "dark") => Promise<void>;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: Colors.light,
  setScheme: async() => {},
  isLoading: true,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
    loadTheme();
  }, []);

    const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync("theme");

      if (savedTheme) {
        setIsDark(savedTheme === "dark");
      } else {
        setIsDark(systemScheme === "dark");
      }
    } catch (error) {
      console.log("Theme Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setScheme = async (scheme: "light" | "dark") => {
    try {
      await SecureStore.setItemAsync("theme", scheme);
      setIsDark(scheme === "dark");
    } catch (error) {
      console.log("Theme Save Error:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? Colors.dark : Colors.light, setScheme, isLoading,}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);