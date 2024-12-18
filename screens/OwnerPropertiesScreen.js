import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const OwnerPropertiesScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const response = await axios.get('http://192.168.1.17:8080/api/properties/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', 'Could not fetch your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to delete properties.');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.1.17:8080/api/properties/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Success', 'Property deleted successfully.');
              fetchProperties();
            } catch (error) {
              console.error('Error deleting property:', error);
              Alert.alert('Error', 'Could not delete the property. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Could not log out');
    }
  };
  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
      <Text style={styles.title}>Your Properties</Text>
      {properties.length === 0 ? (
        <Text style={styles.noPropertiesText}>No properties found. Add a new one!</Text>
      ) : (
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
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add Property')}
      >
        <Text style={styles.addButtonText}>+ Add Property</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
  },
  noPropertiesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OwnerPropertiesScreen;
