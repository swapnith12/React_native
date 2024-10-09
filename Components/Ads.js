import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const AdCarousel = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fading effect

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        fadeIn(); // After fade-out, fade-in the new ad
      });
    };

    const interval = setInterval(() => {
      if (ads.length > 0) {
        fadeOut(); // Trigger the transition animation
      }
    }, 5000);

    fadeIn(); // Initial fade-in when the component mounts

    return () => clearInterval(interval);
  }, [ads]);

  return (
    <View style={styles.overlay}>
      {ads.length > 0 ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.adText}>{`Advertisement ${currentAdIndex+1} `}</Text>
          {ads[currentAdIndex].image && (
            <Image
              source={{ uri: ads[currentAdIndex].image }}
              style={styles.adImage}
              resizeMode="cover"
            />
          )}
        </Animated.View>
      ) : (
        <Text style={styles.noAdsText}>No ads available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,  // Smooth rounded corners
    backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Semi-transparent dark background for better text contrast
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  adImage: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 15,
    marginTop: 10,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: 'white',
  },
  adText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  noAdsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4747',  // Red color for "No ads available"
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
});

export default AdCarousel;
