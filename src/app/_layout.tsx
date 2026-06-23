import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { initDatabase } from "../database/db";
import { insertNotification } from "../database/notification.service";

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

  
  useEffect(() => {

  const receivedSubscription =
    Notifications.addNotificationReceivedListener(
     async (notification) => {
          const title = notification.request.content.title || "";

          const message = notification.request.content.body || "";

          const lowerTitle = title.toLowerCase();

           let type: "assigned" | "repair" = "assigned";

          if ( lowerTitle.includes("maintenance")||lowerTitle.includes("repair") )
             { 
            type = "repair";
             }

          insertNotification({
            title,
            message,
            type,
            is_read: 0,
            created_at: new Date().toISOString()
          });
          console.log("Notification saved");
      }
    );

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log("User tapped notification:", response);
      }
    );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };

}, []);

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