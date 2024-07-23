import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore'; // Ensure getDoc is imported
import { auth, db } from '../firebaseConfig';
import { router } from 'expo-router';

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: string;
}

interface Friend {
  id: string;
  friendId: string;
  username: string;
  bio: string;
  profilePicture: string;
}

const FriendsScreen = () => {
  const [tab, setTab] = useState<'friends' | 'add'>('friends');
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'friendRequests'), where('toUserId', '==', user.uid), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requestsData: FriendRequest[] = [];
        querySnapshot.forEach((doc) => {
          requestsData.push({ ...doc.data(), id: doc.id } as FriendRequest);
        });
        setRequests(requestsData);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, `users/${user.uid}/friends`));
        const querySnapshot = await getDocs(q);
        const friendsList: Friend[] = [];
        for (const friendDoc of querySnapshot.docs) {
          const friendData = friendDoc.data();
          const friendId = friendData.friendId;
          const friendProfileDoc = await getDoc(doc(db, 'users', friendId));
          if (friendProfileDoc.exists()) {
            const friendProfile = friendProfileDoc.data();
            friendsList.push({
              id: friendId,
              friendId: friendId,
              username: friendProfile.username,
              bio: friendProfile.bio || '',
              profilePicture: friendProfile.profilePicture || '',
            });
          }
        }
        setFriends(friendsList);
      }
    };

    fetchFriends();
  }, [requests]);

  const handleAddFriend = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        const toUserId = snapshot.docs[0].id;
        await addDoc(collection(db, 'friendRequests'), {
          fromUserId: user.uid,
          toUserId: toUserId,
          status: 'pending',
        });
        Alert.alert('Friend request sent!');
        setUsername('');
      } else {
        Alert.alert('User not found');
      }
    }
  };

  const handleAcceptRequest = async (id: string, fromUserId: string) => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'friendRequests', id), { status: 'accepted' });
      await addDoc(collection(db, `users/${user.uid}/friends`), { friendId: fromUserId });
      await addDoc(collection(db, `users/${fromUserId}/friends`), { friendId: user.uid });
      Alert.alert('Friend request accepted');
    }
  };

  const handleDeclineRequest = async (id: string) => {
    await deleteDoc(doc(db, 'friendRequests', id));
    Alert.alert('Friend request declined');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/profile')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'friends' && styles.activeTabButton]}
          onPress={() => setTab('friends')}
        >
          <Text style={styles.tabButtonText}>My Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'add' && styles.activeTabButton]}
          onPress={() => setTab('add')}
        >
          <Text style={styles.tabButtonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
      {tab === 'friends' ? (
        <>
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.requestContainer}>
                <Text>{item.fromUserId} wants to be friends</Text>
                <View style={styles.requestButtons}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(item.id, item.fromUserId)}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton} onPress={() => handleDeclineRequest(item.id)}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.friendContainer}>
                <Image source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/homeimage.png')} style={styles.friendImage} />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendUsername}>{item.username}</Text>
                  <Text style={styles.friendBio}>Status : {item.bio}</Text>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7DA31',
    padding: 16,
  },
  backButton: {
    backgroundColor: '#0792A0',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 60,
    left: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 100,
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: '#0792A0',
    padding: 10,
    borderRadius: 5,
  },
  activeTabButton: {
    backgroundColor: '#056A76',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  requestContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 5,
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  addFriendContainer: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0792A0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 5,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendDetails: {
    flexDirection: 'column',
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendBio: {
    fontSize: 14,
    color: '#333',
  },
});

export default FriendsScreen;
