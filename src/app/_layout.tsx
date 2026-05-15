
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { ThemeProvider } from "../context/ThemeContext";

SplashScreen.preventAutoHideAsync();

// set the animation setOptions. This is optional
SplashScreen.setOptions({
  duration: 500,
  fade: true,
})

export default function RootLayout() {
   const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
   })

    useEffect(()=>{
      async function prepare(){
      if(loaded){
        SplashScreen.hideAsync()
      }
    }
    prepare();
    },[loaded])
    if (!loaded){
      return null
    }

  return (
       <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login" options={{headerShown: false}}/>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>    
       </ThemeProvider>
  );
}

