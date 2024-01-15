import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import SplashScreen from './screens/Splash';
import {GlobalStateContext, GlobalStateProvider} from "./GlobalStateProvider";
import {View, Text} from 'react-native';

const Stack = createNativeStackNavigator();

export const MyNavigation = () => {
  const [state, setIsLoadingTrue, setIsLoadingFalse, setIsOnboardingCompleteTrue, setIsOnboardingCompleteFalse] = React.useContext(GlobalStateContext);

  const loadState = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      console.log("userDataStr: ",userDataStr);
      if (userDataStr != null) {
        console.log("userDataStr: ",userDataStr);
        setIsLoadingFalse();
        setIsOnboardingCompleteTrue();
      } else {
        console.log("No userData found in AsyncStorage");
        setIsLoadingFalse();
        setIsOnboardingCompleteFalse();
      }
    } catch (err) {
      console.log("No userData found in AsyncStorage: ", err);
      setIsLoadingFalse();
      setIsOnboardingCompleteFalse();
  }
  }

  const loadStateWrapper = async () => {
    setIsLoadingTrue();
    await loadState();
  }
  
  useEffect(() => {
    loadStateWrapper();
    console.log("In MyNavigation: useEffect");
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

