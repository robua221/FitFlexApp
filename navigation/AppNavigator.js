import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainTabs from './MainTabs'; 

import AIAssistant from '../screens/AIAssistant';
import ExerciseVideosScreen from '../screens/ExerciseVideosScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
<Stack.Screen name="AIAssitant" component={AIAssistant} />
<Stack.Screen name="ExerciseVideos" component={ExerciseVideosScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
