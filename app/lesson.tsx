import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import ConfettiCannon from 'react-native-confetti-cannon';

// Lessons data array containing details about each lesson

const lessons = [
  { id: 1, title: 'LESSON 1', color: '#0792A0', explanation: 'Music theory is the study of the practices and possibilities of music.', question: 'What is music theory?', options: ['Study of music symbols and rules', 'Playing an instrument', 'Singing songs'], answer: 'Study of music symbols and rules' },
  { id: 2, title: 'LESSON 2', color: '#9F69A3', explanation: 'The staff consists of five lines and four spaces, each representing a different musical pitch.', question: 'How many lines does a musical staff have?', options: ['4', '5', '6'], answer: '5' },
  { id: 3, title: 'LESSON 3', color: '#F7DA31', explanation: 'Clefs assign specific pitches to the lines and spaces of the staff. The most common clefs are the treble clef and bass clef.', question: 'Which clef is also known as the G clef?', options: ['Bass clef', 'Treble clef', 'Alto clef'], answer: 'Treble clef' },
  { id: 4, title: 'LESSON 4', color: '#0792A0', explanation: 'Notes indicate the duration of sound. The most common notes are whole notes, half notes, quarter notes, eighth notes, and sixteenth notes.', question: 'How many beats does a whole note have in 4/4 time?', options: ['1', '2', '4'], answer: '4' },
  { id: 5, title: 'LESSON 5', color: '#9F69A3', explanation: 'Time signatures indicate the number of beats in each measure and what note value is equivalent to a beat.', question: 'What does the time signature 4/4 mean?', options: ['4 beats per measure, quarter note gets one beat', '3 beats per measure, half note gets one beat', '4 beats per measure, eighth note gets one beat'], answer: '4 beats per measure, quarter note gets one beat' },
  { id: 6, title: 'LESSON 6', color: '#F7DA31', explanation: 'Rests represent silence in music and have corresponding durations to notes.', question: 'What symbol represents a whole rest?', options: ['Upside-down hat', 'Hat', 'Z'], answer: 'Upside-down hat' },
  { id: 7, title: 'LESSON 7', color: '#0792A0', explanation: 'Steps refer to the distance between pitches, and accidentals are symbols that alter the pitch of a note (sharps, flats, naturals).', question: 'What does a sharp (#) do to a note?', options: ['Raises it by a whole step', 'Raises it by a half step', 'Lowers it by a half step'], answer: 'Raises it by a half step' },
  { id: 8, title: 'LESSON 8', color: '#9F69A3', explanation: 'Scales are sequences of notes in ascending or descending order. Major scales sound bright, while minor scales sound sad.', question: 'What is the pattern for a major scale?', options: ['W-W-H-W-W-W-H', 'W-H-W-W-H-W-W', 'H-W-W-H-W-H-W'], answer: 'W-W-H-W-W-W-H' },
  { id: 9, title: 'LESSON 9', color: '#F7DA31', explanation: 'Intervals are the distances between two notes, named by the number of steps they encompass.', question: 'What interval is an octave?', options: ['4th', '5th', '8th'], answer: '8th' },
  { id: 10, title: 'LESSON 10', color: '#0792A0', explanation: 'Chords are groups of notes played together. The basic types are major, minor, diminished, and augmented.', question: 'What notes make up a C major chord?', options: ['C, D, E', 'C, E, G', 'C, F, A'], answer: 'C, E, G' },
  { id: 11, title: 'LESSON 11', color: '#9F69A3', explanation: 'Chord progressions are sequences of chords played in a piece of music. Common progressions create harmonic structure.', question: 'What is a common chord progression in pop music?', options: ['I-IV-V-I', 'I-II-III-IV', 'I-VI-II-V'], answer: 'I-IV-V-I' },
  { id: 12, title: 'LESSON 12', color: '#F7DA31', explanation: 'Key signatures indicate the key of a piece by showing which notes are sharp or flat throughout.', question: 'How many sharps are in the key of G major?', options: ['1', '2', '3'], answer: '1' },
  { id: 13, title: 'LESSON 13', color: '#0792A0', explanation: 'The Circle of Fifths is a visual representation of the relationships among the 12 tones of the chromatic scale, their corresponding key signatures, and the associated major and minor keys.', question: 'What does the Circle of Fifths help you understand?', options: ['Key signatures', 'Note durations', 'Time signatures'], answer: 'Key signatures' },
  { id: 14, title: 'LESSON 14', color: '#9F69A3', explanation: 'Advanced intervals include compound intervals, which are intervals larger than an octave.', question: 'What is a compound interval?', options: ['An interval smaller than an octave', 'An interval larger than an octave', 'An interval within an octave'], answer: 'An interval larger than an octave' },
  { id: 15, title: 'LESSON 15', color: '#F7DA31', explanation: 'Seventh chords add an additional note to the basic triad, creating a richer sound. Common types are major seventh, minor seventh, dominant seventh, and diminished seventh.', question: 'What notes make up a C dominant seventh chord?', options: ['C, E, G, Bb', 'C, E, G, B', 'C, Eb, G, Bb'], answer: 'C, E, G, Bb' },
  { id: 16, title: 'LESSON 16', color: '#0792A0', explanation: 'Modes are scales derived from the major scale but starting on different notes. The seven modes are Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, and Locrian.', question: 'Which mode is the natural minor scale?', options: ['Ionian', 'Dorian', 'Aeolian'], answer: 'Aeolian' },
  { id: 17, title: 'LESSON 17', color: '#9F69A3', explanation: 'Inversions change the order of the notes in a chord. The root, first, and second inversions are commonly used.', question: 'What is the first inversion of a C major chord?', options: ['C, E, G', 'E, G, C', 'G, C, E'], answer: 'E, G, C' },
  { id: 18, title: 'LESSON 18', color: '#F7DA31', explanation: 'Harmonic functions describe the roles that chords play within a key. The primary functions are tonic, dominant, and subdominant.', question: 'What is the dominant chord in the key of C major?', options: ['C major', 'G major', 'F major'], answer: 'G major' },
  { id: 19, title: 'LESSON 19', color: '#0792A0', explanation: 'Non-harmonic tones are notes that do not belong to the chord they are played with. Types include passing tones, neighboring tones, suspensions, and appoggiaturas.', question: 'What is a passing tone?', options: ['A note that is part of the chord', 'A note that connects two chord tones', 'A note that delays a chord tone'], answer: 'A note that connects two chord tones' },
  { id: 20, title: 'LESSON 20', color: '#9F69A3', explanation: 'Advanced progressions involve secondary dominants, modulation, and borrowed chords.', question: 'What is a secondary dominant?', options: ['A dominant chord that resolves to the tonic', 'A dominant chord that resolves to a non-tonic chord', 'A minor chord that resolves to the tonic'], answer: 'A dominant chord that resolves to a non-tonic chord' },
  { id: 21, title: 'LESSON 21', color: '#F7DA31', explanation: 'Cadences are harmonic progressions that conclude a phrase, section, or piece of music. Types include perfect, imperfect, plagal, and deceptive cadences.', question: 'Which cadence ends on a dominant chord?', options: ['Perfect', 'Imperfect', 'Deceptive'], answer: 'Imperfect' },
  { id: 22, title: 'LESSON 22', color: '#0792A0', explanation: 'The chromatic scale consists of twelve pitches, each a half step apart.', question: 'How many notes are in a chromatic scale?', options: ['7', '8', '12'], answer: '12' },
  { id: 23, title: 'LESSON 23', color: '#9F69A3', explanation: 'The pentatonic scale consists of five notes per octave and is common in many musical traditions.', question: 'How many notes are in a pentatonic scale?', options: ['5', '7', '12'], answer: '5' },
  { id: 24, title: 'LESSON 24', color: '#F7DA31', explanation: 'Modulation is the process of changing from one key to another within a piece of music.', question: 'What is the term for changing keys in music?', options: ['Cadence', 'Modulation', 'Inversion'], answer: 'Modulation' },
  { id: 25, title: 'LESSON 25', color: '#0792A0', explanation: 'The harmonic minor scale is a minor scale with a raised seventh degree, creating a leading tone to the tonic.', question: 'What is the pattern for the harmonic minor scale?', options: ['W-H-W-W-H-W-H', 'W-H-W-W-H-A-H', 'W-H-W-W-H-W-W'], answer: 'W-H-W-W-H-A-H' },
  { id: 26, title: 'LESSON 26', color: '#9F69A3', explanation: 'The melodic minor scale ascends with raised sixth and seventh degrees and descends as a natural minor scale.', question: 'How does the melodic minor scale differ when ascending and descending?', options: ['Same both ways', 'Different ascending and descending', 'Only changes at the tonic'], answer: 'Different ascending and descending' },
  { id: 27, title: 'LESSON 27', color: '#F7DA31', explanation: 'Secondary dominants are chords that act as the dominant of a chord other than the tonic.', question: 'What is a secondary dominant in the key of C major?', options: ['G7', 'D7', 'A7'], answer: 'D7' },
  { id: 28, title: 'LESSON 28', color: '#0792A0', explanation: 'Borrowed chords are chords taken from the parallel key (major or minor) and used in a piece.', question: 'What is the term for chords taken from the parallel key?', options: ['Modulation', 'Borrowed chords', 'Secondary dominants'], answer: 'Borrowed chords' },
  { id: 29, title: 'LESSON 29', color: '#9F69A3', explanation: 'Suspensions are non-chord tones that create tension by prolonging a consonant note while the underlying harmony changes, resolved by stepwise motion.', question: 'What is a suspension?', options: ['A non-chord tone that resolves by step', 'A chord inversion', 'A modulation'], answer: 'A non-chord tone that resolves by step' },
  { id: 30, title: 'LESSON 30', color: '#F7DA31', explanation: 'Enharmonic equivalents are notes that sound the same but are written differently (e.g., C# and Db).', question: 'What is an enharmonic equivalent of C#?', options: ['D', 'Db', 'B#'], answer: 'Db' },
  { id: 31, title: 'LESSON 31', color: '#0792A0', explanation: 'The Neapolitan chord is a major chord built on the lowered second scale degree, usually found in first inversion.', question: 'What is the root of a Neapolitan chord in C major?', options: ['D', 'Db', 'Bb'], answer: 'Db' },
  { id: 32, title: 'LESSON 32', color: '#9F69A3', explanation: 'Augmented sixth chords contain an augmented sixth interval and are used to resolve to the dominant chord.', question: 'What interval characterizes an augmented sixth chord?', options: ['Augmented fifth', 'Augmented sixth', 'Perfect fifth'], answer: 'Augmented sixth' },
  { id: 33, title: 'LESSON 33', color: '#F7DA31', explanation: 'A diminished seventh chord consists of a diminished triad and a diminished seventh.', question: 'What notes make up a C diminished seventh chord?', options: ['C, Eb, Gb, Bbb', 'C, E, G, Bb', 'C, Eb, Gb, Bb'], answer: 'C, Eb, Gb, Bbb' },
  { id: 34, title: 'LESSON 34', color: '#0792A0', explanation: 'The twelve-tone technique involves using all twelve notes of the chromatic scale in a specific sequence without repeating any until all are used.', question: 'What does the twelve-tone technique ensure?', options: ['No note is repeated until all 12 are used', 'Only tonic notes are used', 'Major and minor scales are combined'], answer: 'No note is repeated until all 12 are used' },
  { id: 35, title: 'LESSON 35', color: '#9F69A3', explanation: 'Musical form and structure refer to the overall layout of a composition, including common forms like binary, ternary, rondo, and sonata-allegro.', question: 'What is a common form in classical music?', options: ['Binary', 'Triplet', 'Cluster'], answer: 'Binary' },
  { id: 36, title: 'LESSON 36', color: '#F7DA31', explanation: 'Analyzing classical pieces involves looking at their structure, harmony, melody, and use of musical elements.', question: 'What is the purpose of analyzing classical pieces?', options: ['To understand their structure', 'To memorize them', 'To play them faster'], answer: 'To understand their structure' },
];


