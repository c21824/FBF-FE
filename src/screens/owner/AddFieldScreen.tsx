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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/CustomInput';
import { Field, FieldSlotPrice } from './ManageFieldsScreen';

interface AddFieldScreenProps {
  navigation: any;
  route: any;
}

const TIME_SLOTS = [
  '05:00 - 07:00',
  '07:00 - 09:00',
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00',
  '21:00 - 23:00',
];

const FIELD_TYPES = ['Sân 7', 'Sân 9', 'Sân 11'] as const;

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Sân 7':  { bg: '#ECFDF5', text: '#10B981', border: '#10B981' },
  'Sân 9':  { bg: '#EFF6FF', text: '#3B82F6', border: '#3B82F6' },
  'Sân 11': { bg: '#FFFBEB', text: '#F59E0B', border: '#F59E0B' },
};

// Giá gợi ý mặc định theo loại sân
const DEFAULT_PRICES: Record<string, string[]> = {
  'Sân 7':  ['150.000', '200.000', '200.000', '150.000', '150.000', '250.000', '300.000', '300.000', '250.000'],
  'Sân 9':  ['200.000', '280.000', '280.000', '200.000', '200.000', '350.000', '400.000', '400.000', '350.000'],
  'Sân 11': ['350.000', '450.000', '450.000', '350.000', '350.000', '550.000', '650.000', '650.000', '580.000'],
};

