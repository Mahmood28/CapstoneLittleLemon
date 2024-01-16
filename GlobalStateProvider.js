import React, { useState, createContext } from "react";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoading: false,
    isOnboardingComplete: false
  });

  const setIsLoadingFalse = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: false
    }));
  };

  const setIsLoadingTrue = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true
    }));
  };

  const setIsOnboardingCompleteTrue = () => {
    setState((prevState) => ({
     ...prevState,
      isOnboardingComplete: true
    }));
  };

  const setIsOnboardingCompleteFalse = () => {
    setState((prevState) => ({
    ...prevState,
      isOnboardingComplete: false
    }));
  };

  return (
    <GlobalStateContext.Provider value={[state, setIsLoadingTrue, setIsLoadingFalse, setIsOnboardingCompleteTrue, setIsOnboardingCompleteFalse]}>
      {children}
    </GlobalStateContext.Provider>
  );
};
