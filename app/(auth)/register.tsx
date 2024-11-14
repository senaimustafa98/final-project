import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'skyblue',
    textAlign: 'center',
  },
  loginText: {
    marginTop: 15,
    color: 'orange',
    textAlign: 'center',
    fontSize: 16,
  },
  goBackText: {
    marginTop: 15,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (username === '' || password === '') {
      Alert.alert('Please fill out all fields');
      return;
    }

    try {
      const response = await fetch(`/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Account created successfully!');
        router.push('/login');
      } else {
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Network error', 'Please try again later');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.placeholder}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Register" onPress={handleSignUp} />
      <Link href="/login" style={styles.loginText}>
        Already have an account? Login
      </Link>
      <Text style={styles.goBackText} onPress={() => router.push('/(auth)')}>
        Go Back
      </Text>
      <StatusBar style="light" />
    </View>
  );
};

export default SignUp;
