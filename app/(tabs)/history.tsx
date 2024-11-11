import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

type ExerciseSet = {
  reps: number;
  weight: number;
};

type Exercise = {
  name: string;
  sets: ExerciseSet[];
};

type Workout = {
  id: number;
  title: string;
  created_at: string;
  duration: string | null;
  exercises: Exercise[];
};

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/api/workouts');
        const textResponse = await response.text();
        console.log('API response:', textResponse); // Log the full response

        const data = JSON.parse(textResponse);
        console.log('Parsed data:', data); // Log the parsed data
        setWorkouts(data.workouts); // Adjust if needed
      } catch (error) {
        console.error('Error fetching workouts:', error); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedWorkoutIndex(index === expandedWorkoutIndex ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutItem}>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Text style={styles.workoutDate}>{new Date(workout.created_at).toLocaleDateString()}</Text>
                <Text style={styles.workoutDetail}>{`${workout.title} - ${workout.duration || 'Unknown duration'}`}</Text>
                <Text style={styles.workoutExercises}>{`${workout.exercises.length} Exercises`}</Text>
              </TouchableOpacity>

              {expandedWorkoutIndex === index && (
                <View style={styles.exerciseDetails}>
                  {workout.exercises.map((exercise, exIndex) => (
                    <View key={exIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      {exercise.sets.map((set, setIndex) => (
                        <View key={setIndex} style={styles.setDetail}>
                          <Text style={styles.setText}>{`Set ${setIndex + 1}:`}</Text>
                          <Text style={styles.setText}>{`${set.reps} reps, ${set.weight} kg`}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1e', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  scrollContainer: { paddingBottom: 20 },
  workoutItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  workoutDate: { color: 'skyblue', fontSize: 16, fontWeight: 'bold' },
  workoutDetail: { color: 'white', fontSize: 14, marginTop: 5 },
  workoutExercises: { color: 'gray', fontSize: 12, marginTop: 2 },
  exerciseDetails: { marginTop: 10, paddingLeft: 10 },
  exerciseItem: { marginBottom: 10 },
  exerciseName: { color: 'skyblue', fontSize: 14, fontWeight: 'bold' },
  setDetail: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  setText: { color: 'white', fontSize: 12 },
});

export default WorkoutHistory;
