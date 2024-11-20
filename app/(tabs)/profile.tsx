import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { useRouter } from 'expo-router';

type UserData = {
  id: number;
  username: string;
  workouts: Array<any>;
  workoutCount: number | null;
  createdAt: string | null;
};

const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        const data: UserData = await response.json();
        // Debug
        console.warn('API Response:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

 /*  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });

        // Raw response
        const rawData = await response.json();
        console.warn('Raw API Response:', rawData);

        // Ensure correct data assignment
        const data: UserData = {
          username: rawData.username,
          workouts: [],
          workoutCount: rawData.workoutCount || 0,
          createdAt: rawData.createdAt || 'N/A',
        };

        console.warn('Processed UserData:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []); */


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
        <Button
          title="Retry"
          onPress={() => router.replace('/profile')}
          color="#007aff"
        />
      </View>
    );
  }

  const { username, workouts, createdAt, workoutCount } = userData;


  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{username}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.workoutCount || 0}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
        <Text style={styles.statNumber}>
        {createdAt || 'N/A'}
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
