import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../context/ThemeContext";

SplashScreen.preventAutoHideAsync();

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
    <GestureHandlerRootView style={{flex: 1}}>
       <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login" options={{headerShown: false}}/>
          <Stack.Screen name="(main)/(tabs)" options={{headerShown: false}}/>
        </Stack>    
       </ThemeProvider>
    </GestureHandlerRootView>
  );
}

