import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

const Workout = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Options</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/(tabs)/start-workout')}
      >
        <Text style={styles.optionText}>Start Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/(tabs)/start-workout-template')}
      >
        <Text style={styles.optionText}>Start Workout from Template</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default Workout;
