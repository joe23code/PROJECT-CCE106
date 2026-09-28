import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PersonIcon, FireIcon, StopwatchIcon, ShieldIcon } from '../components/icon';
import { getSessionStats, formatDuration } from '../utils/sessionStats';

export default function ProfileScreen({ theme, account, setAccount, sessions, onStartFocus, motivation, setMotivation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(account?.name || 'Member');
  const [editStatus, setEditStatus] = useState(account?.status || 'FOCUSED & FREE');
  const [editGoal, setEditGoal] = useState(account?.focusGoal || 'STUDY TIME');
  const [motivationDraft, setMotivationDraft] = useState(motivation);
  const [motivationSaved, setMotivationSaved] = useState(false);

  useEffect(() => {
    setEditName(account?.name || 'Member');
    setEditStatus(account?.status || 'FOCUSED & FREE');
    setEditGoal(account?.focusGoal || 'STUDY TIME');
  }, [account]);

  const stats = getSessionStats(sessions);

  const handleSaveProfile = () => {
    const name = editName.trim() || 'User';
    const status = editStatus.trim() || 'FOCUSED & FREE';
    const focusGoal = editGoal.trim() || 'STUDY TIME';
    setAccount(prev => ({ ...(prev || {}), name, status, focusGoal }));
    setIsEditing(false);
    Alert.alert('Success', 'Profile information updated successfully.');
  };

  const reward = (title, description) => Alert.alert(title, description);

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 35, backgroundColor: theme.background }}>
      <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.surfaceAlt, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.success }}>
          <PersonIcon size={26} color={theme.text} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>{account?.name || 'Member'}</Text>
          <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '800', marginTop: 2 }}>• {(account?.status || 'FOCUSED & FREE').toUpperCase()}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: theme.muted, fontSize: 10, marginTop: 2 }}>STREAK: {stats.streak} DAYS</Text>
            <FireIcon size={14} color={theme.accent} />
            <Text style={{ color: theme.muted, fontSize: 10, marginTop: 2 }}> | LOCKED: {formatDuration(stats.totalLockedSeconds)}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ backgroundColor: theme.success, minWidth: 54, minHeight: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsEditing(true)}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>EDIT</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {[
          ['SESSIONS COMPLETED', String(stats.completedCount)],
          ['TOTAL HOURS LOCKED', formatDuration(stats.totalLockedSeconds)],
          ['LONGEST SESSION', formatDuration(stats.longestSeconds)],
          ['TOP FOCUS GOAL', (account?.focusGoal || 'STUDY TIME').toUpperCase()],
        ].map(([label, value]) => (
          <View key={label} style={{ width: '48.5%', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 12 }}>
            <Text style={{ color: theme.muted, fontSize: 8.5, fontWeight: '800', letterSpacing: 0.8 }}>{label}</Text>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '900', marginTop: 4 }}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: theme.text, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 }}>
        MY REWARDS ({stats.achievements.length} UNLOCKED)
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {stats.allAchievements.filter(a => a.unlocked).map(a => (
          <TouchableOpacity key={a.id} onPress={() => reward(a.label, 'This achievement was calculated from your saved focus-session records.')} style={{ width: '31%', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 10, alignItems: 'center' }}>
            {a.id === 'five-day' ? <FireIcon size={24} color={theme.accent} /> : a.id === 'hour' ? <StopwatchIcon size={24} color={theme.text} /> : <ShieldIcon size={24} color={theme.accent} />}
            <Text style={{ color: theme.accent, backgroundColor: theme.surfaceAlt, fontSize: 9, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginTop: 4, textAlign: 'center' }}>{a.label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
        {!stats.achievements.length && <Text style={{ color: theme.muted, fontSize: 12 }}>Complete sessions to unlock rewards.</Text>}
      </View>

      <TouchableOpacity style={{ backgroundColor: theme.accent, minHeight: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} onPress={onStartFocus}>
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 }}>+ START FOCUS SESSION</Text>
      </TouchableOpacity>


      <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 15, marginTop: 16 }}>
        <Text style={{ color: theme.text, fontWeight: '900', fontSize: 15 }}>DAILY MOTIVATION</Text>
        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 5 }}>This appears on your home dashboard.</Text>
        <TextInput value={motivationDraft} onChangeText={setMotivationDraft} multiline placeholderTextColor={theme.muted} style={{ minHeight: 80, color: theme.text, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 11, marginTop: 12, textAlignVertical: 'top' }} />
        <TouchableOpacity onPress={() => { setMotivation(motivationDraft.trim() || 'Small steps today create a stronger tomorrow.'); setMotivationSaved(true); }} style={{ backgroundColor: theme.accent, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 11 }}>SAVE MOTIVATION</Text>
        </TouchableOpacity>
        {motivationSaved && <Text style={{ color: theme.success, fontSize: 11, fontWeight: '800', marginTop: 9 }}>Motivation saved successfully.</Text>}
      </View>

      <Modal visible={isEditing} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.78)', justifyContent: 'center', padding: 20 }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <View style={{ backgroundColor: theme.surface, padding: 22, borderRadius: 12, borderWidth: 1, borderColor: theme.border }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>EDIT PROFILE</Text>
              {[
                ['NAME', editName, setEditName, 'Enter name'],
                ['STATUS TAGLINE', editStatus, setEditStatus, 'e.g. Focused & Free'],
                ['TOP FOCUS GOAL', editGoal, setEditGoal, 'e.g. Study Time'],
              ].map(([label, value, setter, placeholder]) => (
                <View key={label}>
                  <Text style={{ color: theme.muted, fontSize: 12, marginBottom: 6 }}>{label}</Text>
                  <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={theme.muted} style={{ backgroundColor: theme.input, color: theme.text, padding: 12, borderRadius: 6, marginBottom: 14, borderWidth: 1, borderColor: theme.border }} />
                </View>
              ))}
              <Text style={{ color: theme.muted, fontSize: 11, marginBottom: 14 }}>{account?.email || 'Email can be changed from Settings → Account Information.'}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: theme.surfaceAlt, padding: 12, borderRadius: 6, alignItems: 'center' }} onPress={() => setIsEditing(false)}>
                  <Text style={{ color: theme.text, fontWeight: '600' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: theme.accent, padding: 12, borderRadius: 6, alignItems: 'center' }} onPress={handleSaveProfile}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
