import { Stack } from 'expo-router';
export default function AppLayout(){
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="assetsDetail" options={{headerShown: false}}/>
            <Stack.Screen name="reportIssue" options={{headerShown: false}}/>
            <Stack.Screen name="contact-info" options={{headerShown: false}}/>
            <Stack.Screen name="security" options= {{headerShown: false}} />
            <Stack.Screen name="about" options= {{headerShown: false}} />
            <Stack.Screen name="history" options= {{headerShown: false}} />
        </Stack>
    )
}
