import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { COLORS, FONTS } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={FONTS.title}>Welcome !!</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={FONTS.button}>Login</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate('Signup')} style={{ marginTop: 10 }}>
        Don't have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginVertical: 10, backgroundColor: '#fff' },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }
});
