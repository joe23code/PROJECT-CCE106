import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { HeartIcon, ShieldIcon, TargetIcon, TimerIcon } from '../components/icon';

const Pillar = ({ Icon, title, text, theme }) => (
  <View style={{ flex: 1, alignItems: 'center', gap: 9 }}>
    <View style={{ width: 58, height: 58, borderRadius: 18, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}>
      <Icon size={28} color={theme.accent} />
    </View>
    <Text style={{ color: theme.text, fontSize: 10, fontWeight: '900', textAlign: 'center' }}>{title}</Text>
    <Text style={{ color: theme.muted, fontSize: 9, textAlign: 'center', lineHeight: 13 }}>{text}</Text>
  </View>
);

export default function WelcomeScreen({ onStart, theme }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 32, backgroundColor: theme.background }}>
      <Header theme={theme} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: theme.accent, textAlign: 'center', fontWeight: '900', letterSpacing: 2, marginTop: 38 }}>WELCOME TO</Text>
        <Text style={{ color: theme.text, textAlign: 'center', fontSize: 42, fontWeight: '900', fontStyle: 'italic', letterSpacing: 1, marginTop: 4 }}>LOCKED<Text style={{ color: theme.accent }}>IN</Text></Text>
        <View style={{ height: 2, backgroundColor: theme.accent, marginVertical: 20 }} />
        <Text style={{ color: theme.text, textAlign: 'center', fontSize: 17, fontWeight: '900', letterSpacing: 1 }}>FOCUS. <Text style={{ color: theme.accent }}>REST.</Text> DISCONNECT.</Text>
        <View style={{ flexDirection: 'row', marginTop: 35, gap: 8 }}>
          <Pillar theme={theme} Icon={TimerIcon} title="SET YOUR TIMER" text="Choose your commitment." />
          <Pillar theme={theme} Icon={ShieldIcon} title="STAY SAFE" text="Emergency access stays available." />
          <Pillar theme={theme} Icon={TargetIcon} title="STAY COMMITTED" text="Finish what you start." />
        </View>
        <TouchableOpacity onPress={onStart} style={{ backgroundColor: theme.success, minHeight: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 38 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }}>GET STARTED</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: theme.border, marginTop: 30, paddingTop: 20 }}>
          <View style={{ flex: 1, alignItems: 'center' }}><HeartIcon color={theme.accent} /><Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', marginTop: 7 }}>EMERGENCY ACCESS</Text></View>
          <View style={{ flex: 1, alignItems: 'center' }}><TargetIcon color={theme.accent} /><Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', marginTop: 7 }}>TIME-LOCKED FOCUS</Text></View>
        </View>
        <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, textAlign: 'center', marginTop: 28 }}>YOUR PHONE. YOUR RULES.</Text>
      </View>
    </ScrollView>
  );
}
