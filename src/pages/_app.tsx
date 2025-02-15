import React, { createContext, useContext, useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/styles/globals.css';
import '@/styles/Home.module.css';

import type { AppProps } from 'next/app';

// Define the type of the context
type MyContextType = {
  user: any;
  setUser (user: any): void;
  currentPosition: any;
  setCurrentPosition (position: any): void;
};

// // Create the context with an initial value
export const MyContext = createContext<MyContextType>({
  user: {},
  setUser: () => {},
  currentPosition: {},
  setCurrentPosition: () => {}
});

// // Create a custom hook to access the context value
export const useMyContext = () => useContext(MyContext);

// // Create a provider component that will wrap the part of the app that needs the context
export const MyContextProvider = ({ children }: any) => {
  const [user, setUser] = useState({});
  const [currentPosition, setCurrentPosition] = useState({});

  // Pass the context value to the provider's value prop
  const contextValue: MyContextType = {
    user,
    setUser,
    currentPosition,
    setCurrentPosition
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MyContextProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </MyContextProvider>
  );
}
