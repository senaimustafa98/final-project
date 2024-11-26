import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to</Text>
        <Image
          source={require('../../assets/1morerep.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Link href="/login" style={styles.buttonLink}>
          <Text style={styles.buttonText}>Login</Text>
        </Link>
        <Link href="/register" style={styles.buttonLink}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Link>
      </View>
      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 40,
    marginTop: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonLink: {
    backgroundColor: 'skyblue',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
