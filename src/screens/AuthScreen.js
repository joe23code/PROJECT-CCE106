import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { KeyIcon, MailIcon, PersonIcon } from '../components/icon';

const input = {
  color: '#fff',
  backgroundColor: '#191b20',
  borderWidth: 1,
  borderColor: '#353840',
  borderRadius: 12,
  height: 52,
  paddingHorizontal: 15,
  marginBottom: 12
};

export default function AuthScreen({ onComplete, onBack }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const submit = () => {
    if ((creating && (!name.trim() || !privacyAccepted)) || !email.includes('@') || password.length < 6) {
      return setError('Enter a valid email and a password with at least 6 characters.');
    }
    onComplete({ name: creating ? name.trim() : 'Member', email });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <Header />
      <View style={{ paddingTop: 34 }}>
        <Text style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900' }}>
          {creating ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
        </Text>
        <Text style={{ color: '#a4a7ae', marginTop: 8, lineHeight: 20 }}>
          {creating
            ? 'Create a private account to begin your intentional phone-free sessions.'
            : 'Sign in to continue your focus journey.'}
        </Text>

        {creating && (
          <View style={{ position: 'relative', marginTop: 24 }}>
            <PersonIcon color="#f04a28" size={19} style={{ position: 'absolute' }} />
            <TextInput
              style={input}
              placeholder="Full name"
              placeholderTextColor="#777b83"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={{ marginTop: creating ? 0 : 24 }}>
          <Text style={{ color: '#c6c8cc', fontSize: 12, fontWeight: '800', marginBottom: 7 }}>
            EMAIL ADDRESS
          </Text>
          <TextInput
            style={input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#777b83"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={{ color: '#c6c8cc', fontSize: 12, fontWeight: '800', marginBottom: 7 }}>
          PASSWORD
        </Text>
        <TextInput
          style={input}
          secureTextEntry
          placeholder="At least 6 characters"
          placeholderTextColor="#777b83"
          value={password}
          onChangeText={setPassword}
        />

        {creating && (
          <View>
          <Text style={{ color: '#8f939b', fontSize: 12, lineHeight: 18, marginBottom: 14 }}>
            By creating an account, you confirm that focus sessions are voluntary and emergency access remains available.
          </Text>
          <TouchableOpacity onPress={() => setPrivacyAccepted(!privacyAccepted)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}><Switch value={privacyAccepted} onValueChange={setPrivacyAccepted} trackColor={{ false: '#484b53', true: '#f04421' }} /><Text style={{ color: '#d7d9de', flex: 1, fontSize: 12, marginLeft: 9 }}>I have read and agree to the Data Privacy Act notice, privacy policy, and responsible use of my personal data.</Text></TouchableOpacity>
          </View>
        )}

        {error ? <Text style={{ color: '#ff735d', fontSize: 12, marginBottom: 12 }}>{error}</Text> : null}

        <TouchableOpacity
          onPress={submit}
          style={{ backgroundColor: '#f04421', borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', letterSpacing: 1 }}>
            {creating ? 'CREATE ACCOUNT' : 'LOG IN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCreating(!creating);
            setError('');
          }}
          style={{ padding: 19, alignItems: 'center' }}
        >
          <Text style={{ color: '#f47057', fontWeight: '800' }}>
            {creating ? 'Already have an account? Log in' : 'New to LOCKEDIN? Create account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack} style={{ alignItems: 'center', padding: 8 }}>
          <Text style={{ color: '#9da0a7' }}>Back to welcome</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
