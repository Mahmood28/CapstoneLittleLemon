import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import SplashScreen from './screens/Splash';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingComplete: false
  });
  const [userData, setUserData] = useState({});
  
  const loadState = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      console.log("userDataStr: ",userDataStr);
      if (userDataStr != null) {
        console.log("userDataStr: ",userDataStr);
        setState({
          isLoading: false,
          isOnboardingComplete: true
        });
        setUserData(JSON.parse(userDataStr));
      } else {
        console.log("No userData found in AsyncStorage");
        setState({
          isLoading: false,
          isOnboardingComplete: false
        });
      }
    } catch (err) {
      console.log("No userData found in AsyncStorage: ", err);
      setState({
        isLoading: false,
        isOnboardingComplete: false
      });
    }
  }

  const loadStateWrapper = async () => {
    await loadState();
  }
  
  useEffect(() => {
    loadStateWrapper();
    console.log("In App: useEffect");
  }, []);

  if (state.isLoading) {
     // We haven't finished reading from AsyncStorage yet
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {state.isOnboardingComplete ? (
        <Stack.Screen name="Profile" component={ProfileScreen} 
        options={{headerBackVisible: true}}/>
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
