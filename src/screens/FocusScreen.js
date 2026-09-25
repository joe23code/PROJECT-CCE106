import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HeartIcon, LockIcon, ShieldIcon, TimerIcon } from '../components/icon';

const time = s =>
  `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(
    Math.floor((s % 3600) / 60)
  ).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function FocusScreen({ active, setActive, contacts, sessions, setSessions }) {
  // Timer setup, session purpose, lock state, and saved-session metadata.
  const [minutes, setMinutes] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [custom, setCustom] = useState('00:00:00');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [editing, setEditing] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [challenge, setChallenge] = useState({ left: 0, right: 0 });
  const [answer, setAnswer] = useState('');
  const [challengeError, setChallengeError] = useState('');
  const [done, setDone] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [plannedSeconds, setPlannedSeconds] = useState(0);
  const [feedback, setFeedback] = useState('');

  const saveSession = outcome => {
    if (!startedAt) return;
    setSessions([
      {
        id: Date.now().toString(),
        startedAt,
        endedAt: new Date().toISOString(),
        seconds: plannedSeconds - remaining,
        plannedSeconds,
        purpose,
        outcome,
        feedback
      },
      ...sessions
    ]);
    setStartedAt(null);
  };

  // Countdown engine: records a session when its duration reaches zero.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining(v => {
        if (v <= 1) {
          clearInterval(id);
          setActive(false);
          setDone(true);
          saveSession('completed');
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, setActive, remaining]);

  const choose = n => {
    if (!active) {
      setMinutes(n);
      setRemaining(n * 60);
      setDone(false);
    }
  };

  const save = () => {
    const parts = custom.split(':').map(Number);
    const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
    if (Number.isInteger(seconds) && seconds > 0 && seconds <= 43200) {
      setMinutes(Math.floor(seconds / 60));
      setRemaining(seconds);
      setPurpose(customPurpose);
      setDone(false);
      setEditing(false);
    }
  };

  const beginExitChallenge = () => {
    setChallenge({
      left: Math.floor(Math.random() * 8) + 2,
      right: Math.floor(Math.random() * 8) + 2
    });
    setAnswer('');
    setChallengeError('');
    setEmergency(false);
    setChallengeOpen(true);
  };

  const finishEmergencyExit = () => {
    if (Number(answer) !== challenge.left + challenge.right) {
      return setChallengeError('That answer is not correct. Please try again.');
    }
    setChallengeOpen(false);
    saveSession('emergency exit');
    setActive(false);
    setDone(true);
  };

  if (done && !active) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}>
        <Text style={{ color: '#4fd47b', fontWeight: '900', fontSize: 25, textAlign: 'center' }}>
          SESSION RECORDED
        </Text>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 14 }}>
          {time(plannedSeconds - remaining)} focused
        </Text>
        <Text style={{ color: '#a5a7ad', textAlign: 'center', marginTop: 8 }}>
          How did that session feel?
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
          {['Too easy', 'Just right', 'Too strict'].map(x => (
            <TouchableOpacity
              key={x}
              onPress={() => setFeedback(x)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                backgroundColor: feedback === x ? '#f04421' : '#191b20',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{x}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            setDone(false);
            setRemaining(0);
          }}
          style={{ backgroundColor: '#f04421', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 22 }}
        >
          <Text style={{ color: '#fff', fontWeight: '900' }}>PLAN NEXT SESSION</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (active) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0d0e11', padding: 25, justifyContent: 'space-between' }}>
        <View>
          <View style={{ alignItems: 'center', marginTop: 35 }}>
            <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: '#f04421', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon size={32} />
            </View>
            <Text style={{ color: '#f04a28', fontWeight: '900', letterSpacing: 2, marginTop: 18 }}>
              FOCUS SESSION LOCKED
            </Text>
            <Text style={{ color: '#fff', fontSize: 52, fontWeight: '900', marginTop: 12 }}>
              {time(remaining)}
            </Text>
            <Text style={{ color: '#a5a7ad', marginTop: 7, textAlign: 'center' }}>
              Stay with your commitment. Navigation is unavailable until your session ends.
            </Text>
            {purpose ? (
              <Text style={{ color: '#f8fafc', marginTop: 14, textAlign: 'center', fontStyle: 'italic', fontSize: 16 }}>
                “{purpose}”
              </Text>
            ) : null}
          </View>

          <View style={{ marginTop: 34, padding: 17, borderWidth: 1, borderColor: '#3b3031', borderRadius: 14, backgroundColor: '#17181c' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ShieldIcon color="#f04a28" />
              <Text style={{ color: '#fff', fontWeight: '900' }}>SAFE MODE ACTIVE</Text>
            </View>
            <Text style={{ color: '#a5a7ad', fontSize: 12, lineHeight: 18, marginTop: 8 }}>
              Emergency contacts remain available. This prototype locks navigation inside the app; it cannot block the phone operating system.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setEmergency(true)}
          style={{ minHeight: 52, borderRadius: 12, borderWidth: 1, borderColor: '#f04a28', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}
        >
          <Text style={{ color: '#f47057', fontWeight: '900' }}>EMERGENCY ACCESS</Text>
        </TouchableOpacity>

        <Modal visible={emergency} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', padding: 22 }}>
            <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 21 }}>
              <HeartIcon color="#f04a28" size={30} />
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 12 }}>
                EMERGENCY ACCESS
              </Text>
              <Text style={{ color: '#b1b3b9', marginTop: 8, lineHeight: 19 }}>
                Use this only for a genuine emergency. Your focus session will be ended.
              </Text>

              {contacts.map(c => (
                <View key={c.id} style={{ padding: 12, backgroundColor: '#24262c', borderRadius: 9, marginTop: 14 }}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>{c.name}</Text>
                  <Text style={{ color: '#b1b3b9', marginTop: 3 }}>{c.phone}</Text>
                </View>
              ))}

              <TouchableOpacity
                onPress={beginExitChallenge}
                style={{ backgroundColor: '#f04421', minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 18 }}
              >
                <Text style={{ color: '#fff', fontWeight: '900' }}>END SESSION FOR EMERGENCY</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setEmergency(false)} style={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ color: '#c5c8cc', fontWeight: '800' }}>RETURN TO FOCUS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={challengeOpen} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', padding: 22 }}>
            <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 21 }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                CONFIRM EMERGENCY EXIT
              </Text>
              <Text style={{ color: '#b1b3b9', marginTop: 8, lineHeight: 19 }}>
                Solve this short challenge before ending the session.
              </Text>
              <Text style={{ color: '#f47057', fontSize: 27, fontWeight: '900', textAlign: 'center', marginVertical: 18 }}>
                {challenge.left} + {challenge.right} = ?
              </Text>
              <TextInput
                value={answer}
                onChangeText={setAnswer}
                keyboardType="number-pad"
                placeholder="Answer"
                placeholderTextColor="#858991"
                style={{ color: '#fff', borderWidth: 1, borderColor: '#484b53', borderRadius: 10, padding: 14, textAlign: 'center' }}
              />
              {challengeError ? (
                <Text style={{ color: '#ff735d', fontSize: 12, marginTop: 10 }}>{challengeError}</Text>
              ) : null}
              <TouchableOpacity
                onPress={finishEmergencyExit}
                style={{ backgroundColor: '#f04421', minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 14 }}
              >
                <Text style={{ color: '#fff', fontWeight: '900' }}>CONFIRM AND END SESSION</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setChallengeOpen(false)} style={{ alignItems: 'center', padding: 15 }}>
                <Text style={{ color: '#c5c8cc', fontWeight: '800' }}>RETURN TO FOCUS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 35 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <TimerIcon size={27} color="#f04421" />
        <View>
          <Text style={{ color: '#fff', fontSize: 23, fontWeight: '900' }}>FOCUS TIME</Text>
          <Text style={{ color: '#9da0a7', fontSize: 12 }}>Set a deliberate phone-free period.</Text>
        </View>
      </View>

      <View style={{ width: 250, height: 250, borderRadius: 125, borderWidth: 4, borderColor: '#f04421', alignSelf: 'center', marginVertical: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: done ? '#41c966' : '#f47057', fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>
          {done ? 'SESSION COMPLETE' : 'READY TO LOCK IN'}
        </Text>
        <Text style={{ color: '#fff', fontSize: 47, fontWeight: '900', marginTop: 7 }}>
          {time(remaining)}
        </Text>
        <Text style={{ color: '#a5a7ad', marginTop: 5 }}>{minutes} minute commitment</Text>
      </View>

      {/* CUSTOM FOCUS TIME BUTTON */}
      <TouchableOpacity
        onPress={() => {
          setCustom(time(remaining));
          setCustomPurpose(purpose);
          setEditing(true);
        }}
        style={{
          alignItems: 'center',
          paddingVertical: 14,
          backgroundColor: '#1b1d22',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#f04421',
          marginBottom: 20
        }}
      >
        <Text style={{ color: '#f47057', fontWeight: '800' }}>CUSTOMIZE FOCUS TIME</Text>
      </TouchableOpacity>

      <Text style={{ color: '#b9bbc0', fontWeight: '800', fontSize: 12, marginBottom: 9 }}>
        CHOOSE A PRESET
      </Text>

      {/* PRESETS LIST */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {[15, 25, 45, 60, 90].map(n => (
          <TouchableOpacity
            key={n}
            onPress={() => choose(n)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 13,
              borderRadius: 10,
              backgroundColor: minutes === n ? '#f04421' : '#1b1d22',
              borderWidth: 1,
              borderColor: minutes === n ? '#f04421' : '#393c43'
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900' }}>
              {`${n}m`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => {
          if (remaining <= 0) return;
          setDone(false);
          setStartedAt(new Date().toISOString());
          setPlannedSeconds(remaining);
          setActive(true);
        }}
        style={{ minHeight: 54, borderRadius: 12, backgroundColor: '#f04421', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 }}
      >
        <LockIcon size={21} />
        <Text style={{ color: '#fff', fontWeight: '900', letterSpacing: 1 }}>
          START AND LOCK SESSION
        </Text>
      </TouchableOpacity>

      {/* CUSTOMIZE MODAL */}
      <Modal visible={editing} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 19 }}>
              EDIT FOCUS TIME
            </Text>
            <Text style={{ color: '#a5a7ad', fontSize: 12, marginTop: 7 }}>
              Use hour:minute:second, for example 01:30:00.
            </Text>

            <TextInput
              style={{ color: '#fff', borderWidth: 1, borderColor: '#484b53', borderRadius: 10, padding: 14, marginTop: 15 }}
              keyboardType="numbers-and-punctuation"
              value={custom}
              onChangeText={setCustom}
            />

            <Text style={{ color: '#a5a7ad', fontSize: 12, marginTop: 14 }}>
              Session reason (optional):
            </Text>

            <TextInput
              style={{ color: '#fff', borderWidth: 1, borderColor: '#484b53', borderRadius: 10, padding: 14, marginTop: 6 }}
              placeholder="e.g., Deep Work, Reading..."
              placeholderTextColor="#858991"
              value={customPurpose}
              onChangeText={setCustomPurpose}
            />

            <TouchableOpacity
              onPress={save}
              style={{ backgroundColor: '#f04421', borderRadius: 10, alignItems: 'center', padding: 14, marginTop: 18 }}
            >
              <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE TIME</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEditing(false)} style={{ alignItems: 'center', padding: 14 }}>
              <Text style={{ color: '#c5c8cc' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
