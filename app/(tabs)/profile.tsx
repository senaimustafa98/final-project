import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

const UserProfile = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>User Name</Text>
      <Text style={styles.email}>user@something.com</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>something (hours?)</Text>
          <Text style={styles.statLabel}>something</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Edit Profile" onPress={() => {}} color="#007aff" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Logout"
            onPress={() => router.push('/(auth)/login')}
            color="red"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  buttonWrapper: {
    marginVertical: 10,
  },
});

export default UserProfile;
