import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";
import { syncAssets } from "../services/syncAssets";
import { syncCategories } from "../services/syncCategories";
import { syncProfile } from "../services/syncProfile";
type UserType = {
  employee_id: string;
  name: string;
  email: string;
  position: string | null;
  status: string;
  phone_number: string | null;
  joined_date: string;
  image_url: string | null;
  preview_url: string | null;

  roles: {
    id: number;
    name: string;
  }[];
};

type AuthContextType = {
  token: string | null;
  user: UserType | null;
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

  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<UserType | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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
        "http://192.168.100.197:1010/api/login",
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
      console.log("====>",data)
      if (!response.ok) {
        return false;
      }

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

      await syncAssets(data.token);      //Sync assets to SQlite
      await syncCategories(data.token); 
      await syncProfile(data.token);   
      return true;

    } catch (error) {

      console.log("LOGIN ERROR:",error);
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