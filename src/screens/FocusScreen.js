import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HeartIcon, LockIcon, ShieldIcon, TimerIcon } from '../components/icon';
import { DEFAULT_TEMPLATES, formatDuration } from '../utils/sessionStats';

const time = s => {
  const total = Math.max(0, Math.round(s || 0));
  return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export default function FocusScreen({
  theme,
  active,
  setActive,
  contacts,
  sessions,
  setSessions,
  templates,
  setTemplates,
  journalEntries,
  setJournalEntries,
}) {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [custom, setCustom] = useState('00:25:00');
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
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('Custom Preset');
  const [completionId, setCompletionId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const safeTemplates = useMemo(() => {
    const source = templates?.length ? templates : DEFAULT_TEMPLATES;
    const seen = new Set();
    return source.filter(template => {
      const nameKey = String(template.name || '').trim().toLowerCase();
      const key = nameKey || template.id || `template-${seen.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [templates]);

  const createSessionRecord = (result, actualSeconds) => {
    if (!startedAt) return null;
    const id = Date.now().toString();
    const record = {
      id,
      startTime: startedAt,
      endTime: new Date().toISOString(),
      startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds: Math.max(0, actualSeconds),
      plannedSeconds,
      duration: formatDuration(actualSeconds),
      purpose: purpose.trim(),
      template: activeTemplate?.name || 'Custom',
      templateId: activeTemplate?.id || null,
      result,
      outcome: result === 'completed' ? 'completed' : 'emergency exit',
      feedback: '',
      emergencyAccessUsed: result === 'emergency_exit',
      templateSettings: activeTemplate?.settings || { safeMode: true, emergencyAccess: true, notifications: false },
      allowedContactIds: activeTemplate?.allowedContactIds || [],
    };
    setSessions(prev => [record, ...prev]);
    setCompletionId(id);
    setFeedback('');
    setReflectionTitle('');
    setReflectionNote('');
    setReflectionSaved(false);
    setStartedAt(null);
    return id;
  };

  useEffect(() => {
    if (!active) return undefined;

    const id = setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          clearInterval(id);
          const actual = plannedSeconds;
          setActive(false);
          setDone(true);
          createSessionRecord('completed', actual);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active]);

  const choose = n => {
    if (active) return;
    setMinutes(n);
    setRemaining(n * 60);
    setPurpose('');
    setActiveTemplate(null);
    setDone(false);
  };

  const chooseTemplate = template => {
    if (active) return;
    setActiveTemplate(template);
    setMinutes(Math.floor(template.seconds / 60));
    setRemaining(template.seconds);
    setPurpose(template.purpose || '');
    setCustom(`${String(Math.floor(template.seconds / 3600)).padStart(2, '0')}:${String(Math.floor((template.seconds % 3600) / 60)).padStart(2, '0')}:${String(template.seconds % 60).padStart(2, '0')}`);
    setDone(false);
  };

  const saveCustom = () => {
    const parts = custom.split(':').map(Number);
    const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
    if (!Number.isInteger(seconds) || seconds <= 0 || seconds > 43200) {
      Alert.alert('Invalid duration', 'Use a duration between 1 second and 12 hours.');
      return;
    }
    setMinutes(Math.floor(seconds / 60));
    setRemaining(seconds);
    setPurpose(customPurpose.trim());
    setDone(false);
    setEditing(false);
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
      setChallengeError('That answer is not correct. Please try again.');
      return;
    }
    setChallengeOpen(false);
    const actual = plannedSeconds - remaining;
    setActive(false);
    setDone(true);
    createSessionRecord('emergency_exit', actual);
  };

  const updateFeedback = value => {
    setFeedback(value);
    if (!completionId) return;
    setSessions(prev => prev.map(s => s.id === completionId ? { ...s, feedback: value } : s));
  };

  const saveReflection = () => {
    if (!completionId) return;
    if (!reflectionTitle.trim() || !reflectionNote.trim()) {
      Alert.alert('Reflection needed', 'Add a title and reflection before saving.');
      return;
    }
    setJournalEntries(prev => [
      {
        id: Date.now().toString(),
        title: reflectionTitle.trim(),
        note: reflectionNote.trim(),
        createdAt: new Date().toISOString(),
        sessionId: completionId,
        sessionPurpose: purpose,
      },
      ...prev,
    ]);
    setReflectionSaved(true);
  };

  const startNext = () => {
    setDone(false);
    setRemaining(0);
    setMinutes(0);
    setPurpose('');
    setActiveTemplate(null);
    setCompletionId(null);
  };

  if (done && !active) {
    const completedRecord = sessions.find(s => s.id === completionId);
    const actual = completedRecord?.durationSeconds ?? (plannedSeconds - remaining);
    return (
      <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1, backgroundColor: theme.background }}>
        <Text style={{ color: theme.success, fontWeight: '900', fontSize: 25, textAlign: 'center' }}>
          SESSION RECORDED
        </Text>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 14 }}>
          {time(actual)} focused
        </Text>
        <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 8 }}>
          {activeTemplate?.name || completedRecord?.template || 'Custom'} · {completedRecord?.purpose || purpose || 'Focused time'}
        </Text>

        <Text style={{ color: theme.text, fontWeight: '900', marginTop: 22 }}>HOW DID THAT SESSION FEEL?</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {['Too easy', 'Just right', 'Too strict'].map(x => (
            <TouchableOpacity
              key={x}
              onPress={() => updateFeedback(x)}
              style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: feedback === x ? theme.accent : theme.surface, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}
            >
              <Text style={{ color: theme.text, fontSize: 10, fontWeight: '800' }}>{x}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ color: theme.text, fontWeight: '900', marginTop: 22 }}>WRITE A REFLECTION</Text>
        <TextInput
          value={reflectionTitle}
          onChangeText={setReflectionTitle}
          placeholder="Reflection title"
          placeholderTextColor={theme.muted}
          style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 10, padding: 13, marginTop: 10 }}
        />
        <TextInput
          value={reflectionNote}
          onChangeText={setReflectionNote}
          multiline
          placeholder="What went well? What would you change?"
          placeholderTextColor={theme.muted}
          style={{ color: theme.text, backgroundColor: theme.input, height: 95, borderColor: theme.border, borderWidth: 1, borderRadius: 10, padding: 13, marginTop: 10, textAlignVertical: 'top' }}
        />
        <TouchableOpacity onPress={saveReflection} style={{ backgroundColor: theme.accent, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '900' }}>{reflectionSaved ? 'REFLECTION SAVED' : 'SAVE REFLECTION'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={startNext} style={{ backgroundColor: theme.accent, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 18 }}>
          <Text style={{ color: '#fff', fontWeight: '900' }}>PLAN NEXT SESSION</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (active) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, padding: 25, justifyContent: 'space-between' }}>
        <View>
          <View style={{ alignItems: 'center', marginTop: 35 }}>
            <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon size={32} />
            </View>
            <Text style={{ color: theme.accent, fontWeight: '900', letterSpacing: 2, marginTop: 18 }}>
              FOCUS SESSION LOCKED
            </Text>
            <Text style={{ color: theme.text, fontSize: 52, fontWeight: '900', marginTop: 12 }}>{time(remaining)}</Text>
            <Text style={{ color: theme.muted, marginTop: 7, textAlign: 'center' }}>
              Stay with your commitment. Navigation is unavailable until your session ends.
            </Text>
            {purpose ? <Text style={{ color: theme.text, marginTop: 14, textAlign: 'center', fontStyle: 'italic', fontSize: 16 }}>“{purpose}”</Text> : null}
          </View>

          <View style={{ marginTop: 34, padding: 17, borderWidth: 1, borderColor: theme.border, borderRadius: 14, backgroundColor: theme.surface }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ShieldIcon color={theme.accent} />
              <Text style={{ color: theme.text, fontWeight: '900' }}>SAFE MODE ACTIVE</Text>
            </View>
            <Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18, marginTop: 8 }}>
              Emergency contacts remain available. This prototype locks navigation inside the app; it cannot block the phone operating system.
            </Text>
          </View>
        </View>

        <TouchableOpacity disabled={activeTemplate?.settings?.emergencyAccess === false} onPress={() => setEmergency(true)} style={{ minHeight: 52, borderRadius: 12, borderWidth: 1, borderColor: theme.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
          <Text style={{ color: theme.accent, fontWeight: '900' }}>EMERGENCY ACCESS</Text>
        </TouchableOpacity>

        <Modal visible={emergency} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', padding: 22 }}>
            <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 21 }}>
              <HeartIcon color={theme.accent} size={30} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900', marginTop: 12 }}>EMERGENCY ACCESS</Text>
              <Text style={{ color: theme.muted, marginTop: 8, lineHeight: 19 }}>Use this only for a genuine emergency. Your focus session will be ended.</Text>
              {(activeTemplate?.allowedContactIds?.length ? contacts.filter(c => activeTemplate.allowedContactIds.includes(c.id)) : contacts).map(c => (
                <View key={c.id} style={{ padding: 12, backgroundColor: theme.surfaceAlt, borderRadius: 9, marginTop: 14 }}>
                  <Text style={{ color: theme.text, fontWeight: '800' }}>{c.name}</Text>
                  <Text style={{ color: theme.muted, marginTop: 3 }}>{c.phone}</Text>
                </View>
              ))}
              <TouchableOpacity onPress={beginExitChallenge} style={{ backgroundColor: theme.accent, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>END SESSION FOR EMERGENCY</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEmergency(false)} style={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ color: theme.muted, fontWeight: '800' }}>RETURN TO FOCUS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={challengeOpen} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', padding: 22 }}>
            <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 21 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}>CONFIRM EMERGENCY EXIT</Text>
              <Text style={{ color: theme.muted, marginTop: 8, lineHeight: 19 }}>Solve this short challenge before ending the session.</Text>
              <Text style={{ color: theme.accent, fontSize: 27, fontWeight: '900', textAlign: 'center', marginVertical: 18 }}>{challenge.left} + {challenge.right} = ?</Text>
              <TextInput value={answer} onChangeText={setAnswer} keyboardType="number-pad" placeholder="Answer" placeholderTextColor={theme.muted} style={{ color: theme.text, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 14, textAlign: 'center' }} />
              {challengeError ? <Text style={{ color: theme.accent, fontSize: 12, marginTop: 10 }}>{challengeError}</Text> : null}
              <TouchableOpacity onPress={finishEmergencyExit} style={{ backgroundColor: theme.accent, minHeight: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>CONFIRM AND END SESSION</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setChallengeOpen(false)} style={{ alignItems: 'center', padding: 15 }}>
                <Text style={{ color: theme.muted, fontWeight: '800' }}>RETURN TO FOCUS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 35, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <TimerIcon size={27} color={theme.accent} />
        <View>
          <Text style={{ color: theme.text, fontSize: 23, fontWeight: '900' }}>FOCUS TIME</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }}>Set a deliberate phone-free period.</Text>
        </View>
      </View>

      <View style={{ width: 250, height: 250, borderRadius: 125, borderWidth: 4, borderColor: theme.accent, alignSelf: 'center', marginVertical: 28, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: done ? theme.success : theme.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>{done ? 'SESSION COMPLETE' : 'READY TO LOCK IN'}</Text>
        <Text style={{ color: theme.text, fontSize: 47, fontWeight: '900', marginTop: 7 }}>{time(remaining)}</Text>
        <Text style={{ color: theme.muted, marginTop: 5 }}>{minutes} minute commitment</Text>
      </View>

      <TouchableOpacity onPress={() => {
        const draft = {
          id: `custom-draft-${Date.now()}`,
          name: '',
          seconds: remaining > 0 ? remaining : 25 * 60,
          purpose: purpose || '',
          allowedContactIds: [],
          settings: { safeMode: true, emergencyAccess: true, notifications: false },
        };
        setActiveTemplate(draft);
        setTemplateName('');
        setCustom(time(draft.seconds));
        setCustomPurpose(draft.purpose);
        setEditing(true);
      }} style={{ alignItems: 'center', paddingVertical: 14, backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.accent, marginBottom: 20 }}>
        <Text style={{ color: theme.accent, fontWeight: '800' }}>CUSTOMIZE FOCUS TIME</Text>
      </TouchableOpacity>

      <Text style={{ color: theme.muted, fontWeight: '800', fontSize: 12, marginBottom: 9 }}>CHOOSE A PRESET</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {[15, 25, 45, 60, 90].map(n => (
          <TouchableOpacity key={n} onPress={() => choose(n)} style={{ flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 10, backgroundColor: minutes === n && !activeTemplate ? theme.accent : theme.surface, borderWidth: 1, borderColor: minutes === n && !activeTemplate ? theme.accent : theme.border }}>
            <Text style={{ color: theme.text, fontWeight: '900' }}>{`${n}m`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: theme.muted, fontWeight: '800', fontSize: 12, marginBottom: 9 }}>SESSION TEMPLATES</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {safeTemplates.map(template => (
          <TouchableOpacity key={template.id} onPress={() => chooseTemplate(template)} style={{ width: '31%', minHeight: 58, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 10, backgroundColor: activeTemplate?.id === template.id ? theme.accent : theme.surface, borderWidth: 1, borderColor: activeTemplate?.id === template.id ? theme.accent : theme.border }}>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 10, textAlign: 'center' }}>{template.name.toUpperCase()}</Text>
            <Text style={{ color: theme.muted, fontSize: 9, marginTop: 3 }}>{formatDuration(template.seconds)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => { if (remaining <= 0) return; setDone(false); setStartedAt(new Date().toISOString()); setPlannedSeconds(remaining); setActive(true); }} style={{ minHeight: 54, borderRadius: 12, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 }}>
        <LockIcon size={21} />
        <Text style={{ color: '#fff', fontWeight: '900', letterSpacing: 1 }}>START AND LOCK SESSION</Text>
      </TouchableOpacity>

      <Modal visible={editing} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
              <Text style={{ color: theme.text, fontWeight: '900', fontSize: 19 }}>{activeTemplate ? 'EDIT SESSION TEMPLATE' : 'EDIT FOCUS TIME'}</Text>
              {activeTemplate?.id?.startsWith('custom-draft-') ? (
                <>
                  <Text style={{ color: theme.muted, fontSize: 12, marginTop: 14 }}>Template name:</Text>
                  <TextInput style={{ color: theme.text, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 14, marginTop: 6 }} placeholder="e.g., Exam Review" placeholderTextColor={theme.muted} value={templateName} onChangeText={setTemplateName} />
                </>
              ) : null}
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 7 }}>Use hour:minute:second, for example 01:30:00.</Text>
              <TextInput style={{ color: theme.text, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 14, marginTop: 15 }} keyboardType="numbers-and-punctuation" value={custom} onChangeText={setCustom} />
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 14 }}>Session purpose:</Text>
              <TextInput style={{ color: theme.text, backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 14, marginTop: 6 }} placeholder="e.g., Deep Work, Reading..." placeholderTextColor={theme.muted} value={customPurpose} onChangeText={setCustomPurpose} />

              <Text style={{ color: theme.text, fontWeight: '900', marginTop: 18 }}>ALLOWED EMERGENCY CONTACTS</Text>
              <Text style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>Choose who appears in Emergency Access for this preset.</Text>
              {contacts.map(contact => {
                const ids = activeTemplate?.allowedContactIds || [];
                const selected = ids.length === 0 ? true : ids.includes(contact.id);
                return (
                  <TouchableOpacity key={contact.id} onPress={() => {
                    const currentIds = ids.length === 0 ? contacts.map(c => c.id) : ids;
                    const next = selected ? currentIds.filter(id => id !== contact.id) : [...currentIds, contact.id];
                    setActiveTemplate(prev => prev ? { ...prev, allowedContactIds: next } : prev);
                  }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                    <Switch value={selected} onValueChange={() => {}} trackColor={{ false: theme.border, true: theme.accent }} />
                    <Text style={{ color: theme.text, marginLeft: 8 }}>{contact.name}</Text>
                  </TouchableOpacity>
                );
              })}

              <Text style={{ color: theme.text, fontWeight: '900', marginTop: 18 }}>SETTINGS</Text>
              {[
                ['Emergency Access available', 'emergencyAccess'],
                ['Safe mode', 'safeMode'],
                ['Session notifications', 'notifications'],
              ].map(([label, key]) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ color: theme.muted }}>{label}</Text>
                  <Switch value={activeTemplate?.settings?.[key] ?? (key !== 'notifications')} onValueChange={value => setActiveTemplate(prev => prev ? { ...prev, settings: { ...prev.settings, [key]: value } } : prev)} trackColor={{ false: theme.border, true: theme.accent }} />
                </View>
              ))}

              <TouchableOpacity onPress={() => {
                const parts = custom.split(':').map(Number);
                const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
                if (!Number.isInteger(seconds) || seconds <= 0 || seconds > 43200) {
                  Alert.alert('Invalid duration', 'Use a duration between 1 second and 12 hours.');
                  return;
                }
                if (activeTemplate?.id?.startsWith('custom-draft-')) {
                  const savedTemplate = { ...activeTemplate, id: `custom-${Date.now()}`, name: templateName.trim() || 'Custom Preset', seconds, purpose: customPurpose.trim() };
                  setTemplates(prev => [...(prev || []), savedTemplate]);
                  setActiveTemplate(savedTemplate);
                }
                saveCustom();
              }} style={{ backgroundColor: theme.accent, borderRadius: 10, alignItems: 'center', padding: 14, marginTop: 18 }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>{activeTemplate?.id?.startsWith('custom-draft-') ? 'SAVE CUSTOM TEMPLATE' : 'SAVE TIME'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)} style={{ alignItems: 'center', padding: 14 }}>
                <Text style={{ color: theme.muted }}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
