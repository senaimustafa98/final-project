import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../../constants/colors';
import { useFocusEffect, useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#1c1c1e',
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
    marginBottom: 35,
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
    fontSize: 24,
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
  textInput: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    color: colors.text,
    marginBottom: 10,
    width: '80%',
    fontSize: 20,
    textAlign: 'center',
  },
});

type UserData = {
  id: number;
  username: string;
  workouts: Array<any>;
  workoutCount: number;
  createdAt: string;
};

const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useFocusEffect(
  useCallback(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        const data: UserData = await response.json();
        setUserData({
          ...data,
          workoutCount: data.workoutCount,
          createdAt: data.createdAt,
        });
        setNewUsername(data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [])
);

  const handleSaveUsername = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData((prevData) =>
          prevData
            ? {
                ...prevData,
                username: updatedUser.username, // Ensure all other properties remain the same
              }
            : null
        );
        Alert.alert('Success', 'Username updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to update username.');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Error', 'An error occurred while updating the username.');
    }
  };

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
      {isEditing ? (
        <TextInput
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder="Enter new username"
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.name}>{username}</Text>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.workoutCount}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{createdAt}</Text>
          <Text style={styles.statLabel}>Account Created</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title={isEditing ? 'Save Username' : 'Edit Username'}
            onPress={isEditing ? handleSaveUsername : () => setIsEditing(true)}
            color="#007aff"
          />
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

export default UserProfile;
