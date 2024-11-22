import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

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
  createdAt: string;
  duration: string | null;
  exercises: Exercise[];
};

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<
    null | number
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWorkoutsForUser = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch the current user
      const userResponse = await fetch('/api/user+api.ts', {
        credentials: 'include',
      });
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await userResponse.json();
      const userId = userData.id;

      // Fetch the user's workouts
      const workoutResponse = await fetch(`/api/workouts?user_id=${userId}`);
      if (!workoutResponse.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const workoutData = await workoutResponse.json();
      setWorkouts(workoutData.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchWorkoutsForUser() {
        setLoading(true);
        try {
          const userResponse = await fetch('/api/user', {
            credentials: 'include',
          });
          const userData = await userResponse.json();

          if (!userResponse.ok || !userData.id) {
            throw new Error('Failed to fetch user ID');
          }

          const workoutResponse = await fetch(
            `/api/workouts?user_id=${userData.id}`,
          );
          if (!workoutResponse.ok) {
            throw new Error('Failed to fetch workouts');
          }

          const workoutData = await workoutResponse.json();
          if (isActive) {
            setWorkouts(workoutData.workouts);
          }
        } catch (error) {
          console.error('Error fetching workouts:', error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      fetchWorkoutsForUser();

      return () => {
        isActive = false;
      };
    }, []),
  );

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
                <Text style={styles.workoutDate}>
                  {new Date(workout.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.workoutDetail}>
                  {`${workout.title} - ${workout.duration || 'Unknown duration'}`}
                </Text>
                <Text style={styles.workoutExercises}>
                  {`${workout.exercises.length} Exercises`}
                </Text>
              </TouchableOpacity>
              {expandedWorkoutIndex === index && (
                <View style={styles.exerciseDetails}>
                  {workout.exercises.map((exercise, exIndex) => (
                    <View key={exIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      {exercise.sets.map((set, setIndex) => (
                        <View key={setIndex} style={styles.setDetail}>
                          <Text style={styles.setText}>
                            {`Set ${setIndex + 1}:`}
                          </Text>
                          <Text style={styles.setText}>
                            {`${set.reps} reps, ${set.weight} kg`}
                          </Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
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
  setDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  setText: { color: 'white', fontSize: 12 },
});

export default WorkoutHistory;
