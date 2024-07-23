import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const IndexScreen = () => {  // Renamed from WelcomeScreen
  const router = useRouter();

  const handlePress = () => {
    router.push('/login');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={require('../assets/images/homeimage.png')} style={styles.logo} />
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

export default IndexScreen;  // Renamed from WelcomeScreen
