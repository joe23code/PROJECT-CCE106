import React, { useState } from 'react';
import { Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HeartIcon, PersonIcon, PhoneIcon } from '../components/icon';

export default function EmergencyContactsScreen({ contacts, setContacts }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  // Open modal for creating a new contact
  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setRelationship('');
    setOpen(true);
  };

  // Open modal pre-filled for editing an existing contact
  const handleOpenEdit = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setOpen(true);
  };

  // Delete a contact directly
  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  // Save changes (both Add and Edit)
  const save = () => {
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      // Update existing contact
      setContacts(
        contacts.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: name.trim(),
                phone: phone.trim(),
                relationship: relationship.trim() || 'Emergency contact',
              }
            : c
        )
      );
    } else {
      // Add new contact
      setContacts([
        ...contacts,
        {
          id: Date.now().toString(),
          name: name.trim(),
          phone: phone.trim(),
          relationship: relationship.trim() || 'Emergency contact',
        },
      ]);
    }

    setName('');
    setPhone('');
    setRelationship('');
    setEditingId(null);
    setOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <HeartIcon size={27} color="#f04a28" />
        <View>
          <Text style={{ color: '#fff', fontSize: 23, fontWeight: '900' }}>EMERGENCY CONTACTS</Text>
          <Text style={{ color: '#a4a7ae', fontSize: 12, marginTop: 3 }}>
            Available when a focus session is active.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 22, padding: 14, backgroundColor: '#21191a', borderLeftWidth: 3, borderLeftColor: '#f04a28', borderRadius: 8 }}>
        <Text style={{ color: '#e5e7eb', fontSize: 12, lineHeight: 18 }}>
          Safety comes first. Your contacts are accessible from the locked focus screen through Emergency Access.
        </Text>
      </View>

      {contacts.map((c) => (
        <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#191b20', borderRadius: 13, borderWidth: 1, borderColor: '#353840', padding: 15, marginTop: 12 }}>
          <View style={{ backgroundColor: '#302025', width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <PersonIcon color="#f04a28" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '900' }}>{c.name}</Text>
            <Text style={{ color: '#9da0a7', fontSize: 12, marginTop: 3 }}>
              {c.relationship}
            </Text>
          </View>

          {/* Action buttons on the right side */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => handleOpenEdit(c)} accessibilityLabel={`Edit ${c.name}`}>
              <Text style={{ color: '#a4a7ae', fontWeight: '700', fontSize: 12 }}>EDIT</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(c.id)} accessibilityLabel={`Delete ${c.name}`}>
              <Text style={{ color: '#f04a28', fontWeight: '700', fontSize: 12 }}>DELETE</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone.replace(/\s/g, '')}`)} accessibilityLabel={`Call ${c.name}`}>
              <PhoneIcon color="#f04a28" size={21} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={handleOpenAdd} style={{ minHeight: 50, marginTop: 20, borderRadius: 12, backgroundColor: '#f04421', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>ADD EMERGENCY CONTACT</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.75)', justifyContent: 'center', padding: 22 }}>
          <View style={{ backgroundColor: '#191b20', borderRadius: 16, padding: 20 }}>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '900', marginBottom: 18 }}>
              {editingId ? 'EDIT CONTACT' : 'ADD CONTACT'}
            </Text>
            
            {[
              ['Full name', name, setName],
              ['Phone number', phone, setPhone],
              ['Relationship', relationship, setRelationship]
            ].map(([p, v, s]) => (
              <TextInput
                key={p}
                style={{ color: '#fff', borderColor: '#41444c', borderWidth: 1, borderRadius: 10, padding: 13, marginBottom: 11 }}
                placeholder={p}
                placeholderTextColor="#858991"
                value={v}
                onChangeText={s}
                keyboardType={p === 'Phone number' ? 'phone-pad' : 'default'}
              />
            ))}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setOpen(false)} style={{ flex: 1, alignItems: 'center', padding: 14 }}>
                <Text style={{ color: '#c7c9cd', fontWeight: '800' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={save} style={{ flex: 1, backgroundColor: '#f04421', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}