import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FireIcon, HeartIcon, JournalIcon, TimerIcon } from '../components/icon';
import { formatDuration, getSessionStats } from '../utils/sessionStats';

export default function HomeScreen({ name, motivation, sessions, onNavigate, theme }) {
  const stats = getSessionStats(sessions);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 18, paddingBottom: 35 }}>
      <Text style={{ color: theme.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>YOUR DASHBOARD</Text>
      <Text style={{ color: theme.text, fontSize: 28, fontWeight: '900', marginTop: 4 }}>Hello, {name}</Text>

      <View style={{ marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: theme.surfaceAlt, borderLeftWidth: 3, borderLeftColor: theme.accent }}>
        <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '900' }}>TODAY'S MOTIVATION</Text>
        <Text style={{ color: theme.text, marginTop: 7 }}>{motivation}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
        <View style={{ flex: 1, backgroundColor: theme.surfaceAlt, padding: 14, borderRadius: 10 }}>
          <Text style={{ color: theme.muted, fontSize: 11 }}>STREAK</Text>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 7 }}>
            <FireIcon size={20} color={theme.accent} />
            <Text style={{ color: theme.text, fontSize: 21, fontWeight: '900' }}>{stats.streak} DAYS</Text>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: theme.surface, padding: 14, borderRadius: 10 }}>
          <Text style={{ color: theme.muted, fontSize: 11 }}>TOTAL LOCKED</Text>
          <Text style={{ color: theme.text, fontSize: 21, fontWeight: '900', marginTop: 12 }}>{formatDuration(stats.totalLockedSeconds)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        {[
          ['COMPLETED', String(stats.completedCount)],
          ['LONGEST', formatDuration(stats.longestSeconds)],
        ].map(([label, value]) => (
          <View key={label} style={{ flex: 1, backgroundColor: theme.surface, padding: 12, borderRadius: 10 }}>
            <Text style={{ color: theme.muted, fontSize: 10 }}>{label}</Text>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 18 }}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        {[
          ['TODAY', formatDuration(stats.dailySeconds)],
          ['THIS WEEK', formatDuration(stats.weeklySeconds)],
        ].map(([label, value]) => (
          <View key={label} style={{ flex: 1, backgroundColor: theme.surface, padding: 12, borderRadius: 10 }}>
            <Text style={{ color: theme.muted, fontSize: 10 }}>{label}</Text>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 18 }}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: theme.text, fontWeight: '900', marginTop: 20 }}>ACHIEVEMENTS</Text>
      <Text style={{ color: theme.accent, marginTop: 6 }}>
        {stats.achievements.length
          ? stats.achievements.map(a => a.label).join(' · ')
          : 'Complete your first session to unlock an achievement.'}
      </Text>

      <TouchableOpacity onPress={() => onNavigate('focus')} style={{ backgroundColor: theme.accent, borderRadius: 14, padding: 17, flexDirection: 'row', justifyContent: 'center', gap: 9, marginTop: 22 }}>
        <TimerIcon size={21} />
        <Text style={{ color: '#fff', fontWeight: '900' }}>SET FOCUS TIME</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
        <TouchableOpacity onPress={() => onNavigate('contacts')} style={{ flex: 1, backgroundColor: theme.surface, padding: 14, borderRadius: 12 }}>
          <HeartIcon color={theme.accent} />
          <Text style={{ color: theme.text, fontWeight: '800', marginTop: 12 }}>EMERGENCY CONTACTS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate('journal')} style={{ flex: 1, backgroundColor: theme.surface, padding: 14, borderRadius: 12 }}>
          <JournalIcon color={theme.accent} />
          <Text style={{ color: theme.text, fontWeight: '800', marginTop: 12 }}>FOCUS JOURNAL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
