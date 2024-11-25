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
  ActivityIndicator,
} from 'react-native';

type ExerciseSet = {
  reps: number;
  weight: number;
};

type SelectedExercise = {
  name: string;
  sets: ExerciseSet[];
};

const StartWorkout = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('My Workout');
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        const data = await response.json();
        if (data?.id) {
          setCurrentUserId(data.id);
        } else {
          console.error('User ID not found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }

    const apiKey = process.env.EXPO_PUBLIC_API_KEY;

    async function fetchExercises() {
      if (!apiKey) {
        console.error('API key is missing or undefined.');
        return;
      }

      try {
        setLoading(true);

        const headers: HeadersInit = new Headers({
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        });

        const response = await fetch(
          'https://exercisedb.p.rapidapi.com/exercises?limit=10',
          {
            method: 'GET',
            headers: headers,
          },
        );

        if (!response.ok) {
          throw new Error(`Error fetching exercises: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched exercises:', data);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises from API:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserId();
    fetchExercises();
  }, []);

  console.log('All ENV Variables:', process.env);
  console.log('EXPO_EXERCISE_DB_API_KEY:', process.env.EXPO_PUBLIC_API_KEY);

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

  const handleSelectExercise = (exercise: any) => {
    const newExercise: SelectedExercise = {
      name: exercise.name,
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
  const saveWorkout = async () => {
    if (!currentUserId) {
      alert('User ID is missing. Please try again.');
      return;
    }

    setSaving(true);
    try {
      const workoutData = {
        title: workoutTitle,
        duration: formatTime(seconds),
        userId: currentUserId,
        exercises: selectedExercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets,
        })),
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        alert('Workout saved successfully!');
        setWorkoutTitle('My Workout');
        setSelectedExercises([]);
        setSeconds(0);
        handleReset();
      } else {
        const errorResponse = await response.json();
        console.error('Error saving workout:', errorResponse);
        alert('Failed to save workout.');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('An error occurred while saving the workout.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.title}>Workout Timer</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <View style={styles.header}>
          <TextInput
            style={styles.titleInput}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            placeholder="Enter Workout Title"
          />
          <TouchableOpacity onPress={saveWorkout} disabled={saving}>
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
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
            {loading ? (
              <ActivityIndicator size="large" color="skyblue" />
            ) : (
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
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
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
  container: { flex: 1, backgroundColor: '#1c1c1e', padding: 20 },
  timerContainer: { alignItems: 'center', paddingVertical: 10, marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: '10%' },
  timer: { fontSize: 28, fontWeight: 'bold', color: 'skyblue' },
  buttonContainer: { flexDirection: 'row', marginBottom: 10 },
  button: {
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    width: '30%',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
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
    backgroundColor: 'skyblue',
    padding: 12,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '30%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 5,
    marginBottom: 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingHorizontal: 5,
    marginRight: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StartWorkout;
