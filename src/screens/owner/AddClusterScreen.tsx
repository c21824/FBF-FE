import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/CustomInput';
import { Cluster } from './ManageFieldsScreen';

interface AddClusterScreenProps {
  navigation: any;
  route: any;
}

export const AddClusterScreen = ({ navigation, route }: AddClusterScreenProps) => {
  const onAdd: (cluster: Cluster) => void = route.params?.onAdd;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên cụm sân.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ cụm sân.');
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);

    const newCluster: Cluster = {
      id: Date.now().toString(),
      name: name.trim(),
      address: address.trim(),
      fields: [],
    };

    onAdd?.(newCluster);
    Alert.alert('Thành công', `Đã thêm cụm sân "${name.trim()}"!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm cụm sân</Text>
        <TouchableOpacity
          style={[styles.saveIconBtn, isSaving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="business" size={36} color="#F59E0B" />
          </View>
          <Text style={styles.bannerText}>Điền thông tin cụm sân mới</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Tên cụm sân *</Text>
          <CustomInput
            icon="business-outline"
            placeholder="VD: Cụm Sân Thể Thao Quận 1"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Địa chỉ *</Text>
          <CustomInput
            icon="location-outline"
            placeholder="VD: 123 Lê Duẩn, Quận 1, TP.HCM"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.fieldLabel}>Mô tả (không bắt buộc)</Text>
          <CustomInput
            icon="document-text-outline"
            placeholder="Mô tả ngắn về cụm sân..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Lưu */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name={isSaving ? 'hourglass-outline' : 'add-circle-outline'} size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{isSaving ? 'Đang lưu...' : 'Thêm cụm sân'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#F59E0B',
    paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  saveIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1 },
  banner: {
    backgroundColor: '#F59E0B',
    alignItems: 'center', paddingBottom: 28, paddingTop: 8,
  },
  bannerIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  bannerText: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  formCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  fieldLabel: {
    fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 4,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F59E0B', marginHorizontal: 16, marginTop: 20,
    paddingVertical: 16, borderRadius: 14, gap: 8,
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: '#FCD34D', elevation: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: {
    alignItems: 'center', marginHorizontal: 16, marginTop: 12,
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#fff',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
});
