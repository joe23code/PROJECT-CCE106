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

export default function FocusJournalScreen({ entries, setEntries }) {
  // Reflection editor and automatic calendar-based history filters.
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('Week');
  const [selected, setSelected] = useState('Current');

  const groups = useMemo(
    () => [...new Set(entries.map(e => periodKey(e.createdAt, mode)))],
    [entries, mode]
  );

  const current = periodKey(new Date(), mode);
  const target = selected === 'Current' ? current : selected;

  const visible = entries.filter(
    e => e.title.toLowerCase().includes(search.toLowerCase()) && periodKey(e.createdAt, mode) === target
  );

  const save = () => {
    if (!title.trim() || !note.trim()) return;
    setEntries([
      {
        id: Date.now().toString(),
        title: title.trim(),
        note: note.trim(),
        createdAt: new Date().toISOString()
      },
      ...entries
    ]);
    setTitle('');
    setNote('');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 35 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <JournalIcon size={27} color="#f04421" />
        <View>
          <Text style={{ color: '#fff', fontSize: 23, fontWeight: '900' }}>FOCUS JOURNAL</Text>
          <Text style={{ color: '#a4a7ae', fontSize: 12 }}>Calendar-organized reflections.</Text>
        </View>
      </View>

      <Text style={{ color: '#fff', fontWeight: '900', marginTop: 22 }}>NEW REFLECTION</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Reflection title"
        placeholderTextColor="#858991"
        style={{ color: '#fff', borderColor: '#3c3f46', borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10 }}
      />

      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        placeholder="How was your focus today?"
        placeholderTextColor="#858991"
        style={{ height: 110, color: '#fff', borderColor: '#3c3f46', borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10, textAlignVertical: 'top' }}
      />

      <TouchableOpacity onPress={save} style={{ backgroundColor: '#f04421', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE REFLECTION</Text>
      </TouchableOpacity>

      <Text style={{ color: '#fff', fontWeight: '900', marginTop: 28 }}>REFLECTION HISTORY</Text>

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
        {['Week', 'Month', 'Year'].map(m => (
          <TouchableOpacity
            key={m}
            onPress={() => {
              setMode(m);
              setSelected('Current');
            }}
            style={{ flex: 1, backgroundColor: mode === m ? '#f04421' : '#191b20', padding: 10, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{m.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search reflection title"
        placeholderTextColor="#858991"
        style={{ color: '#fff', borderColor: '#3c3f46', borderWidth: 1, borderRadius: 12, padding: 13, marginTop: 10 }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => setSelected('Current')}
          style={{ padding: 9, backgroundColor: selected === 'Current' ? '#f04421' : '#272930', borderRadius: 8, marginRight: 7 }}
        >
          <Text style={{ color: '#fff', fontSize: 10 }}>CURRENT</Text>
        </TouchableOpacity>

        {groups.map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setSelected(g)}
            style={{ padding: 9, backgroundColor: selected === g ? '#f04421' : '#272930', borderRadius: 8, marginRight: 7 }}
          >
            <Text style={{ color: '#fff', fontSize: 10 }}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ backgroundColor: '#21191a', padding: 12, borderRadius: 10, marginTop: 12 }}>
        <Text style={{ color: '#f47057', fontSize: 10, fontWeight: '900' }}>{mode.toUpperCase()} SUMMARY</Text>
        <Text style={{ color: '#fff', marginTop: 5 }}>
          {visible.length} reflection{visible.length === 1 ? '' : 's'} in this period.
        </Text>
      </View>

      {visible.map(e => (
        <View key={e.id} style={{ marginTop: 10, padding: 13, backgroundColor: '#191b20', borderRadius: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '900' }}>{e.title}</Text>
          <Text style={{ color: '#d4d5d8', marginTop: 6 }}>{e.note}</Text>
          <Text style={{ color: '#92959c', fontSize: 10, marginTop: 8 }}>{new Date(e.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
