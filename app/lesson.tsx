import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const lessons = [
  { id: 1, title: 'LESSON 1', color: '#0792A0' },
  { id: 2, title: 'LESSON 2', color: '#9F69A3' },
  { id: 3, title: 'LESSON 3', color: '#F7DA31' },
  { id: 4, title: 'LESSON 4', color: '#0792A0' },
  { id: 5, title: 'LESSON 5', color: '#9F69A3' },
];

const LessonScreen = () => {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const router = useRouter();

  const handlePress = (lessonId: number) => {
    setExpandedLesson(lessonId);
  };

  const handleClose = () => {
    setExpandedLesson(null);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      {expandedLesson === null ? (
        <>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
              <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lessonsContainer}>
            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonCard, { backgroundColor: lesson.color }]}
                onPress={() => handlePress(lesson.id)}
              >
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.fixedCard}>
              <Image source={require('../assets/images/homeimage.png')} style={styles.fixedCardImage} />
              <Text style={styles.fixedCardText}>RANDOM QUESTIONS</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={[styles.lessonCardExpanded, { backgroundColor: lessons.find(lesson => lesson.id === expandedLesson)?.color }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.lessonTitle}>
            {lessons.find((lesson) => lesson.id === expandedLesson)?.title}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 40,  // added margin to move it down from the top
  },
  lessonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonCard: {
    width: '90%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  lessonCardExpanded: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  fixedCard: {
    width: '90%',
    height: 70,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  fixedCardImage: {
    width: 50,
    height: 50,
  },
  fixedCardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0792A0',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F7DA31',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonScreen;
