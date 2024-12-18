import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddPropertyScreen = () => {
  const [title, setTitle] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant gallery access to select images.');
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProperty = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      Alert.alert('Authentication required', 'You must be logged in to add a property');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('longitude', longitude);
    formData.append('latitude', latitude);
    formData.append('description', description);

    if (imageUri) {
      const imageName = imageUri.split('/').pop();
      const imageType = `image/${imageUri.split('.').pop()}`;
      formData.append('image', { uri: imageUri, type: imageType, name: imageName });
    }

    try {
      const response = await axios.post('http://192.168.1.17:8080/api/properties/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Property added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Owner Properties') },
      ]);
    } catch (error) {
      console.error('Error adding property:', error);
      Alert.alert('Error', 'Could not add property. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Property</Text>

      <TextInput
        style={styles.input}
        placeholder="Property Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
        <Text style={styles.imagePickerButtonText}>{imageUri ? 'Change Image' : 'Select Image'}</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
        <Text style={styles.addButtonText}>Add Property</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPropertyScreen;
