import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Please enter both email and password');
      return;
    }

    // Display the alert and then navigate
    Alert.alert('Login successful!', '', [
      {
        text: 'OK',
        onPress: () => router.push('/(tabs)/profile'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />
      <Link href="/signup" style={styles.registerText}>
        Don’t have an account? Register
      </Link>
      <Text style={styles.goBackText} onPress={() => router.push('/(auth)')}>
        Go Back
      </Text>
    </View>
  );
};

export default Login;
