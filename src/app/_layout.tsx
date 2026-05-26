import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

SplashScreen.preventAutoHideAsync();

// SplashScreen.setOptions({
//   duration: 500,
//   fade: true,
// })
function RootNavigator() {
  const {token, isLoading } = useAuth();

  if( isLoading){
    return null;
  }
  return (
      <Stack screenOptions={{ headerShown: false }}>
           {token ? ( <Stack.Screen name="(main)" /> )
           : (
            <Stack.Screen name="(auth)" />)}
      </Stack> 
  )
}

export default function RootLayout() {

   const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
   })

    useEffect(()=>{
      async function prepare(){
        if(loaded){
          await SplashScreen.hideAsync()
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
        <AuthProvider>
           <RootNavigator />
        </AuthProvider> 
       </ThemeProvider>
    </GestureHandlerRootView>
  );
}

