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
    color: colors.text,
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
  const router = useRouter(); // Go back button
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userName, setUsername] = useState<string>('');

  const handleSignUp = () => {
    if (email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Please fill out ALL fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    Alert.alert('Account created successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.placeholder}
        value={userName}
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.placeholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
