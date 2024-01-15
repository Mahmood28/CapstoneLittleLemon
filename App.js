import React, { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import SplashScreen from './screens/Splash';
import {GlobalStateContext, GlobalStateProvider} from "./GlobalStateProvider";
import {Text, View} from 'react-native';
import {MyNavigation} from "./MyNavigation";



export default function App() {
  //const [state, setState] = React.useContext(GlobalStateContext);
  //const state ={};

  // const loadState = async () => {
  //   try {
  //     const userDataStr = await AsyncStorage.getItem('userData');
  //     console.log("userDataStr: ",userDataStr);
  //     if (userDataStr != null) {
  //       console.log("userDataStr: ",userDataStr);
  //       setIsLoadingFalse();
  //       setIsOnboardingCompleteTrue();
  //     } else {
  //       console.log("No userData found in AsyncStorage");
  //       setIsLoadingFalse();
  //       setIsOnboardingCompleteFalse();
  //     }
  //   } catch (err) {
  //     console.log("No userData found in AsyncStorage: ", err);
  //     setIsLoadingFalse();
  //     setIsOnboardingCompleteFalse();
  // }
  // }

  // const loadStateWrapper = async () => {
  //   setIsLoadingTrue();
  //   await loadState();
  // }
  
  // useEffect(() => {
  //   loadStateWrapper();
  //   console.log("In App: useEffect");
  // }, []);

  // if (state.isLoading) {
  //    // We haven't finished reading from AsyncStorage yet
  //   return <SplashScreen />;
  // }

  return (
  <View>
  <GlobalStateProvider>
    <Text>Hello</Text>
    <MyNavigation />
  </GlobalStateProvider>
  </View>
  );
}
