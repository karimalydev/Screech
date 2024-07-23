import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig'; // Remove storage import
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setEmail(userData.email);
          setBio(userData.bio || '');
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleBack = () => {
    router.push('/learn');
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleFriends = () => {
    router.push('/FriendsScreen');
  };

  const handleUpdateBio = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { bio });
      setIsEditingBio(false);
      Alert.alert('Bio updated!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/homeimage.png')} style={styles.profileImage} />
      <Text style={styles.greeting}>HI {username}!</Text>
      <Text style={styles.email}>{email}</Text>
      {isEditingBio ? (
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
          />
          <TouchableOpacity onPress={handleUpdateBio}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{bio}</Text>
          <TouchableOpacity onPress={() => setIsEditingBio(true)}>
            <FontAwesome name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSettings}>
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleFriends}>
        <Text style={styles.buttonText}>FRIENDS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>OVERVIEW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ACHIEVEMENTS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7DA31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0792A0',
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F7DA31',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bioInput: {
    width: 200,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
  },
  doneButton: {
    fontSize: 16,
    color: '#0792A0',
  },
  button: {
    width: 362,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
