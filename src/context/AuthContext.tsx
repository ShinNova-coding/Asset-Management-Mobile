import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  token: string | null;
  user: any;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [token, setToken] =
    useState<string | null>(null);

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {

    const loadSession = async () => {

      try {

        const storedToken =
          await SecureStore.getItemAsync("token");

        const storedUser =
          await SecureStore.getItemAsync("user");

        if (storedToken) {
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

  }, []);

  const login = async (
    email: string,
    password: string
  ) => {

    try {

      const response = await fetch(
        "http://192.168.100.180:1010/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return false;
      }
      // SAVE TOKEN and USER
      await SecureStore.setItemAsync(
        "token",
        data.token
      );

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      return true;

    } catch (error) {

      console.log(error);
      return false;
    }
  };

  const logout = async () => {

    await SecureStore.deleteItemAsync("token");

    await SecureStore.deleteItemAsync("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return context;
};