import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  Image,
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
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>

        {selectedExercises.length > 0 && (
          <View style={styles.selectedExercisesContainer}>
            <Text style={styles.exerciseTitle}>Current Workout:</Text>
            {selectedExercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.selectedExercise}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>

                <View style={styles.rowContainer}>
                  <Image
                    source={{ uri: exercise.gifUrl }}
                    style={styles.exerciseGif}
                  />
                  <View style={styles.inputContainer}>
                    {exercise.sets.map((set, setIndex) => (
                      <View key={setIndex} style={styles.setContainer}>
                        <Text style={styles.setLabel}>Set {setIndex + 1}</Text>

                        <View style={styles.inputRow}>
                          <Text style={styles.inputLabel}>Reps</Text>
                          <TextInput
                            style={styles.inputFullWidth}
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
                        <View style={styles.inputRow}>
                          <Text style={styles.inputLabel}>KG</Text>
                          <TextInput
                            style={styles.inputFullWidth}
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
                        </View>
                        <TouchableOpacity
                          style={styles.removeSetButton}
                          onPress={() =>
                            handleRemoveSet(exerciseIndex, setIndex)
                          }
                        >
                          <Text style={styles.buttonText}>Remove Set</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.addSetButton}
                    onPress={() => addSet(exerciseIndex)}
                  >
                    <Text style={styles.buttonText}>Add Set</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveExercise(exerciseIndex)}
                  >
                    <Text style={styles.buttonText}>Remove Exercise</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
  timerContainer: { alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 40 },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'skyblue',
    marginBottom: 10,
  },
  buttonContainer: { flexDirection: 'row', marginBottom: 20 },
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: { fontSize: 13, fontWeight: 'bold', color: 'white' },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 80,
  },
  addExerciseButton: {
    backgroundColor: '#ff914d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedExercisesContainer: { width: '100%' },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  selectedExercise: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  exerciseName: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  exerciseGif: { width: 80, height: 80, resizeMode: 'contain' },
  inputContainer: { flex: 1, marginLeft: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  setContainer: { marginBottom: 5 },
  setLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  inputLabel: { fontSize: 16, color: 'white', marginRight: 10 },
  inputFullWidth: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 8,
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
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  removeSetButton: {
    backgroundColor: 'orange',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
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
