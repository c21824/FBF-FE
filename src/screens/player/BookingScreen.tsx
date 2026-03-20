import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FieldData } from '../../components/FieldCard';

interface BookingScreenProps {
  navigation: any;
  route: any;
}

interface SlotPrice {
  slot: string;
  price: number;
}

interface ServiceOrder {
  id: string;
  name: string;
  unit: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  pricePerUnit: number;
  quantity: number;
}

// Giá theo khung giờ mock (thực tế sẽ lấy từ API)
const SLOT_PRICES: SlotPrice[] = [
  { slot: '05:00 - 07:00', price: 200000 },
  { slot: '07:00 - 09:00', price: 250000 },
  { slot: '09:00 - 11:00', price: 250000 },
  { slot: '11:00 - 13:00', price: 200000 },
  { slot: '13:00 - 15:00', price: 200000 },
  { slot: '15:00 - 17:00', price: 280000 },
  { slot: '17:00 - 19:00', price: 350000 },
  { slot: '19:00 - 21:00', price: 350000 },
  { slot: '21:00 - 23:00', price: 300000 },
];

// Dịch vụ đi kèm (thực tế sẽ lấy từ API của chủ sân)
const AVAILABLE_SERVICES: Omit<ServiceOrder, 'quantity'>[] = [
  {
    id: 'water',
    name: 'Nước uống',
    unit: 'chai',
    icon: 'water-outline',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    pricePerUnit: 10000,
  },
  {
    id: 'ball',
    name: 'Bóng đá',
    unit: 'quả',
    icon: 'football-outline',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    pricePerUnit: 50000,
  },
  {
    id: 'vest',
    name: 'Áo pit (bibs)',
    unit: 'cái',
    icon: 'shirt-outline',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
    pricePerUnit: 20000,
  },
];

const TYPE_COLORS: Record<string, string> = {
  'Sân 7': '#10B981',
  'Sân 9': '#3B82F6',
  'Sân 11': '#F59E0B',
};

