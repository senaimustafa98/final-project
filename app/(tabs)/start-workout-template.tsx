import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

type Workout = {
  date: string;
  type: string;
  duration: string;
  exercises: {
    name: string;
    sets: { reps: number; weight: number }[];
  }[];
};

// Placeholder workout data
const workoutData: Workout[] = [
  {
    date: 'June 12, 2023',
    type: 'Full Body',
    duration: '60 mins',
    exercises: [
      { name: 'Squat', sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 60 }] },
      { name: 'Bench Press', sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 45 }] },
      { name: 'Deadlift', sets: [{ reps: 6, weight: 80 }] },
    ],
  },
  // Additional placeholder workouts...
];

const StartWorkoutTemplate = () => {
  const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedWorkoutIndex(index === expandedWorkoutIndex ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout History</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {workoutData.map((workout, index) => (
          <View key={index} style={styles.workoutItem}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
              <Text style={styles.workoutDetail}>{`${workout.type} - ${workout.duration}`}</Text>
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

export default StartWorkoutTemplate;
