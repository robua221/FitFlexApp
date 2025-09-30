import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { COLORS, FONTS } from '../utils/theme';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert("Signup Error", error.message);
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={FONTS.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={FONTS.button}>Sign Up</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
        Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginVertical: 10, backgroundColor: '#fff' },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }
});
