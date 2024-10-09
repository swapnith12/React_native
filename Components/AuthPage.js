import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Sign-In Successful');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    if (password !== reEnterPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration Successful');
    } catch (err) {
      setError(err.message);
    }
  };

  const ToggleSign = () => {
    setEmail('');
    setPassword('');
    setIsRegistering((prev) => !prev);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.scrollContainer}>
       <Text style={styles.heading}>AdsonWheels</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {isRegistering && (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter Password"
                value={reEnterPassword}
                onChangeText={setReEnterPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          {isRegistering ? (
            <>
              <Button title="Register" onPress={handleRegister} />
              <Text style={styles.toggleText} onPress={ToggleSign}>
                Already have an account? Sign In
              </Text>
            </>
          ) : (
            <>
              <Button title="Sign In" onPress={handleSignIn} />
              <Text style={styles.toggleText} onPress={ToggleSign}>
                Don't have an account? Register
              </Text>
            </>
          )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  heading: {
    fontSize: height * 0.05,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: height * 0.05,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  toggleText: {
    marginTop: height * 0.02,
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignIn;
