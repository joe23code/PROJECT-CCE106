import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SettingsGearIcon } from '../components/icon';
import { hashPassword } from '../utils/sessionStats';

const Row = ({ title, description, value, onChange, theme }) => (
  <View style={{ padding: 15, backgroundColor: theme.surface, borderRadius: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.text, fontWeight: '800' }}>{title}</Text>
      <Text style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>{description}</Text>
    </View>
    <Switch value={value} onValueChange={onChange} trackColor={{ false: theme.border, true: theme.accent }} thumbColor={theme.text} />
  </View>
);

export default function SettingsScreen({ theme, account, setAccount, darkMode, setDarkMode, onLogOut }) {
  const [reminders, setReminders] = useState(true);
  const [streaks, setStreaks] = useState(true);
  const [safeMode, setSafeMode] = useState(true);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const [name, setName] = useState(account?.name || 'Member');
  const [email, setEmail] = useState(account?.email || '');
  const [goal, setGoal] = useState(account?.focusGoal || 'STUDY TIME');
  const [status, setStatus] = useState(account?.status || 'FOCUSED & FREE');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setName(account?.name || 'Member');
    setEmail(account?.email || '');
    setGoal(account?.focusGoal || 'STUDY TIME');
    setStatus(account?.status || 'FOCUSED & FREE');
  }, [account]);

  const saveAccount = () => {
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Enter a valid name and email address.');
      return;
    }
    setAccount(prev => ({ ...(prev || {}), name: name.trim(), email: email.trim(), focusGoal: goal.trim() || 'STUDY TIME', status: status.trim() || 'FOCUSED & FREE' }));
    setAccountModalOpen(false);
    Alert.alert('Success', 'Account information updated successfully.');
  };

  const changePassword = () => {
    if (!account?.passwordHash) {
      Alert.alert('Password setup required', 'This account was created before protected password storage was enabled. Log out and create/sign in to an account again to establish a protected password.');
      return;
    }
    if (hashPassword(currentPassword) !== account.passwordHash) {
      Alert.alert('Password not changed', 'The current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Password not changed', 'The new password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password not changed', 'The new passwords do not match.');
      return;
    }
    setAccount(prev => ({ ...prev, passwordHash: hashPassword(newPassword) }));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalOpen(false);
    Alert.alert('Success', 'Password updated successfully.');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <SettingsGearIcon size={27} color={theme.accent} />
        <Text style={{ color: theme.text, fontSize: 23, fontWeight: '900' }}>SETTINGS</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 }}>
        <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>ACCOUNT INFORMATION</Text>
        <TouchableOpacity onPress={() => setAccountModalOpen(true)}><Text style={{ color: theme.accent, fontWeight: '800', fontSize: 12 }}>EDIT</Text></TouchableOpacity>
      </View>

      <View style={{ padding: 15, backgroundColor: theme.surface, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: theme.border }}>
        <Text style={{ color: theme.text, fontWeight: '900', fontSize: 16 }}>{account?.name || 'Member'}</Text>
        <Text style={{ color: theme.muted, marginTop: 4 }}>{account?.email || 'No saved email'}</Text>
        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>FOCUS GOAL: {account?.focusGoal || 'STUDY TIME'}</Text>
        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>STATUS: {account?.status || 'FOCUSED & FREE'}</Text>
      </View>

      <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 22 }}>APPEARANCE</Text>
      <Row theme={theme} title="Dark mode" description="Keep the existing LOCKEDIN dark appearance, or switch to a readable light mode." value={darkMode} onChange={setDarkMode} />

      <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 22 }}>NOTIFICATIONS</Text>
      <Row theme={theme} title="Session reminders" description="Get a reminder before a planned session." value={reminders} onChange={setReminders} />
      <Row theme={theme} title="Streak alerts" description="Receive an alert before a streak may end." value={streaks} onChange={setStreaks} />

      <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 22 }}>SAFETY</Text>
      <Row theme={theme} title="Safe mode" description="Keep emergency access visible during focus sessions." value={safeMode} onChange={setSafeMode} />

      <TouchableOpacity onPress={() => Alert.alert('Settings saved', 'Your local settings have been updated.')} style={{ minHeight: 50, backgroundColor: theme.success, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE CHANGES</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogOut} style={{ minHeight: 48, borderColor: theme.accent, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 8 }}>
        <Text style={{ color: theme.accent, fontWeight: '900' }}>LOG OUT</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.border, alignItems: 'center', gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <TouchableOpacity onPress={() => setAboutModalOpen(true)}><Text style={{ color: theme.muted, fontSize: 13, fontWeight: '700' }}>About the App</Text></TouchableOpacity>
          <Text style={{ color: theme.border }}>•</Text>
          <TouchableOpacity onPress={() => setPrivacyModalOpen(true)}><Text style={{ color: theme.muted, fontSize: 13, fontWeight: '700' }}>Privacy Policy</Text></TouchableOpacity>
        </View>
        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>LOCKEDIN v1.0.0 • CCE 106 Project</Text>
      </View>

      <Modal visible={accountModalOpen} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
              <Text style={{ color: theme.text, fontSize: 19, fontWeight: '900', marginBottom: 18 }}>EDIT ACCOUNT INFORMATION</Text>
              {[
                ['Full Name', name, setName],
                ['Email Address', email, setEmail],
                ['Focus Goal', goal, setGoal],
                ['Status Tagline', status, setStatus],
              ].map(([placeholder, value, setter]) => (
                <TextInput key={placeholder} style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }} placeholder={placeholder} placeholderTextColor={theme.muted} value={value} onChangeText={setter} autoCapitalize={placeholder === 'Email Address' ? 'none' : 'sentences'} keyboardType={placeholder === 'Email Address' ? 'email-address' : 'default'} />
              ))}
              <TouchableOpacity onPress={() => setPasswordModalOpen(true)} style={{ minHeight: 44, backgroundColor: theme.surfaceAlt, borderWidth: 1, borderColor: theme.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ color: theme.text, fontWeight: '900' }}>CHANGE PASSWORD</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setAccountModalOpen(false)} style={{ flex: 1, alignItems: 'center', padding: 14 }}><Text style={{ color: theme.muted, fontWeight: '800' }}>CANCEL</Text></TouchableOpacity>
                <TouchableOpacity onPress={saveAccount} style={{ flex: 1, backgroundColor: theme.accent, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontWeight: '900' }}>SAVE</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={passwordModalOpen} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
            <Text style={{ color: theme.text, fontSize: 19, fontWeight: '900' }}>CHANGE PASSWORD</Text>
            <Text style={{ color: theme.muted, fontSize: 11, lineHeight: 17, marginTop: 7, marginBottom: 15 }}>For protection, verify your current password before choosing a new one.</Text>
            {[
              ['Current Password', currentPassword, setCurrentPassword],
              ['New Password', newPassword, setNewPassword],
              ['Confirm New Password', confirmPassword, setConfirmPassword],
            ].map(([placeholder, value, setter]) => (
              <TextInput key={placeholder} style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }} placeholder={placeholder} placeholderTextColor={theme.muted} value={value} onChangeText={setter} secureTextEntry />
            ))}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setPasswordModalOpen(false)} style={{ flex: 1, alignItems: 'center', padding: 14 }}><Text style={{ color: theme.muted, fontWeight: '800' }}>CANCEL</Text></TouchableOpacity>
              <TouchableOpacity onPress={changePassword} style={{ flex: 1, backgroundColor: theme.accent, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontWeight: '900' }}>UPDATE</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {[['ABOUT', aboutModalOpen, setAboutModalOpen, 'LOCKEDIN is a CCE 106 digital-detox application created to support intentional focus and emergency access.'], ['PRIVACY', privacyModalOpen, setPrivacyModalOpen, 'Personal data and saved emergency contacts are stored locally by this prototype.']].map(([title, visible, close, body]) => (
        <Modal key={title} visible={visible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
            <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
              <Text style={{ color: theme.text, fontSize: 19, fontWeight: '900', marginBottom: 10 }}>{title === 'ABOUT' ? 'ABOUT LOCKEDIN' : 'PRIVACY POLICY'}</Text>
              <Text style={{ color: theme.muted, fontSize: 13, lineHeight: 20, marginBottom: 18 }}>{body}</Text>
              <TouchableOpacity onPress={() => close(false)} style={{ backgroundColor: theme.surfaceAlt, borderRadius: 10, padding: 12, alignItems: 'center' }}><Text style={{ color: theme.text, fontWeight: '800' }}>CLOSE</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      ))}
    </ScrollView>
  );
}
