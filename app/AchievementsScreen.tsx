import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Array of motivational quotes
const motivationalQuotes = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream it. Wish it. Do it.",
];

const AchievementsScreen = () => {
    // State variables for storing the highest lesson number and the selected motivational quote

  const [highestLesson, setHighestLesson] = useState<number>(0);
  const [quote, setQuote] = useState<string>('');
  // Hook to manage navigation within the app
  const router = useRouter();

  useEffect(() => {
    const loadCompletedLessons = async () => {
      const storedCompletedLessons = await AsyncStorage.getItem('completedLessons');
      if (storedCompletedLessons) {
        const lessonsArray = JSON.parse(storedCompletedLessons);
        setHighestLesson(Math.max(...lessonsArray));
      }
    };
        // Function to select a random quote from the motivationalQuotes array

    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    };

    loadCompletedLessons();
    getRandomQuote();
  }, []);
  // Function to handle the back button press, navigating to the previous screen

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.circle}>
        <Text style={styles.lessonNumber}>{highestLesson}</Text>
      </View>
      <Text style={styles.quoteText}>{quote}</Text>
      <Image source={require('../assets/images/chill.png')} style={styles.bottomImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9F69A3',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonNumber: {
    fontSize: 100,
    color: 'white',
    fontWeight: 'bold',
  },
  quoteText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomImage: {
    width: 100,
    height: 100,
    marginTop: 30,
  },
});

export default AchievementsScreen;
