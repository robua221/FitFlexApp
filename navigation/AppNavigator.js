import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import NearbyGymsScreen from "../screens/NearbyGymsScreen";
import AIAssistant from "../screens/AIAssistant";
import ExerciseVideosScreen from "../screens/ExerciseVideosScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ActivityTrackerScreen from "../screens/ActivityTrackerScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {/* Authentication */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="NearbyGyms" component={NearbyGymsScreen} />
        <Stack.Screen name="AIAssistant" component={AIAssistant} />
        <Stack.Screen name="ExerciseVideos" component={ExerciseVideosScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        <Stack.Screen
          name="ActivityTracker"
          component={ActivityTrackerScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
