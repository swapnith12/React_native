import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAvAVMnytYCnMako3xqIBdDaSg6gb_2cbI",
  authDomain: "adsonwheels-c7f32.web.app",
  projectId: "adsonwheels-c7f32",
  storageBucket: "adsonwheels-c7f32.appspot.com",
  messagingSenderId: "853779579252",
  appId: "1:853779579252:android:aae8f2c95835aafaf1ac21",
  measurementId: "G-9G1R7DSQ93",
};



const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth ,db};
