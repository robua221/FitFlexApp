
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import NearbyGymsScreen from '../screens/NearbyGymsScreen';

const Tab = createMaterialTopTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14 },
        tabBarStyle: { backgroundColor: '#6E44FF' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
        height:50,
        tabBarIndicatorStyle: { backgroundColor: '#ffa', height: 3 },
      }
    }
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="NearbyGyms" component={NearbyGymsScreen} />
    </Tab.Navigator>
  );
}
