import React, { useEffect, useState, useContext } from 'react';
import {GlobalStateContext, GlobalStateProvider} from "./GlobalStateProvider";
import {MyNavigation} from "./MyNavigation";



export default function App() {
  return (
    <GlobalStateProvider>
      <MyNavigation />
    </GlobalStateProvider>
    );
}
