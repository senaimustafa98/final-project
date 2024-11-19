import { useRouter, Link, useLocalSearchParams, type Href } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

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
    color: colors.text,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    maxWidth: 350,
    height: 50,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'black',
  },
  registerText: {
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

const Login = () => {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo: string }>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Check if the user is already logged in
  useFocusEffect(
    useCallback(() => {
      async function checkSession() {
        try {
          const response = await fetch('/api/user', { credentials: 'include' });
          const responseBody = await response.json();

          if (response.ok && 'username' in responseBody) {
            // Redirect to the original route or fallback
            if (returnTo && typeof returnTo === 'string') {
              router.replace('/(auth)'); // Redirect to index.tsx
            }
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      }

      checkSession();
    }, [returnTo]),
  );

  // Handle user login
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear inputs and redirect after successful login
        setUsername('');
        setPassword('');
        if (returnTo && typeof returnTo === 'string') {
          router.replace(returnTo as Href);
        } else {
          router.replace('/(tabs)/profile');
        }
      } else {
        Alert.alert('Login failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Network error', 'Please try again later');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <CustomButton title="Login" onPress={handleLogin} />
      <Link href="/register" style={styles.registerText}>
        Don’t have an account? Register
      </Link>
      <Text style={styles.goBackText} onPress={() => router.push('/(auth)')}>
        Go Back
      </Text>
    </View>
  );
};

export default Login;
