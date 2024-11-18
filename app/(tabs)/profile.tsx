import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

type UserData = {
  username: string;
  email: string;
  workouts: Array<any>;
  createdAt: string;
};

const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user/profile');
        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load user data</Text>
        <Button title="Retry" onPress={() => router.replace('/profile')} color="#007aff" />
      </View>
    );
  }

  const { username, email, workouts, createdAt } = userData;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{username}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.statLabel}>Account Created</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
  },
});

export default UserProfile;
