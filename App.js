import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";

const Stack = createNativeStackNavigator();

// App.js is already setup by wrapping NavigationContainer around Root Navigator
export default function App() {

  // return (
  //   <OnboardingScreen/>
  // )
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Onboarding'>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
