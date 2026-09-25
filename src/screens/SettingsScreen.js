import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SettingsGearIcon } from '../components/icon';

const Row = ({ title, description, value, onChange }) => (
  <View style={{ padding: 15, backgroundColor: '#191b20', borderRadius: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flex: 1 }}>
      <Text style={{ color: '#fff', fontWeight: '800' }}>{title}</Text>
      <Text style={{ color: '#9da0a7', fontSize: 11, marginTop: 4 }}>{description}</Text>
    </View>
    {typeof value === 'boolean' && (
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#484b53', true: '#f04421' }}
      />
    )}
  </View>
);

export default function SettingsScreen({ account, setAccount, darkMode, setDarkMode, onLogOut }) {
  const [reminders, setReminders] = useState(true);
  const [streaks, setStreaks] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  // Modals
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Editable Account Form State
  const [name, setName] = useState(account?.name || 'Member');
  const [email, setEmail] = useState(account?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOpenAccountModal = () => {
    setName(account?.name || 'Member');
    setEmail(account?.email || '');
    setPassword('');
    setConfirmPassword('');
    setAccountModalOpen(true);
  };

  const handleSaveAccount = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email fields cannot be empty.');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (setAccount) {
      setAccount({
        ...account,
        name: name.trim(),
        email: email.trim(),
      });
    }

    setAccountModalOpen(false);
    Alert.alert('Success', 'Account details updated successfully.');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <SettingsGearIcon size={27} color="#f04421" />
        <Text style={{ color: '#fff', fontSize: 23, fontWeight: '900' }}>SETTINGS</Text>
      </View>

      {/* Account Information Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 }}>
        <Text style={{ color: '#f47057', fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>ACCOUNT INFORMATION</Text>
        <TouchableOpacity onPress={handleOpenAccountModal}>
          <Text style={{ color: '#f04421', fontWeight: '800', fontSize: 12 }}>EDIT</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 15, backgroundColor: '#191b20', borderRadius: 12, marginTop: 10 }}>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{account?.name || name}</Text>
        <Text style={{ color: '#a4a7ae', marginTop: 4 }}>{account?.email || email || 'No saved email'}</Text>
        <Text style={{ color: '#858991', fontSize: 11, marginTop: 8 }}>
          Password: ••••••••
        </Text>
      </View>
      
      <Text style={{ color: '#f47057', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 22 }}>
        NOTIFICATIONS
      </Text>
      <Row title="Session reminders" description="Get a reminder before a planned session." value={reminders} onChange={setReminders} />
      <Row title="Streak alerts" description="Receive an alert before a streak may end." value={streaks} onChange={setStreaks} />

      <Text style={{ color: '#f47057', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 22 }}>
        SAFETY
      </Text>
      <Row title="Safe mode" description="Keep emergency access visible during focus sessions." value={safeMode} onChange={setSafeMode} />

      <TouchableOpacity
        onPress={() => Alert.alert('Settings saved', 'Your local settings have been updated.')}
        style={{ minHeight: 50, backgroundColor: '#20a447', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 25 }}
      >
        <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE CHANGES</Text>
      </TouchableOpacity>

      {/* Footer / About & Privacy Section */}
      <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#282b32', alignItems: 'center', gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <TouchableOpacity onPress={() => setAboutModalOpen(true)}>
            <Text style={{ color: '#a4a7ae', fontSize: 13, fontWeight: '700' }}>About the App</Text>
          </TouchableOpacity>
          <Text style={{ color: '#41444c' }}>•</Text>
          <TouchableOpacity onPress={() => setPrivacyModalOpen(true)}>
            <Text style={{ color: '#a4a7ae', fontSize: 13, fontWeight: '700' }}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onLogOut}
          style={{ minHeight: 48, borderColor: '#f04421', borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 8 }}
        >
          <Text style={{ color: '#f47057', fontWeight: '900' }}>LOG OUT</Text>
        </TouchableOpacity>

        <Text style={{ color: '#5d6068', fontSize: 11, marginTop: 4 }}>
          LOCKEDIN v1.0.0 • CCE 106 Project
        </Text>
      </View>

      {/* --- Edit Account Modal --- */}
      <Modal visible={accountModalOpen} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '900', marginBottom: 18 }}>
              EDIT ACCOUNT INFORMATION
            </Text>

            <TextInput
              style={{ color: '#fff', borderColor: '#41444c', borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }}
              placeholder="Full Name"
              placeholderTextColor="#858991"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={{ color: '#fff', borderColor: '#41444c', borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }}
              placeholder="Email Address"
              placeholderTextColor="#858991"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={{ color: '#858991', fontSize: 11, fontWeight: '700', marginTop: 4, marginBottom: 8 }}>
              CHANGE PASSWORD (OPTIONAL)
            </Text>

            <TextInput
              style={{ color: '#fff', borderColor: '#41444c', borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }}
              placeholder="New Password"
              placeholderTextColor="#858991"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              style={{ color: '#fff', borderColor: '#41444c', borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 16 }}
              placeholder="Confirm New Password"
              placeholderTextColor="#858991"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setAccountModalOpen(false)} style={{ flex: 1, alignItems: 'center', padding: 14 }}>
                <Text style={{ color: '#c7c9cd', fontWeight: '800' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAccount} style={{ flex: 1, backgroundColor: '#f04421', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- About App Modal --- */}
      <Modal visible={aboutModalOpen} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '900', marginBottom: 10 }}>ABOUT LOCKEDIN</Text>
            <Text style={{ color: '#9da0a7', fontSize: 13, lineHeight: 20, marginBottom: 18 }}>
              LOCKEDIN is a CCE 106 digital-detox application created to support intentional focus and block digital distractions while ensuring rapid access to critical emergency contacts when needed.
            </Text>
            <TouchableOpacity onPress={() => setAboutModalOpen(false)} style={{ backgroundColor: '#353840', borderRadius: 10, padding: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Privacy Policy Modal --- */}
      <Modal visible={privacyModalOpen} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '900', marginBottom: 10 }}>PRIVACY POLICY</Text>
            <Text style={{ color: '#9da0a7', fontSize: 13, lineHeight: 20, marginBottom: 18 }}>
              Your privacy is fundamental. Personal data, login details, and saved emergency contacts remain securely encrypted locally on your device and are never shared with third parties.
            </Text>
            <TouchableOpacity onPress={() => setPrivacyModalOpen(false)} style={{ backgroundColor: '#353840', borderRadius: 10, padding: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}