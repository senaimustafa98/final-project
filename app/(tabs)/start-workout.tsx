import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { exercises } from '../../database/Exercises';

type SelectedExercise = (typeof exercises)[0] & {
  sets: { reps: number; weight: number }[];
};

const StartWorkout = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);

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
    const newExercise: SelectedExercise = {
      ...exercise,
      sets: [{ reps: 0, weight: 0 }],
    };
    setSelectedExercises((prevExercises) => [...prevExercises, newExercise]);
    setShowExerciseList(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((_, i) => i !== index),
    );
  };

  const addSet = (exerciseIndex: number) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise, i) =>
        i === exerciseIndex
          ? { ...exercise, sets: [...exercise.sets, { reps: 0, weight: 0 }] }
          : exercise,
      ),
    );
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: number,
  ) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                j === setIndex ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, j) => j !== setIndex),
            }
          : exercise,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedExercises.length > 0 && (
          <View style={styles.selectedExercisesContainer}>
            {selectedExercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.selectedExercise}>
                <View style={styles.exerciseHeader}>
                  <Image
                    source={{ uri: exercise.gifUrl }}
                    style={styles.exerciseGif}
                  />
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <TouchableOpacity
                    style={styles.removeExerciseButton}
                    onPress={() => handleRemoveExercise(exerciseIndex)}
                  >
                    <Text style={styles.buttonText}>Remove Exercise</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.setHeader}>
                  <Text style={styles.setHeaderText}>SET</Text>
                  <Text style={styles.setHeaderText}>KG</Text>
                  <Text style={styles.setHeaderText}>REPS</Text>
                </View>

                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <Text style={styles.setNumber}>{setIndex + 1}</Text>
                    <TextInput
                      style={styles.inputSmall}
                      placeholder="KG"
                      keyboardType="numeric"
                      value={set.weight.toString()}
                      onChangeText={(value) =>
                        handleSetChange(
                          exerciseIndex,
                          setIndex,
                          'weight',
                          parseInt(value) || 0,
                        )
                      }
                    />
                    <TextInput
                      style={styles.inputSmall}
                      placeholder="Reps"
                      keyboardType="numeric"
                      value={set.reps.toString()}
                      onChangeText={(value) =>
                        handleSetChange(
                          exerciseIndex,
                          setIndex,
                          'reps',
                          parseInt(value) || 0,
                        )
                      }
                    />
                  </View>
                ))}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.addSetButton}
                    onPress={() => addSet(exerciseIndex)}
                  >
                    <Text style={styles.buttonText}>Add Set</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeSetButton}
                    onPress={() =>
                      handleRemoveSet(exerciseIndex, exercise.sets.length - 1)
                    }
                  >
                    <Text style={styles.buttonText}>Remove Set</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={handleAddExercise}
      >
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>

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
                  <Text style={styles.exerciseItemText}>{item.name}</Text>
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
  container: { flex: 1, backgroundColor: '#1c1c1e' },
  timerContainer: { alignItems: 'center', paddingVertical: 10, marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: '10%' },
  timer: { fontSize: 28, fontWeight: 'bold', color: 'skyblue' },
  buttonContainer: { flexDirection: 'row', marginBottom: 10 },
  button: {
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: { fontSize: 12, fontWeight: 'bold', color: 'white' },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 80,
  },
  selectedExercisesContainer: { width: '100%' },
  selectedExercise: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseGif: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  exerciseName: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  removeExerciseButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 'auto',
  },

  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  setHeaderText: { fontSize: 12, color: 'gray' },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  setNumber: { fontSize: 14, color: 'white', width: 30, textAlign: 'center' },
  inputSmall: {
    width: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  addSetButton: {
    backgroundColor: '#007aff',
    padding: 6,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  removeSetButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  addExerciseButton: {
    backgroundColor: '#ff914d',
    padding: 12,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  exerciseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  exerciseItemText: { fontSize: 18 },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default StartWorkout;