const LessonScreen = () => {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const confettiRef = useRef(null);
  const errorAnimation = useRef(new Animated.Value(0)).current;
  // Effect to load completed lessons from Firestore when the component mounts

  useEffect(() => {
    const loadCompletedLessons = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setCompletedLessons(userData.completedLessons || [1]);
        }
      }
    };
    loadCompletedLessons();
  }, []);
  // Function to handle lesson card press

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
  // Function to handle answer selection

  const handleAnswer = async (selectedOption: string) => {
    const lesson = lessons.find((lesson) => lesson.id === expandedLesson);
    if (lesson && selectedOption === lesson.answer) {
      const newCompletedLessons = [...completedLessons, expandedLesson + 1];
      setCompletedLessons(newCompletedLessons);
      await AsyncStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));

      // Update Firestore
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          completedLessons: newCompletedLessons,
          highestLesson: Math.max(...newCompletedLessons),
        });
      }
      // Trigger the confetti animation

      if (confettiRef.current) {
        confettiRef.current.start();
      }

      Alert.alert('Correct!', `You have unlocked ${lessons.find((l) => l.id === expandedLesson + 1)?.title}`, [{ text: 'OK', onPress: handleClose }]);
    } else {
      Animated.sequence([
        Animated.timing(errorAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(errorAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert('Wrong answer', 'Please try again.');
    }
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
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.lessonsContainer}>
              {lessons
                .filter((lesson) => completedLessons.includes(lesson.id))
                .map((lesson) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[styles.lessonCard, { backgroundColor: lesson.color }]}
                    onPress={() => handlePress(lesson.id)}
                  >
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.fixedCard} onPress={() => setModalVisible(true)}>
            <Image source={require('../assets/images/homeimage.png')} style={styles.fixedCardImage} />
            <Text style={styles.fixedCardText}>Lesson Progressions</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.lessonCardExpanded, { backgroundColor: lessons.find(lesson => lesson.id === expandedLesson)?.color }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          {expandedLesson !== null && (
            <>
              <Text style={styles.lessonTitle}>
                {lessons.find((lesson) => lesson.id === expandedLesson)?.title}
              </Text>
              <Text style={styles.explanationText}>
                {lessons.find((lesson) => lesson.id === expandedLesson)?.explanation}
              </Text>
              <View style={styles.questionContainer}>
                <Image source={require('../assets/images/homeimage.png')} style={styles.speechBubbleImage} />
                <View style={styles.speechBubble}>
                  <Text style={styles.questionText}>
                    {lessons.find((lesson) => lesson.id === expandedLesson)?.question}
                  </Text>
                </View>
              </View>
              <View style={styles.optionsContainer}>
                {lessons.find((lesson) => lesson.id === expandedLesson)?.options.map((option) => (
                  <TouchableOpacity key={option} style={styles.optionButton} onPress={() => handleAnswer(option)}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      )}
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
      />
      <Animated.View style={[
        styles.errorImageContainer,
        {
          transform: [{ scale: errorAnimation }],
          opacity: errorAnimation,
        }
      ]}>
        <Image source={require('../assets/images/depressed.png')} style={styles.errorImage} />
      </Animated.View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lesson Progression</Text>
            <Text style={styles.modalText}>Lessons 1-7: These initial lessons introduce fundamental concepts like the musical staff, clefs, note durations, and accidentals. This approach is crucial because it establishes a strong foundation, allowing learners to grasp more complex ideas later.</Text>
            <Text style={styles.modalText}>Lessons 8-14: These lessons cover major and minor scales, intervals, and chord structures. Understanding scales and intervals is essential as they are the building blocks of melody and harmony in music.</Text>
            <Text style={styles.modalText}>Lessons 10-20: Introducing chords and their progressions helps students understand harmonic functions and how different chords interact within a key. This knowledge is pivotal for both performance and composition.</Text>
            <Text style={styles.modalText}>Lessons 21-36: These lessons delve into advanced topics like cadences, modulation, secondary dominants, borrowed chords, and the twelve-tone technique. They also cover musical forms and the analysis of classical pieces. These advanced topics are crucial for a deep understanding of music theory, enabling students to analyze and compose complex music.</Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 40,
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  lessonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  lessonCard: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  lessonCardExpanded: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  lessonTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
  },
  explanationText: {
    color: 'black',
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'left',
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  speechBubbleImage: {
    width: 100,
    height: 100,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    flex: 1,
  },
  questionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '30%',
  },
  optionText: {
    color: 'black',
    fontSize: 16,
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
    marginBottom: 20,
  },
  fixedCardImage: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedCardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
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
  errorImageContainer: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1,
    width: "45%",
  },
  errorImage: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeModalButton: {
    backgroundColor: '#0792A0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});


export default LessonScreen;
