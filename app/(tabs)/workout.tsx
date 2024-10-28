import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Workout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      <Text style={styles.content}>Start a new workout or choose a workout template.</Text>
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
    color: '#ffffff',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#d3d3d3',
    textAlign: 'center',
  },
});

export default Workout;
