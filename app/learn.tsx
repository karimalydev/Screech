import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const LearnScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout functionality here
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleLearnMusicTheory = () => {
    router.push('/lesson');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
        <FontAwesome name="user" size={24} color="purple" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.theoryButton} onPress={handleLearnMusicTheory}>
        <Text style={styles.buttonText}>LEARN MUSIC THEORY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.instrumentButton}>
        <Text style={styles.buttonText}>LEARN INSTRUMENTS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    color:'#9F69A3',

  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,

  },
  theoryButton: {
    width: 362,
    height: 223,
    backgroundColor: '#9F69A3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  instrumentButton: {
    width: 362,
    height: 223,
    backgroundColor: '#0792A0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LearnScreen;
