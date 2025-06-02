import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useAuth } from '../App';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import AdCarousel from './Ads';
const { width, height } = Dimensions.get('window');

export default function CameraPage() {
  const { user, distanceTravelled } = useAuth();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.front);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facesDetected, setFacesDetected] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0); 
  const [previousFaceID, setPreviousFaceID] = useState(null); 
  const [ads, setAds] = useState([]); 
  const [loadingAds, setLoadingAds] = useState(true); 

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('Camera Permission:', status);
    };

    requestCameraPermission();

    const fetchAdvertisements = async () => {
      try {
       
        const adsCollectionRef = collection(db, '/advertisements ');
        
        const adsQuery = query(adsCollectionRef);
        const adsSnapshot = await getDocs(adsQuery);

        if (adsSnapshot.empty) {
          console.log('No active advertisements found.');
          setLoadingAds(false);
          return;
        }

        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setAds(adsList);
      } catch (error) {
        console.error('Error fetching advertisements from Firestore:', error);
      } finally {
        setLoadingAds(false);
      }
    };
    
    fetchAdvertisements();
  }, []);

  const handleCameraReady = () => {
    setIsCameraReady(true);
    console.log('Camera is ready');
  };

  const handleFacesDetected = async ({ faces }) => {
    if (faces.length > 0) {
      const faceID = faces[0].faceID;
      console.log('Face IDs detected:', faceID);
  
      if (faceID !== previousFaceID) {
        setPreviousFaceID(faceID); 

        try {
          const userEmail = user.email;
          const userCollectionRef = collection(db, "users", userEmail, "faces");

          await addDoc(userCollectionRef, {
            faceID: faceID,
            distanceTravelled: distanceTravelled,
            timestamp: new Date()
          });

          console.log(`New faceID: ${faceID} and distance: ${distanceTravelled} added to Firestore`);
        } catch (error) {
          console.error('Error adding new faceID to Firestore:', error);
        }
      }
  
      setFacesDetected(true);
    } else {
      console.log('No faces detected');
      setFacesDetected(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
      </View>
    );
  }

  if (loadingAds) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading advertisements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraReady ? (
        <Text style={styles.text}>{facesDetected ? 'Adsonwheels' : 'Ride??'}</Text>
      ) : (
        <Text style={styles.text}>started?...</Text>
      )}
      <Camera
        style={styles.camera}
        type={type}
        onCameraReady={handleCameraReady}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 10000,
          tracking: true,
        }}
      />
      
      {/* Carousel for advertisements */}
      <View style={styles.overlay}>
        {ads[currentAdIndex] ? (
          <AdCarousel ads={ads}/>
        ) : (
          <Text style={styles.adText}>No ads available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adImage: {
    width: width * 0.9,  
    height: height * 0.5, 
    objectFit:'contain'
  },
  adText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    position: 'absolute',
    top: 10,
  },
});
