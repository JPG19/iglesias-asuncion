import React, { createContext, useContext, useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "@/styles/globals.css";
import "@/styles/Home.module.css";

import type { AppProps } from "next/app";

// Define the type of the context
type MyContextType = {
  user: any;
  setUser(user: any): void;
  currentPosition: {
    lat?: number
    lng?: number
    error?: string;
  };
  setCurrentPosition(position: any): void;
  churchesWithLocation: any;
  setChurchesWithLocation: (churches: any) => void;
  getCurrentPosition: () => void;
};

// // Create the context with an initial value
export const MyContext = createContext<MyContextType>({
  user: {},
  setUser: () => {},
  currentPosition: {},
  setCurrentPosition: () => {},
  churchesWithLocation: [],
  setChurchesWithLocation: () => {},
  getCurrentPosition: () => {}
});

// // Create a custom hook to access the context value
export const useMyContext = () => useContext(MyContext);

// Function to calculate distance using Haversine formula
function calculateDistances(churches: any, myLocation: any): any {
  const newChurchesArray: any = [];

  const myLat = myLocation.lat;
  const myLng = myLocation.lng;

  // Function to calculate distance between two points using Haversine formula
  function getDistanceInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
  }

  // Calculate and print distance for each church
  churches?.forEach((church: any) => {
    const [churchLat, churchLng] = church.Location.split(",").map(
      (coord: any) => parseFloat(coord.trim())
    );

    const distance = getDistanceInKm(myLat, myLng, churchLat, churchLng);
    const updatedChurch = {...church}
    updatedChurch.distance = Math.round(distance);
    newChurchesArray.push(updatedChurch);
  });

  return newChurchesArray;
}

// // Create a provider component that will wrap the part of the app that needs the context
export const MyContextProvider = ({ children, churches }: any) => {
  const [user, setUser] = useState({});
  const [currentPosition, setCurrentPosition] = useState<any>({});
  const [churchesWithLocation, setChurchesWithLocation] = useState(null);
  const getCurrentPosition = () => {
    global.navigator.geolocation?.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.message === "User denied Geolocation") {
          setCurrentPosition({ error: err.message });
        }
      },
      options
    );
  };

  // Pass the context value to the provider's value prop
  const contextValue: MyContextType = {
    user,
    setUser,
    currentPosition,
    setCurrentPosition,
    churchesWithLocation,
    setChurchesWithLocation,
    getCurrentPosition,
  };

  useEffect(() => {
    if (global.navigator?.geolocation) {
      getCurrentPosition();
    }
  }, []);

  useEffect(() => {
    if (churches?.length > 0) {
      if (Object.keys(currentPosition).length > 0) {
        const updatedChurchesArray = calculateDistances(
          churches,
          currentPosition
        );
        setChurchesWithLocation(updatedChurchesArray);
      } else {
        setChurchesWithLocation(churches);
      }
    }
  }, [churches, currentPosition, setChurchesWithLocation]);

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

export default function App({ Component, pageProps }: AppProps) {
  const pagePropsObj = { ...pageProps };
  const churches = pagePropsObj.churches;

  return (
    <MyContextProvider churches={churches}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </MyContextProvider>
  );
}
