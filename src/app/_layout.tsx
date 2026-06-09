import { useFonts } from "expo-font";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { initDatabase } from "../database/db";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {

  const { token, isLoading: authLoading, user } = useAuth();

  const {isLoading: themeLoading } = useTheme();

  const segments = useSegments();

  if (authLoading || themeLoading ){ 
    return null;
  }

  const inAuthGroup =
    segments[0] === "(auth)";


  if (!token && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (token && user && inAuthGroup) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
    } catch (error){
       console.log(error);
    }
    }

    prepare();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

       
        <AuthProvider>
         <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </AuthProvider>
        
      
    </GestureHandlerRootView>
  );
}