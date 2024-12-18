import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await axios.get('http://192.168.1.17:8080/api/properties', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(response.data);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch properties');
      }
    };

    fetchProperties();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Could not log out');
    }
  };

  const viewPropertyDetails = (propertyId) => {
    navigation.navigate('Details', { propertyId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Explore Properties</Text>
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <View style={styles.propertyCard}>
            <Image 
              source={{ uri: `http://192.168.1.17:8080/api/files/uploads/${item.imageUrl}` }} 
              style={styles.image} 
            />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle}>{item.title}</Text>
              <Text style={styles.propertyLocation}>{item.location}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => viewPropertyDetails(item.id)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logoutIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff5a5f',
    borderRadius: 50,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
