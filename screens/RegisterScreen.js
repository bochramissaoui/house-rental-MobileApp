import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity ,TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.1.17:8080/api/auth/register', { username, password, role });
      Alert.alert('Registration Successful', 'You can now log in!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', 'Username might be taken.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
 <Text style={styles.roleLabel}>Select Role:</Text>
      <View style={styles.radioContainer}>
        <TouchableWithoutFeedback onPress={() => setRole('USER')}>
          <View style={styles.radioButton}>
            <View style={role === 'USER' ? styles.radioSelected : styles.radioUnselected} />
            <Text style={styles.radioText}>User</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setRole('OWNER')}>
          <View style={styles.radioButton}>
            <View style={role === 'OWNER' ? styles.radioSelected : styles.radioUnselected} />
            <Text style={styles.radioText}>Owner</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
