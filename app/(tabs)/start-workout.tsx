import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StartWorkout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a New Workout</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
});

export default StartWorkout;
