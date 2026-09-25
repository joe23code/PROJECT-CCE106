import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FireIcon, HeartIcon, JournalIcon, TimerIcon } from '../components/icon';

const format = sec => `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;

export default function HomeScreen({ name, motivation, sessions, onNavigate, theme }) {
  // Derive dashboard statistics and achievements from persisted session records.
  const completed = sessions.filter(s => s.outcome === 'completed');
  const total = completed.reduce((sum, s) => sum + s.seconds, 0);
  const longest = completed.reduce((max, s) => Math.max(max, s.seconds), 0);
  const days = new Set(completed.map(s => new Date(s.endedAt).toDateString())).size;
  
  const achievements = [
    completed.length >= 1 && 'First session',
    total >= 3600 && 'One focused hour',
    completed.length >= 10 && 'Ten sessions'
  ].filter(Boolean);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 18, paddingBottom: 35 }}>
      <Text style={{ color: '#9da0a7', fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>
        YOUR DASHBOARD
      </Text>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 4 }}>
        Hello, {name}
      </Text>

      <View style={{ marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: '#21191a', borderLeftWidth: 3, borderLeftColor: '#f04421' }}>
        <Text style={{ color: '#f47057', fontSize: 10, fontWeight: '900' }}>
          TODAY'S MOTIVATION
        </Text>
        <Text style={{ color: '#f4f4f5', marginTop: 7 }}>
          {motivation}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
        <View style={{ flex: 1, backgroundColor: '#21191a', padding: 14, borderRadius: 10 }}>
          <Text style={{ color: '#a4a7ae', fontSize: 11 }}>STREAK</Text>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 7 }}>
            <FireIcon size={20} color="#f04421" />
            <Text style={{ color: '#fff', fontSize: 21, fontWeight: '900' }}>
              {days} DAYS
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: '#191b20', padding: 14, borderRadius: 10 }}>
          <Text style={{ color: '#a4a7ae', fontSize: 11 }}>TOTAL FOCUS</Text>
          <Text style={{ color: '#fff', fontSize: 21, fontWeight: '900', marginTop: 12 }}>
            {format(total)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <View style={{ flex: 1, backgroundColor: '#191b20', padding: 12, borderRadius: 10 }}>
          <Text style={{ color: '#a4a7ae', fontSize: 10 }}>COMPLETED</Text>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>
            {completed.length}
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: '#191b20', padding: 12, borderRadius: 10 }}>
          <Text style={{ color: '#a4a7ae', fontSize: 10 }}>LONGEST</Text>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>
            {format(longest)}
          </Text>
        </View>
      </View>

      <Text style={{ color: '#fff', fontWeight: '900', marginTop: 20 }}>
        ACHIEVEMENTS
      </Text>
      <Text style={{ color: '#f47057', marginTop: 6 }}>
        {achievements.length
          ? achievements.join(' · ')
          : 'Complete your first session to unlock an achievement.'}
      </Text>

      <TouchableOpacity
        onPress={() => onNavigate('focus')}
        style={{
          backgroundColor: '#f04421',
          borderRadius: 14,
          padding: 17,
          flexDirection: 'row',
          justify: 'center',
          gap: 9,
          marginTop: 22
        }}
      >
        <TimerIcon size={21} />
        <Text style={{ color: '#fff', fontWeight: '900' }}>SET FOCUS TIME</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
        <TouchableOpacity
          onPress={() => onNavigate('contacts')}
          style={{ flex: 1, backgroundColor: '#191b20', padding: 14, borderRadius: 12 }}
        >
          <HeartIcon color="#f04421" />
          <Text style={{ color: '#fff', fontWeight: '800', marginTop: 12 }}>
            EMERGENCY CONTACTS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('journal')}
          style={{ flex: 1, backgroundColor: '#191b20', padding: 14, borderRadius: 12 }}
        >
          <JournalIcon color="#f04421" />
          <Text style={{ color: '#fff', fontWeight: '800', marginTop: 12 }}>
            FOCUS JOURNAL
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
