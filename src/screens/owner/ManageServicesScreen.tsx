import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ManageServicesScreenProps {
  navigation: any;
}

export interface ServiceItem {
  id: string;
  name: string;
  unit: string;
  unitLabel: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  price: string;
  enabled: boolean;
  description: string;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'water',
    name: 'Nước uống',
    unit: 'chai',
    unitLabel: 'Chai',
    icon: 'water-outline',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    price: '10000',
    enabled: true,
    description: 'Nước suối đóng chai 500ml',
  },
  {
    id: 'ball',
    name: 'Bóng đá',
    unit: 'quả',
    unitLabel: 'Quả',
    icon: 'football-outline',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    price: '50000',
    enabled: true,
    description: 'Bóng đá tiêu chuẩn số 4, số 5',
  },
  {
    id: 'vest',
    name: 'Áo pit (bibs)',
    unit: 'cái',
    unitLabel: 'Cái',
    icon: 'shirt-outline',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
    price: '20000',
    enabled: true,
    description: 'Áo phân biệt đội, nhiều màu sắc',
  },
];

export const ManageServicesScreen = ({ navigation }: ManageServicesScreenProps) => {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string, value: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: value } : s))
    );
  };

  const handlePriceChange = (id: string, value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: numeric } : s))
    );
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, description: value } : s))
    );
  };

  const handleSave = async () => {
    const invalid = services.find((s) => s.enabled && !s.price);
    if (invalid) {
      Alert.alert('Lỗi', `Vui lòng nhập giá cho dịch vụ "${invalid.name}".`);
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    Alert.alert('Thành công', 'Đã lưu cài đặt dịch vụ!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const formatPrice = (value: string) =>
    value ? Number(value).toLocaleString('vi-VN') : '0';

  const enabledCount = services.filter((s) => s.enabled).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quản lý dịch vụ</Text>
          <Text style={styles.headerSub}>{enabledCount}/{services.length} dịch vụ đang bật</Text>
        </View>
        <TouchableOpacity
          style={[styles.saveIconBtn, isSaving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color="#3B82F6" />
        <Text style={styles.infoText}>
          Các dịch vụ này sẽ xuất hiện để người đặt sân lựa chọn thêm khi đặt sân.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {services.map((service, index) => (
          <View key={service.id} style={[styles.serviceCard, !service.enabled && styles.serviceCardDisabled]}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.serviceIconBox, { backgroundColor: service.iconBg }]}>
                <Ionicons name={service.icon as any} size={26} color={service.iconColor} />
              </View>
              <View style={styles.serviceHeaderInfo}>
                <Text style={[styles.serviceName, !service.enabled && styles.textDisabled]}>
                  {service.name}
                </Text>
                <Text style={styles.serviceUnit}>Tính theo {service.unitLabel}</Text>
              </View>
              <Switch
                value={service.enabled}
                onValueChange={(v) => handleToggle(service.id, v)}
                trackColor={{ false: '#E5E7EB', true: service.iconColor + '60' }}
                thumbColor={service.enabled ? service.iconColor : '#9CA3AF'}
              />
            </View>

            {service.enabled && (
              <>
                <View style={styles.divider} />

                {/* Giá */}
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Giá thuê:</Text>
                  <View style={[styles.priceInputBox, { borderColor: service.iconColor + '60' }]}>
                    <TextInput
                      style={[styles.priceInput, { color: service.iconColor }]}
                      value={service.price}
                      onChangeText={(v) => handlePriceChange(service.id, v)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                    />
                    <Text style={styles.priceUnit}>đ/{service.unit}</Text>
                  </View>
                  <View style={[styles.priceFormatBox, { backgroundColor: service.iconBg }]}>
                    <Text style={[styles.priceFormatText, { color: service.iconColor }]}>
                      {formatPrice(service.price)}đ
                    </Text>
                  </View>
                </View>

                {/* Mô tả */}
                <View style={styles.descRow}>
                  <Text style={styles.descLabel}>Mô tả:</Text>
                  <TextInput
                    style={styles.descInput}
                    value={service.description}
                    onChangeText={(v) => handleDescriptionChange(service.id, v)}
                    placeholder="Nhập mô tả dịch vụ..."
                    placeholderTextColor="#D1D5DB"
                    multiline
                  />
                </View>

                {/* Preview */}
                <View style={[styles.previewBox, { borderColor: service.iconColor + '40', backgroundColor: service.iconBg }]}>
                  <Ionicons name="eye-outline" size={14} color={service.iconColor} />
                  <Text style={[styles.previewText, { color: service.iconColor }]}>
                    Hiển thị: {service.name} — {formatPrice(service.price)}đ/{service.unit}
                  </Text>
                </View>
              </>
            )}

            {!service.enabled && (
              <View style={styles.disabledNote}>
                <Ionicons name="close-circle-outline" size={14} color="#9CA3AF" />
                <Text style={styles.disabledNoteText}>Dịch vụ này đang bị tắt, người dùng sẽ không thấy</Text>
              </View>
            )}
          </View>
        ))}

        {/* Nút lưu */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name={isSaving ? 'hourglass-outline' : 'save-outline'} size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{isSaving ? 'Đang lưu...' : 'Lưu cài đặt dịch vụ'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#FEF3C7', marginTop: 2 },
  saveIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#EFF6FF', marginHorizontal: 16, marginTop: 16,
    padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE',
  },
  infoText: { fontSize: 13, color: '#1E40AF', flex: 1, lineHeight: 18 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  serviceCard: {
    backgroundColor: '#fff', borderRadius: 20, marginBottom: 14,
    padding: 18, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07,
    shadowRadius: 8, elevation: 3,
  },
  serviceCardDisabled: { opacity: 0.75 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIconBox: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  serviceHeaderInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  serviceUnit: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  textDisabled: { color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  priceLabel: { fontSize: 13, fontWeight: '600', color: '#374151', width: 70 },
  priceInputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    flex: 1, backgroundColor: '#FAFAFA',
  },
  priceInput: { flex: 1, fontSize: 15, fontWeight: '700', padding: 0 },
  priceUnit: { fontSize: 12, color: '#9CA3AF' },
  priceFormatBox: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  priceFormatText: { fontSize: 13, fontWeight: '700' },
  descRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  descLabel: { fontSize: 13, fontWeight: '600', color: '#374151', width: 70, paddingTop: 4 },
  descInput: {
    flex: 1, fontSize: 13, color: '#4B5563',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#FAFAFA', lineHeight: 18,
  },
  previewBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 10, borderRadius: 10, borderWidth: 1,
  },
  previewText: { fontSize: 12, fontWeight: '600' },
  disabledNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
  },
  disabledNoteText: { fontSize: 12, color: '#9CA3AF' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F59E0B', paddingVertical: 16, borderRadius: 14, gap: 8,
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: '#FCD34D', elevation: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: {
    alignItems: 'center', marginTop: 12, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5,
    borderColor: '#E5E7EB', backgroundColor: '#fff',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
});
