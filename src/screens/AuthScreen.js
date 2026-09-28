import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { KeyIcon, PersonIcon } from '../components/icon';
import { hashPassword } from '../utils/sessionStats';

export default function AuthScreen({ theme, onComplete, onBack }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const input = {
    color: theme.text,
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 15,
    marginBottom: 12
  };

  const submit = () => {
    if ((creating && (!name.trim() || !privacyAccepted)) || !email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.');
      return;
    }
    onComplete({
      name: creating ? name.trim() : 'Member',
      email: email.trim(),
      passwordHash: hashPassword(password),
      focusGoal: 'STUDY TIME',
      status: 'FOCUSED & FREE',
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: theme.background }} keyboardShouldPersistTaps="handled">
      <Header theme={theme} />
      <View style={{ paddingTop: 34 }}>
        <Text style={{ color: theme.text, fontSize: 30, fontWeight: '900' }}>{creating ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</Text>
        <Text style={{ color: theme.muted, marginTop: 8, lineHeight: 20 }}>{creating ? 'Create a private account to begin your intentional phone-free sessions.' : 'Sign in to continue your focus journey.'}</Text>

        {creating && (
          <View style={{ marginTop: 24 }}>
            <PersonIcon color={theme.accent} size={19} />
            <TextInput style={input} placeholder="Full name" placeholderTextColor={theme.muted} value={name} onChangeText={setName} />
          </View>
        )}

        <View style={{ marginTop: creating ? 0 : 24 }}>
          <Text style={{ color: theme.muted, fontSize: 12, fontWeight: '800', marginBottom: 7 }}>EMAIL ADDRESS</Text>
          <TextInput style={input} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={theme.muted} value={email} onChangeText={setEmail} />
        </View>

        <Text style={{ color: theme.muted, fontSize: 12, fontWeight: '800', marginBottom: 7 }}>PASSWORD</Text>
        <TextInput style={input} secureTextEntry placeholder="At least 6 characters" placeholderTextColor={theme.muted} value={password} onChangeText={setPassword} />

        {creating && (
          <View>
            <Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18, marginBottom: 14 }}>By creating an account, you confirm that focus sessions are voluntary and emergency access remains available.</Text>
            <TouchableOpacity onPress={() => setPrivacyAccepted(!privacyAccepted)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <Switch value={privacyAccepted} onValueChange={setPrivacyAccepted} trackColor={{ false: theme.border, true: theme.accent }} />
              <Text style={{ color: theme.text, flex: 1, fontSize: 12, marginLeft: 9 }}>I have read and agree to the Data Privacy Act notice, privacy policy, and responsible use of my personal data.</Text>
            </TouchableOpacity>
          </View>
        )}

        {error ? <Text style={{ color: theme.accent, fontSize: 12, marginBottom: 12 }}>{error}</Text> : null}

        <TouchableOpacity onPress={submit} style={{ backgroundColor: theme.accent, borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '900', letterSpacing: 1 }}>{creating ? 'CREATE ACCOUNT' : 'LOG IN'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setCreating(!creating); setError(''); }} style={{ padding: 19, alignItems: 'center' }}>
          <Text style={{ color: theme.accent, fontWeight: '800' }}>{creating ? 'Already have an account? Log in' : 'New to LOCKEDIN? Create account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={{ alignItems: 'center', padding: 8 }}><Text style={{ color: theme.muted }}>Back to welcome</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
