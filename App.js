import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebase.config';  
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CameraPage from './Components/CameraPage';
import AuthPage from './Components/AuthPage';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const AuthContext = createContext();
const Stack = createStackNavigator();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [previousLocation, setPreviousLocation] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed, user:", user); 
      setUser(user);  
    });

    return () => unsubscribe(); 
  }, []);

 
  useEffect(() => {
    let watcher; 

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 120000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude });

          if (previousLocation) {
            const distance = getDistance(
              previousLocation,
              { latitude, longitude }
            );
            setDistanceTravelled((prev) => prev + distance);
          }
          setPreviousLocation({ latitude, longitude });
        }
      );
    })();

   
    return () => {
      if (watcher) {
        watcher.remove(); 
      }
    };
  }, [previousLocation]);

  return (
    <AuthContext.Provider value={{ user, setUser, distanceTravelled }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const { user } = useAuth();  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen 
            name="Camera" 
            component={CameraPage} 
            options={{ headerShown: false }} 
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={AuthPage} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Root() {
  return (
    <AuthProvider>
     
      <App />

    </AuthProvider>
  );
}
