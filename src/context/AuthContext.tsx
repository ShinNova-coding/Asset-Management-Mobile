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
import { logoutUser } from "../services/auth.service";
import { syncProfile } from "../services/syncProfile";
import { getUser } from "../services/user.service";
type UserType = {
  id: string;
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
    const userId = await SecureStore.getItemAsync("user_id");
    if (!userId) return;

    const onlineUser = await getUser(userId);
     console.log("USER ID:", userId);
    // console.log("REFRESH USER:", onlineUser);

    if (onlineUser && onlineUser.id && !onlineUser.message){
    setUser(onlineUser);
    }
  };

 useEffect(() => {
  const loadSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      const storedUserId = await SecureStore.getItemAsync("user_id");
       
      if (!storedToken || !storedUserId) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      const localProfile = await getProfile();

        if (localProfile && localProfile.id) {
          // const structuredUser: UserType = {
          //   ...localProfile,
          //   roles: localProfile.roles || [
          //     { id: 0, name: localProfile.position || "Employee" }
          //   ]
          // };
          setUser(localProfile);
        }

      setIsLoading(false);
   
      if (storedUserId.includes("-")){
        const onlineUser = await getUser(storedUserId);
        if (onlineUser && onlineUser.id && !onlineUser.message) {
          setUser(onlineUser);
        }
      }
    } catch (error) {
      console.log(" Session Init Failure:", error);
      setIsLoading(false);
    }
  };

  loadSession();
}, []);

  const login = async ( email: string, password: string ) => {

    try {

      const response = await api.post("/login",{ email, password, });

      const data = await response.data;
      if (!data.success || !data.user?.id) {
        console.log("Login execution refused by API backend rules");
        return false;
      }
      console.log("====> Server verification matched", data);

      await SecureStore.setItemAsync("token",data.token );
      await SecureStore.setItemAsync("user_id", data.user.id)
      await SecureStore.setItemAsync("employee_id", data.user.employee_id);

      setToken(data.token);

      await syncProfile(data.token); 
      await refreshUser();
      // console.log("AUTH USER AFTER REFRESH");

      return true;
    } catch (error) {

      console.log("LOGIN ERROR:",error);
      return false;
    }
  };

  const logout = async () => {

      try {

        await logoutUser();

      } catch (error) {
        console.log( "LOGOUT API FAILED:", error );
      }

    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user_id")
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