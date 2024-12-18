import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import DetailsScreen from '../screens/DetailsScreen';
import OwnerPropertiesScreen from '../screens/OwnerPropertiesScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Add Property" component={AddPropertyScreen} />
      <Stack.Screen name="Owner Properties" component={OwnerPropertiesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