export const BookingScreen = ({ navigation, route }: BookingScreenProps) => {
  const field: FieldData = route.params?.field;
  const clusterName: string = route.params?.clusterName || '';

  const [selectedSlot, setSelectedSlot] = useState<SlotPrice | null>(null);
  const [services, setServices] = useState<ServiceOrder[]>(
    AVAILABLE_SERVICES.map((s) => ({ ...s, quantity: 0 }))
  );

  const updateQuantity = (id: string, delta: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
      )
    );
  };

  const fieldPrice = selectedSlot?.price || 0;
  const serviceTotal = services.reduce((sum, s) => sum + s.pricePerUnit * s.quantity, 0);
  const total = fieldPrice + serviceTotal;

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert('Chưa chọn khung giờ', 'Vui lòng chọn khung giờ muốn đặt sân.');
      return;
    }

    navigation.navigate('Payment', {
      field,
      clusterName,
      selectedSlot,
      services,
      total,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt sân</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Thông tin sân */}
        <View style={styles.fieldInfoCard}>
          <View style={styles.fieldInfoRow}>
            <View style={[styles.typeTag, { backgroundColor: TYPE_COLORS[field?.type] + '20' }]}>
              <Text style={[styles.typeTagText, { color: TYPE_COLORS[field?.type] }]}>
                {field?.type}
              </Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{field?.rating}</Text>
            </View>
          </View>
          <Text style={styles.fieldName}>{field?.name}</Text>
          {clusterName ? (
            <View style={styles.clusterRow}>
              <Ionicons name="business-outline" size={14} color="#10B981" />
              <Text style={styles.clusterText}>{clusterName}</Text>
            </View>
          ) : null}
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.addressText}>{field?.address}</Text>
          </View>
        </View>

        {/* Chọn khung giờ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color="#10B981" />
            <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
            <Text style={styles.sectionNote}>2 tiếng/khung</Text>
          </View>

          <View style={styles.slotsGrid}>
            {SLOT_PRICES.map((sp) => {
              const isSelected = selectedSlot?.slot === sp.slot;
              const isPeak = sp.slot === '17:00 - 19:00' || sp.slot === '19:00 - 21:00';
              return (
                <TouchableOpacity
                  key={sp.slot}
                  style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                  onPress={() => setSelectedSlot(isSelected ? null : sp)}
                >
                  <Text style={[styles.slotTime, isSelected && styles.slotTimeSelected]}>
                    {sp.slot}
                  </Text>
                  <Text style={[styles.slotPrice, isSelected && styles.slotPriceSelected]}>
                    {sp.price.toLocaleString('vi-VN')}đ
                  </Text>
                  {isPeak && (
                    <View style={[styles.peakDot, isSelected && styles.peakDotSelected]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Giờ vàng (giá cao hơn)</Text>
          </View>
        </View>

        {/* Dịch vụ đi kèm */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bag-handle-outline" size={18} color="#10B981" />
            <Text style={styles.sectionTitle}>Dịch vụ thuê kèm</Text>
            <Text style={styles.sectionNote}>Không bắt buộc</Text>
          </View>

          {services.map((service) => (
            <View key={service.id} style={styles.serviceRow}>
              <View style={[styles.serviceIcon, { backgroundColor: service.iconBg }]}>
                <Ionicons name={service.icon as any} size={22} color={service.iconColor} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={[styles.servicePrice, { color: service.iconColor }]}>
                  {service.pricePerUnit.toLocaleString('vi-VN')}đ/{service.unit}
                </Text>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[styles.qtyBtn, service.quantity === 0 && styles.qtyBtnDisabled]}
                  onPress={() => updateQuantity(service.id, -1)}
                  disabled={service.quantity === 0}
                >
                  <Ionicons name="remove" size={16} color={service.quantity === 0 ? '#D1D5DB' : '#1F2937'} />
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{service.quantity}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnAdd, { backgroundColor: service.iconColor }]}
                  onPress={() => updateQuantity(service.id, 1)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.serviceSubtotal, { color: service.quantity > 0 ? service.iconColor : 'transparent' }]}>
                {(service.pricePerUnit * service.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Tổng chi phí */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tổng chi phí</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền sân</Text>
            <Text style={styles.summaryValue}>
              {selectedSlot ? fieldPrice.toLocaleString('vi-VN') + 'đ' : '—'}
            </Text>
          </View>

          {services.filter((s) => s.quantity > 0).map((s) => (
            <View key={s.id} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {s.name} × {s.quantity} {s.unit}
              </Text>
              <Text style={styles.summaryValue}>
                {(s.pricePerUnit * s.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}

          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>
              {total > 0 ? total.toLocaleString('vi-VN') + 'đ' : '—'}
            </Text>
          </View>
        </View>

        {/* Nút đặt sân */}
        <TouchableOpacity
          style={[
            styles.bookBtn,
            !selectedSlot && styles.bookBtnDisabled,
          ]}
          onPress={handleBooking}
          disabled={!selectedSlot}
        >
          <Ionicons
            name="card-outline"
            size={22}
            color="#fff"
          />
          <Text style={styles.bookBtnText}>Tiến hành thanh toán cọc</Text>
        </TouchableOpacity>

        {!selectedSlot && (
          <Text style={styles.bookHint}>* Vui lòng chọn khung giờ để tiếp tục</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },

  // Field Info
  fieldInfoCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  fieldInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  typeTagText: { fontSize: 13, fontWeight: '700' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  fieldName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  clusterRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  clusterText: { fontSize: 13, color: '#10B981', fontWeight: '500' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressText: { fontSize: 13, color: '#6B7280', flex: 1 },

  // Section Card
  sectionCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1 },
  sectionNote: {
    fontSize: 11, color: '#9CA3AF', backgroundColor: '#F3F4F6',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },

  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: {
    width: '47%', paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA', position: 'relative',
  },
  slotChipSelected: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  slotTime: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  slotTimeSelected: { color: '#10B981' },
  slotPrice: { fontSize: 12, color: '#9CA3AF' },
  slotPriceSelected: { color: '#059669', fontWeight: '700' },
  peakDot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#F59E0B',
  },
  peakDotSelected: { backgroundColor: '#D97706' },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
  legendText: { fontSize: 12, color: '#9CA3AF' },

  // Services
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  servicePrice: { fontSize: 12, fontWeight: '600' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyBtnAdd: { backgroundColor: '#10B981' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#1F2937', minWidth: 20, textAlign: 'center' },
  serviceSubtotal: { fontSize: 13, fontWeight: '700', minWidth: 70, textAlign: 'right' },

  // Summary
  summaryCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  summaryDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  summaryTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#10B981' },

  // Book Button
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#10B981', marginHorizontal: 16, paddingVertical: 18,
    borderRadius: 16, gap: 8,
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  bookBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  bookBtnText: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  bookHint: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 10 },
});
