import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { HeartIcon, ShieldIcon, TargetIcon, TimerIcon } from '../components/icon';

const Pillar = ({ Icon, title, text }) => (
  <View style={{ flex: 1, alignItems: 'center', gap: 9 }}>
    <View style={{ width: 58, height: 58, borderRadius: 18, borderWidth: 1, borderColor: '#633029', backgroundColor: '#1c1719', justifyContent: 'center', alignItems: 'center' }}>
      <Icon size={28} color="#f04a28" />
    </View>
    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900', textAlign: 'center' }}>{title}</Text>
    <Text style={{ color: '#9da0a7', fontSize: 9, textAlign: 'center', lineHeight: 13 }}>{text}</Text>
  </View>
);

export default function WelcomeScreen({ onStart }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 32 }}>
      <Header />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: '#f04a28', textAlign: 'center', fontWeight: '900', letterSpacing: 2, marginTop: 38 }}>
          WELCOME TO
        </Text>
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 42, fontWeight: '900', fontStyle: 'italic', letterSpacing: 1, marginTop: 4 }}>
          LOCKED<Text style={{ color: '#f04a28' }}>IN</Text>
        </Text>

        <View style={{ height: 2, backgroundColor: '#f04a28', marginVertical: 20 }} />

        <Text style={{ color: '#f3f4f6', textAlign: 'center', fontSize: 17, fontWeight: '900', letterSpacing: 1 }}>
          FOCUS. <Text style={{ color: '#f04a28' }}>REST.</Text> DISCONNECT.
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 35, gap: 8 }}>
          <Pillar Icon={TimerIcon} title="SET YOUR TIMER" text="Choose your commitment." />
          <Pillar Icon={ShieldIcon} title="STAY SAFE" text="Emergency access stays available." />
          <Pillar Icon={TargetIcon} title="STAY COMMITTED" text="Finish what you start." />
        </View>

        <TouchableOpacity onPress={onStart} style={{ backgroundColor: '#20a447', minHeight: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 38 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }}>GET STARTED</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#393a40', marginTop: 30, paddingTop: 20 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <HeartIcon color="#f04a28" />
            <Text style={{ color: '#c5c7cb', fontSize: 10, fontWeight: '800', marginTop: 7 }}>EMERGENCY ACCESS</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TargetIcon color="#f04a28" />
            <Text style={{ color: '#c5c7cb', fontSize: 10, fontWeight: '800', marginTop: 7 }}>TIME-LOCKED FOCUS</Text>
          </View>
        </View>

        <Text style={{ color: '#73767e', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, textAlign: 'center', marginTop: 28 }}>
          YOUR PHONE. YOUR RULES.
        </Text>
      </View>
    </ScrollView>
  );
}