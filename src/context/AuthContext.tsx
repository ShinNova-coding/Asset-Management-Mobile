import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/client";
import { db } from "../database/db";
import { getProfile } from "../database/profile.service";
import { syncProfile } from "../services/syncProfile";
import { getUser } from "../services/user.service";
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
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
export async function clearProfile() {
  await db.runAsync(`
    DELETE FROM users
  `);
}

export const AuthProvider = ({children,}: {children: React.ReactNode;}) => {

  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<UserType | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const employeeId = await SecureStore.getItemAsync("employee_id");
    if (!employeeId) return;

    const onlineUser = await getUser(employeeId);

    console.log("REFRESH USER:", onlineUser);

    setUser(onlineUser.data);
  };

  useEffect(() => {

    const loadSession = async () => {

      try {

        const storedToken = await SecureStore.getItemAsync("token");
         const storedEmployeeId = await SecureStore.getItemAsync("employee_id");
         
         if (! storedToken) return;
         if (!storedEmployeeId) return;

         const localUser = await getProfile();
         const OnlineUser = await getUser(storedEmployeeId);
         setToken(storedToken);
         setUser(OnlineUser.data);
         
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

      const response = await api.post("/login",
        {
            email,
            password,
        }
      );

      const data = await response.data;
      console.log("====>",data);

      await SecureStore.setItemAsync("token",data.token );
      await SecureStore.setItemAsync("employee_id", data.user.employee_id);

      setToken(data.token);

      await syncProfile(data.token); 
      await refreshUser();
      console.log("AUTH USER AFTER REFRESH");
      
      // await syncAssets(data.token);     
      // await syncCategories(data.token); 
      return true;

    } catch (error) {

      console.log("LOGIN ERROR:",error);
      return false;
    }
  };

  const logout = async () => {

    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("employee_id");
    await clearProfile();

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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return context;
};