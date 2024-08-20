import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const IndexScreen = () => {
  const router = useRouter();
  // Animated values for rotation and scaling of the logo
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
    // Reference to the sound object

  const soundRef = useRef<Audio.Sound | null>(null);
  // Function to handle the press event

  const handlePress = async () => {
    router.push('/login');
    if (soundRef.current) {
      console.log('Replaying sound');
      await soundRef.current.replayAsync();
    }
  };
  // useEffect to load the sound and start the animations when the component mounts

  useEffect(() => {
    const loadSound = async () => {
      console.log('Loading sound');
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/audio/welcome.mp3'));
        soundRef.current = sound;
        console.log('Sound loaded successfully');
        await sound.playAsync();
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSound();
    // Sequence of animations for rotating and scaling the logo

    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
    // Cleanup function to unload the sound when the component unmounts

    return () => {
      if (soundRef.current) {
        console.log('Unloading sound');
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      { rotate: rotateInterpolate },
      { scale: scale },
    ],
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Animated.Image
        source={require('../assets/images/homeimage.png')}
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
      <Text style={styles.title}>SCREECH</Text>
      <Text style={styles.subtitle}>ALL YOU CAN LEARN ABOUT MUSIC</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7DA31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    color: '#000',
  },
});

export default IndexScreen;
