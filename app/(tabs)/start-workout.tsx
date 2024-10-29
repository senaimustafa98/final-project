import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { exercises } from '../../database/Exercises';

const StartWorkout = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<
    (typeof exercises)[0][]
  >([]); // Store multiple exercises

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddExercise = () => setShowExerciseList(true);

  const handleSelectExercise = (exercise: (typeof exercises)[0]) => {
    setSelectedExercises((prevExercises) => [...prevExercises, exercise]); // Add exercise to the list
    setShowExerciseList(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((_, i) => i !== index),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Timer</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>

      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Add Exercise Button */}
      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={handleAddExercise}
      >
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>

      {/* Display Selected Exercises */}
      {selectedExercises.length > 0 && (
        <View style={styles.selectedExercisesContainer}>
          <Text style={styles.exerciseTitle}>Selected Exercises:</Text>
          {selectedExercises.map((exercise, index) => (
            <View key={index} style={styles.selectedExercise}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseBodyPart}>
                Target: {exercise.target}
              </Text>
              <Text style={styles.exerciseEquipment}>
                Equipment: {exercise.equipment}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Exercise List Modal */}
      <Modal
        visible={showExerciseList}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Exercise</Text>
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseItem}
                  onPress={() => handleSelectExercise(item)}
                >
                  <Text style={styles.exerciseText}>{item.name}</Text>
                  <Text style={styles.exerciseBodyPart}>{item.bodyPart}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowExerciseList(false)}>
              <Text style={styles.closeButton}>Close</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'skyblue',
    marginBottom: 30,
  },
  buttonContainer: { flexDirection: 'row', marginBottom: '20%' },
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
  },
  addExerciseButton: {
    marginTop: 30,
    backgroundColor: '#ff914d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  selectedExercisesContainer: { marginTop: 30, alignItems: 'center' },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  selectedExercise: { marginBottom: 15, alignItems: 'center' },
  exerciseName: { fontSize: 18, color: 'white', marginBottom: 5 },
  exerciseBodyPart: { fontSize: 16, color: 'gray', marginBottom: 5 },
  exerciseEquipment: { fontSize: 16, color: 'gray', marginBottom: 5 },
  removeButton: { color: 'red', marginTop: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  exerciseItem: {
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#ccc',
  },
  exerciseText: { fontSize: 18 },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default StartWorkout;
