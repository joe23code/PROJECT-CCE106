import React, { useState } from 'react';
import { Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HeartIcon, PersonIcon, PhoneIcon } from '../components/icon';

export default function EmergencyContactsScreen({ theme, contacts, setContacts }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleOpenAdd = () => { setEditingId(null); setName(''); setPhone(''); setRelationship(''); setOpen(true); };
  const handleOpenEdit = contact => { setEditingId(contact.id); setName(contact.name); setPhone(contact.phone); setRelationship(contact.relationship); setOpen(true); };
  const handleDelete = id => setContacts(contacts.filter(c => c.id !== id));

  const save = () => {
    if (!name.trim() || !phone.trim()) return;
    if (editingId) {
      setContacts(contacts.map(c => c.id === editingId ? { ...c, name: name.trim(), phone: phone.trim(), relationship: relationship.trim() || 'Emergency contact' } : c));
    } else {
      setContacts([...contacts, { id: Date.now().toString(), name: name.trim(), phone: phone.trim(), relationship: relationship.trim() || 'Emergency contact' }]);
    }
    setOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <HeartIcon size={27} color={theme.accent} />
        <View>
          <Text style={{ color: theme.text, fontSize: 23, fontWeight: '900' }}>EMERGENCY CONTACTS</Text>
          <Text style={{ color: theme.muted, fontSize: 12, marginTop: 3 }}>Available when a focus session is active.</Text>
        </View>
      </View>
      <View style={{ marginTop: 22, padding: 14, backgroundColor: theme.surfaceAlt, borderLeftWidth: 3, borderLeftColor: theme.accent, borderRadius: 8 }}>
        <Text style={{ color: theme.text, fontSize: 12, lineHeight: 18 }}>Safety comes first. Your contacts are accessible from the locked focus screen through Emergency Access.</Text>
      </View>
      {contacts.map(c => (
        <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 13, borderWidth: 1, borderColor: theme.border, padding: 15, marginTop: 12 }}>
          <View style={{ backgroundColor: theme.surfaceAlt, width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}><PersonIcon color={theme.accent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: '900' }}>{c.name}</Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 3 }}>{c.relationship}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => handleOpenEdit(c)}><Text style={{ color: theme.muted, fontWeight: '700', fontSize: 12 }}>EDIT</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(c.id)}><Text style={{ color: theme.accent, fontWeight: '700', fontSize: 12 }}>DELETE</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone.replace(/\s/g, '')}`)}><PhoneIcon color={theme.accent} size={21} /></TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={handleOpenAdd} style={{ minHeight: 50, marginTop: 20, borderRadius: 12, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>ADD EMERGENCY CONTACT</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 20 }}>
            <Text style={{ color: theme.text, fontSize: 19, fontWeight: '900', marginBottom: 18 }}>{editingId ? 'EDIT CONTACT' : 'ADD CONTACT'}</Text>
            {[['Full name', name, setName], ['Phone number', phone, setPhone], ['Relationship', relationship, setRelationship]].map(([p, v, s]) => (
              <TextInput key={p} style={{ color: theme.text, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }} placeholder={p} placeholderTextColor={theme.muted} value={v} onChangeText={s} keyboardType={p === 'Phone number' ? 'phone-pad' : 'default'} />
            ))}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setOpen(false)} style={{ flex: 1, alignItems: 'center', padding: 14 }}><Text style={{ color: theme.muted, fontWeight: '800' }}>CANCEL</Text></TouchableOpacity>
              <TouchableOpacity onPress={save} style={{ flex: 1, backgroundColor: theme.accent, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontWeight: '900' }}>SAVE</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
