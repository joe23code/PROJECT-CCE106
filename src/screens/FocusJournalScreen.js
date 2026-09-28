import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { JournalIcon } from '../components/icon';

const periodKey = (date, mode) => {
  const d = new Date(date);
  if (mode === 'Month') return `${d.getFullYear()}-${d.getMonth() + 1}`;
  if (mode === 'Year') return String(d.getFullYear());
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
};

export default function FocusJournalScreen({ theme, entries, setEntries }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('Week');
  const [selected, setSelected] = useState('Current');

  const groups = useMemo(() => [...new Set(entries.map(e => periodKey(e.createdAt, mode)))], [entries, mode]);
  const current = periodKey(new Date(), mode);
  const target = selected === 'Current' ? current : selected;
  const visible = entries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) && periodKey(e.createdAt, mode) === target);

  const save = () => {
    if (!title.trim() || !note.trim()) return;
    setEntries([{ id: Date.now().toString(), title: title.trim(), note: note.trim(), createdAt: new Date().toISOString(), sessionId: null }, ...entries]);
    setTitle('');
    setNote('');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 35, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <JournalIcon size={27} color={theme.accent} />
        <View>
          <Text style={{ color: theme.text, fontSize: 23, fontWeight: '900' }}>FOCUS JOURNAL</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }}>Calendar-organized reflections.</Text>
        </View>
      </View>

      <Text style={{ color: theme.text, fontWeight: '900', marginTop: 22 }}>NEW REFLECTION</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Reflection title" placeholderTextColor={theme.muted} style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10 }} />
      <TextInput value={note} onChangeText={setNote} multiline placeholder="How was your focus today?" placeholderTextColor={theme.muted} style={{ height: 110, color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10, textAlignVertical: 'top' }} />
      <TouchableOpacity onPress={save} style={{ backgroundColor: theme.accent, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE REFLECTION</Text>
      </TouchableOpacity>

      <Text style={{ color: theme.text, fontWeight: '900', marginTop: 28 }}>REFLECTION HISTORY</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
        {['Week', 'Month', 'Year'].map(m => (
          <TouchableOpacity key={m} onPress={() => { setMode(m); setSelected('Current'); }} style={{ flex: 1, backgroundColor: mode === m ? theme.accent : theme.surface, padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ color: theme.text, fontSize: 10, fontWeight: '800' }}>{m.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput value={search} onChangeText={setSearch} placeholder="Search reflection title" placeholderTextColor={theme.muted} style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10 }} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        <TouchableOpacity onPress={() => setSelected('Current')} style={{ padding: 9, backgroundColor: selected === 'Current' ? theme.accent : theme.surface, borderRadius: 8, marginRight: 7 }}>
          <Text style={{ color: theme.text, fontSize: 10 }}>CURRENT</Text>
        </TouchableOpacity>
        {groups.map(g => (
          <TouchableOpacity key={g} onPress={() => setSelected(g)} style={{ padding: 9, backgroundColor: selected === g ? theme.accent : theme.surface, borderRadius: 8, marginRight: 7 }}>
            <Text style={{ color: theme.text, fontSize: 10 }}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ backgroundColor: theme.surfaceAlt, padding: 12, borderRadius: 10, marginTop: 12 }}>
        <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '900' }}>{mode.toUpperCase()} SUMMARY</Text>
        <Text style={{ color: theme.text, marginTop: 5 }}>{visible.length} reflection{visible.length === 1 ? '' : 's'} in this period.</Text>
      </View>

      {visible.map(e => (
        <View key={e.id} style={{ marginTop: 10, padding: 13, backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.text, fontWeight: '900' }}>{e.title}</Text>
          {e.sessionId ? <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '800', marginTop: 4 }}>LINKED TO FOCUS SESSION</Text> : null}
          <Text style={{ color: theme.text, marginTop: 6 }}>{e.note}</Text>
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 8 }}>{new Date(e.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
