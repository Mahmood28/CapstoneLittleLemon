import React, { useState, createContext } from "react";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingComplete: false
  });

  // const setIsLoadingFalse = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     isLoading: false
  //   }));
  // };

  // const setIsLoadingTrue = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     isLoading: true
  //   }));
  // };

  // const setIsOnboardingCompleteTrue = () => {
  //   setState((prevState) => ({
  //    ...prevState,
  //     isOnboardingComplete: true
  //   }));
  // };

  // const setIsOnboardingCompleteFalse = () => {
  //   setState((prevState) => ({
  //   ...prevState,
  //     isOnboardingComplete: false
  //   }));
  // };

  return (
    <GlobalStateContext.Provider value={[state, setState]}>
      {children}
    </GlobalStateContext.Provider>
  );
};