export const AddFieldScreen = ({ navigation, route }: AddFieldScreenProps) => {
  const clusterId: string = route.params?.clusterId;
  const editField: Field | undefined = route.params?.editField;
  const isEdit = !!editField;

  const [name, setName] = useState(editField?.name || '');
  const [selectedType, setSelectedType] = useState<'Sân 7' | 'Sân 9' | 'Sân 11'>(
    editField?.type || 'Sân 7'
  );
  const [slotPrices, setSlotPrices] = useState<FieldSlotPrice[]>(
    editField?.slotPrices ||
      TIME_SLOTS.map((slot, i) => ({ slot, price: DEFAULT_PRICES['Sân 7'][i] }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleTypeChange = (type: 'Sân 7' | 'Sân 9' | 'Sân 11') => {
    setSelectedType(type);
    // Gợi ý giá mặc định khi đổi loại sân
    setSlotPrices(TIME_SLOTS.map((slot, i) => ({
      slot,
      price: DEFAULT_PRICES[type][i],
    })));
  };

  const handlePriceChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    const numeric = value.replace(/[^0-9]/g, '');
    setSlotPrices((prev) =>
      prev.map((sp, i) => (i === index ? { ...sp, price: numeric } : sp))
    );
  };

  const formatPrice = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString('vi-VN');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sân.');
      return;
    }
    const emptySlot = slotPrices.find((sp) => !sp.price);
    if (emptySlot) {
      Alert.alert('Lỗi', `Vui lòng nhập giá cho khung giờ ${emptySlot.slot}.`);
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);

    Alert.alert(
      'Thành công',
      `Đã ${isEdit ? 'cập nhật' : 'thêm'} sân "${name.trim()}" thành công!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const totalRevenue = slotPrices.reduce((sum, sp) => sum + (Number(sp.price) || 0), 0);

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
        <Text style={styles.headerTitle}>{isEdit ? 'Chỉnh sửa sân' : 'Thêm sân mới'}</Text>
        <TouchableOpacity
          style={[styles.saveIconBtn, isSaving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Thông tin cơ bản */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="football-outline" size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Thông tin sân</Text>
          </View>

          <Text style={styles.fieldLabel}>Tên sân *</Text>
          <CustomInput
            icon="football-outline"
            placeholder="VD: Sân A, Sân VIP 1..."
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Loại sân *</Text>
          <View style={styles.typeRow}>
            {FIELD_TYPES.map((type) => {
              const colors = TYPE_COLORS[type];
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    { borderColor: colors.border },
                    isSelected && { backgroundColor: colors.bg },
                  ]}
                  onPress={() => handleTypeChange(type)}
                >
                  <Text style={[styles.typeChipText, { color: isSelected ? colors.text : '#9CA3AF' }]}>
                    {type}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.text} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Setup giá khung giờ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Giá theo khung giờ</Text>
            <View style={styles.hintBadge}>
              <Text style={styles.hintText}>đơn vị: VNĐ/2 giờ</Text>
            </View>
          </View>

          {/* Tổng dự kiến */}
          <View style={styles.revenueRow}>
            <Ionicons name="cash-outline" size={16} color="#10B981" />
            <Text style={styles.revenueLabel}>Tổng giá tất cả khung:</Text>
            <Text style={styles.revenueValue}>
              {totalRevenue.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {slotPrices.map((sp, index) => {
            const isPeakHour =
              sp.slot === '17:00 - 19:00' || sp.slot === '19:00 - 21:00';
            const isEarlyMorning = sp.slot === '05:00 - 07:00';

            return (
              <View key={sp.slot} style={styles.slotRow}>
                <View style={styles.slotTimeBox}>
                  <Text style={styles.slotTime}>{sp.slot}</Text>
                  {isPeakHour && (
                    <View style={styles.peakBadge}>
                      <Text style={styles.peakText}>Giờ vàng</Text>
                    </View>
                  )}
                  {isEarlyMorning && (
                    <View style={styles.earlyBadge}>
                      <Text style={styles.earlyText}>Sáng sớm</Text>
                    </View>
                  )}
                </View>
                <View style={styles.priceInputBox}>
                  <TextInput
                    style={[styles.priceInput, isPeakHour && styles.priceInputPeak]}
                    value={sp.price}
                    onChangeText={(v) => handlePriceChange(index, v)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#D1D5DB"
                  />
                  <Text style={styles.priceUnit}>đ</Text>
                </View>
                <Text style={styles.priceFormatted}>
                  {sp.price ? `${formatPrice(sp.price)}đ` : '-'}
                </Text>
              </View>
            );
          })}

          <View style={styles.noteRow}>
            <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
            <Text style={styles.noteText}>
              Giá đã được gợi ý mặc định theo loại sân. Bạn có thể điều chỉnh từng khung giờ.
            </Text>
          </View>
        </View>

        {/* Nút lưu */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name={isSaving ? 'hourglass-outline' : 'save-outline'} size={20} color="#fff" />
          <Text style={styles.saveBtnText}>
            {isSaving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Thêm sân'}
          </Text>
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
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1 },
  hintBadge: {
    backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, borderWidth: 1, borderColor: '#FDE68A',
  },
  hintText: { fontSize: 10, color: '#92400E', fontWeight: '600' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 4 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5,
    borderColor: '#E5E7EB', backgroundColor: '#fff',
  },
  typeChipText: { fontSize: 14, fontWeight: '700' },
  revenueRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ECFDF5', padding: 12, borderRadius: 10, marginBottom: 16,
  },
  revenueLabel: { fontSize: 13, color: '#6B7280', flex: 1 },
  revenueValue: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  slotRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  slotTimeBox: { width: 120, gap: 4 },
  slotTime: { fontSize: 13, fontWeight: '600', color: '#374151' },
  peakBadge: {
    backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  peakText: { fontSize: 10, color: '#92400E', fontWeight: '700' },
  earlyBadge: {
    backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  earlyText: { fontSize: 10, color: '#1D4ED8', fontWeight: '700' },
  priceInputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6, width: 110, backgroundColor: '#FAFAFA',
  },
  priceInput: {
    flex: 1, fontSize: 14, fontWeight: '600', color: '#1F2937',
    padding: 0,
  },
  priceInputPeak: { color: '#92400E' },
  priceUnit: { fontSize: 12, color: '#9CA3AF' },
  priceFormatted: { fontSize: 12, color: '#6B7280', flex: 1, textAlign: 'right' },
  noteRow: {
    flexDirection: 'row', gap: 6, marginTop: 12,
    backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10,
  },
  noteText: { fontSize: 12, color: '#9CA3AF', flex: 1, lineHeight: 18 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F59E0B', marginBottom: 0, paddingVertical: 16,
    borderRadius: 14, gap: 8,
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: '#FCD34D', elevation: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: {
    alignItems: 'center', marginTop: 12,
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#fff',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
});
