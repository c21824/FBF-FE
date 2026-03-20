import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OwnerClusterDetailScreenProps {
  navigation: any;
  route: any;
}

// ─── Types ───────────────────────────────────────────────────────────────────
type ManualStatus = 'normal' | 'maintenance' | 'inactive';
type FieldStatus  = 'available' | 'booked' | 'maintenance' | 'inactive';

interface BookedSlot {
  slot: string;         // e.g. "17:00 - 19:00"
  customerName: string;
  phone: string;
}

interface DetailField {
  id: string;
  name: string;
  type: 'Sân 7' | 'Sân 9' | 'Sân 11';
  manualStatus: ManualStatus;
  slotPrices: { slot: string; price: string }[];
  todayBookings: BookedSlot[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const ALL_SLOTS = [
  '05:00 - 07:00', '07:00 - 09:00', '09:00 - 11:00',
  '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00',
  '17:00 - 19:00', '19:00 - 21:00', '21:00 - 23:00',
];

const STATUS_CONFIG: Record<FieldStatus, { label: string; color: string; bg: string; icon: string }> = {
  available:   { label: 'Còn trống',         color: '#10B981', bg: '#ECFDF5', icon: 'checkmark-circle' },
  booked:      { label: 'Đang được thuê',    color: '#EF4444', bg: '#FEF2F2', icon: 'time' },
  maintenance: { label: 'Bảo trì',           color: '#F59E0B', bg: '#FFFBEB', icon: 'construct' },
  inactive:    { label: 'Ngừng hoạt động',   color: '#9CA3AF', bg: '#F9FAFB', icon: 'ban' },
};

const TYPE_COLORS: Record<string, string> = {
  'Sân 7': '#10B981', 'Sân 9': '#3B82F6', 'Sân 11': '#F59E0B',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Lấy slot hiện tại dựa theo giờ đồng hồ */
function getCurrentSlot(now: Date): string | null {
  const h = now.getHours();
  return ALL_SLOTS.find(slot => {
    const start = parseInt(slot.split(' - ')[0]);
    const end   = parseInt(slot.split(' - ')[1]);
    return h >= start && h < end;
  }) ?? null;
}

/** Tính trạng thái thực của sân dựa theo giờ hiện tại */
function getEffectiveStatus(field: DetailField, currentSlot: string | null): FieldStatus {
  if (field.manualStatus === 'maintenance') return 'maintenance';
  if (field.manualStatus === 'inactive')    return 'inactive';
  if (!currentSlot) return 'available'; // ngoài giờ hoạt động
  const hasBooking = field.todayBookings.some(b => b.slot === currentSlot);
  return hasBooking ? 'booked' : 'available';
}

/** Lấy booking của slot hiện tại */
function getCurrentBooking(field: DetailField, currentSlot: string | null): BookedSlot | null {
  if (!currentSlot) return null;
  return field.todayBookings.find(b => b.slot === currentSlot) ?? null;
}

/** Trạng thái từng slot trong ngày */
function getSlotStatus(field: DetailField, slot: string): 'booked' | 'available' | 'manual' {
  if (field.manualStatus !== 'normal') return 'manual';
  return field.todayBookings.some(b => b.slot === slot) ? 'booked' : 'available';
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_FIELDS_BY_CLUSTER: Record<string, DetailField[]> = {
  '1': [
    {
      id: 'f1', name: 'Sân A', type: 'Sân 7', manualStatus: 'normal',
      slotPrices: [
        { slot: '05:00 - 07:00', price: '200.000' }, { slot: '07:00 - 09:00', price: '250.000' },
        { slot: '09:00 - 11:00', price: '250.000' }, { slot: '11:00 - 13:00', price: '200.000' },
        { slot: '13:00 - 15:00', price: '200.000' }, { slot: '15:00 - 17:00', price: '280.000' },
        { slot: '17:00 - 19:00', price: '350.000' }, { slot: '19:00 - 21:00', price: '350.000' },
        { slot: '21:00 - 23:00', price: '300.000' },
      ],
      todayBookings: [
        { slot: '07:00 - 09:00', customerName: 'Nguyễn Văn Hùng',  phone: '0901234567' },
        { slot: '17:00 - 19:00', customerName: 'Trần Minh Tuấn',   phone: '0912345678' },
        { slot: '19:00 - 21:00', customerName: 'Lê Quang Vinh',    phone: '0923456789' },
      ],
    },
    {
      id: 'f2', name: 'Sân B', type: 'Sân 7', manualStatus: 'normal',
      slotPrices: [
        { slot: '05:00 - 07:00', price: '200.000' }, { slot: '07:00 - 09:00', price: '250.000' },
        { slot: '09:00 - 11:00', price: '250.000' }, { slot: '11:00 - 13:00', price: '200.000' },
        { slot: '13:00 - 15:00', price: '200.000' }, { slot: '15:00 - 17:00', price: '280.000' },
        { slot: '17:00 - 19:00', price: '350.000' }, { slot: '19:00 - 21:00', price: '350.000' },
        { slot: '21:00 - 23:00', price: '300.000' },
      ],
      todayBookings: [
        { slot: '09:00 - 11:00', customerName: 'Phạm Đức Anh',    phone: '0934567890' },
        { slot: '13:00 - 15:00', customerName: 'Hoàng Minh Long', phone: '0945678901' },
      ],
    },
    {
      id: 'f3', name: 'Sân C', type: 'Sân 9', manualStatus: 'normal',
      slotPrices: [
        { slot: '05:00 - 07:00', price: '300.000' }, { slot: '07:00 - 09:00', price: '380.000' },
        { slot: '09:00 - 11:00', price: '380.000' }, { slot: '11:00 - 13:00', price: '300.000' },
        { slot: '13:00 - 15:00', price: '300.000' }, { slot: '15:00 - 17:00', price: '420.000' },
        { slot: '17:00 - 19:00', price: '500.000' }, { slot: '19:00 - 21:00', price: '500.000' },
        { slot: '21:00 - 23:00', price: '450.000' },
      ],
      todayBookings: [
        { slot: '15:00 - 17:00', customerName: 'Đặng Văn Sơn',    phone: '0956789012' },
        { slot: '17:00 - 19:00', customerName: 'Vũ Thanh Hải',    phone: '0967890123' },
        { slot: '19:00 - 21:00', customerName: 'Ngô Quốc Bảo',    phone: '0978901234' },
      ],
    },
    {
      id: 'f4', name: 'Sân D', type: 'Sân 11', manualStatus: 'maintenance',
      slotPrices: [
        { slot: '05:00 - 07:00', price: '400.000' }, { slot: '07:00 - 09:00', price: '500.000' },
        { slot: '09:00 - 11:00', price: '500.000' }, { slot: '11:00 - 13:00', price: '400.000' },
        { slot: '13:00 - 15:00', price: '400.000' }, { slot: '15:00 - 17:00', price: '550.000' },
        { slot: '17:00 - 19:00', price: '650.000' }, { slot: '19:00 - 21:00', price: '650.000' },
        { slot: '21:00 - 23:00', price: '580.000' },
      ],
      todayBookings: [],
    },
    {
      id: 'f5', name: 'Sân E', type: 'Sân 9', manualStatus: 'normal',
      slotPrices: [
        { slot: '05:00 - 07:00', price: '300.000' }, { slot: '07:00 - 09:00', price: '380.000' },
        { slot: '09:00 - 11:00', price: '380.000' }, { slot: '11:00 - 13:00', price: '300.000' },
        { slot: '13:00 - 15:00', price: '300.000' }, { slot: '15:00 - 17:00', price: '420.000' },
        { slot: '17:00 - 19:00', price: '500.000' }, { slot: '19:00 - 21:00', price: '500.000' },
        { slot: '21:00 - 23:00', price: '450.000' },
      ],
      todayBookings: [
        { slot: '07:00 - 09:00', customerName: 'Bùi Hữu Tài',     phone: '0989012345' },
        { slot: '21:00 - 23:00', customerName: 'Trịnh Văn Đạt',   phone: '0990123456' },
      ],
    },
  ],
  '2': [
    {
      id: 'g1', name: 'Sân 1', type: 'Sân 7', manualStatus: 'normal',
      slotPrices: [{ slot: '05:00 - 07:00', price: '180.000' }],
      todayBookings: [],
    },
    {
      id: 'g2', name: 'Sân 2', type: 'Sân 11', manualStatus: 'normal',
      slotPrices: [{ slot: '05:00 - 07:00', price: '380.000' }],
      todayBookings: [
        { slot: '15:00 - 17:00', customerName: 'Lê Văn Đức', phone: '0934567890' },
      ],
    },
  ],
};

const FILTER_TABS: { key: 'all' | FieldStatus; label: string; icon: string; color: string }[] = [
  { key: 'all',          label: 'Tất cả',    icon: 'apps-outline',             color: '#6B7280' },
  { key: 'available',   label: 'Còn trống', icon: 'checkmark-circle-outline',  color: '#10B981' },
  { key: 'booked',      label: 'Đang thuê', icon: 'time-outline',              color: '#EF4444' },
  { key: 'maintenance', label: 'Bảo trì',   icon: 'construct-outline',         color: '#F59E0B' },
  { key: 'inactive',    label: 'Ngừng HĐ',  icon: 'ban-outline',               color: '#9CA3AF' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export const OwnerClusterDetailScreen = ({ navigation, route }: OwnerClusterDetailScreenProps) => {
  const { cluster } = route.params || {};
  const clusterId: string = cluster?.id || '1';

  const [fields, setFields]         = useState<DetailField[]>(MOCK_FIELDS_BY_CLUSTER[clusterId] || []);
  const [now, setNow]               = useState(new Date());
  const [activeFilter, setFilter]   = useState<'all' | FieldStatus>('all');
  const [selectedField, setSelField]= useState<DetailField | null>(null);
  const [showModal, setShowModal]   = useState(false);

  // Cập nhật đồng hồ mỗi phút
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const currentSlot = getCurrentSlot(now);

  // Tính trạng thái thực cho từng sân
  const fieldsWithStatus = fields.map(f => ({
    ...f,
    effectiveStatus: getEffectiveStatus(f, currentSlot),
    currentBooking:  getCurrentBooking(f, currentSlot),
  }));

  const filtered = fieldsWithStatus.filter(f =>
    activeFilter === 'all' || f.effectiveStatus === activeFilter
  );

  const counts = {
    total:       fieldsWithStatus.length,
    available:   fieldsWithStatus.filter(f => f.effectiveStatus === 'available').length,
    booked:      fieldsWithStatus.filter(f => f.effectiveStatus === 'booked').length,
    maintenance: fieldsWithStatus.filter(f => f.effectiveStatus === 'maintenance').length,
    inactive:    fieldsWithStatus.filter(f => f.effectiveStatus === 'inactive').length,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleMaintenance = (fieldId: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      const next: ManualStatus = f.manualStatus === 'maintenance' ? 'normal' : 'maintenance';
      return { ...f, manualStatus: next };
    }));
  };

  const toggleInactive = (fieldId: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      if (getEffectiveStatus(f, currentSlot) === 'booked') {
        Alert.alert('Không thể tắt', 'Sân đang có khách thuê, không thể ngừng hoạt động.');
        return f;
      }
      const next: ManualStatus = f.manualStatus === 'inactive' ? 'normal' : 'inactive';
      return { ...f, manualStatus: next };
    }));
  };

  const deleteField = (fieldId: string) => {
    Alert.alert('Xóa sân', 'Bạn có chắc muốn xóa sân này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => setFields(p => p.filter(f => f.id !== fieldId)) },
    ]);
  };

  const clusterName    = cluster?.name    || 'Chi tiết cụm sân';
  const clusterAddress = cluster?.address || '';

  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{clusterName}</Text>
          {clusterAddress ? <Text style={styles.headerSub} numberOfLines={1}>{clusterAddress}</Text> : null}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddField', { clusterId })}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Summary ── */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <View style={styles.clockRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.clockText}>{timeStr} hôm nay</Text>
          </View>
          {currentSlot ? (
            <Text style={styles.currentSlotText}>🟡 Khung giờ hiện tại: <Text style={{ fontWeight: 'bold' }}>{currentSlot}</Text></Text>
          ) : (
            <Text style={styles.currentSlotText}>⚫ Ngoài giờ hoạt động (05:00–23:00)</Text>
          )}
        </View>
        <View style={styles.summaryStats}>
          <StatPill value={counts.available}   color="#10B981" label="Trống" />
          <StatPill value={counts.booked}      color="#EF4444" label="Thuê" />
          <StatPill value={counts.maintenance} color="#F59E0B" label="Bảo trì" />
        </View>
      </View>

      {/* ── Filter Buttons ── */}
      <View style={styles.filterGrid}>
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.key;
          const cnt = tab.key === 'all' ? counts.total : tab.key === 'available' ? counts.available
            : tab.key === 'booked' ? counts.booked : tab.key === 'maintenance' ? counts.maintenance : counts.inactive;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterBtn, isActive && { backgroundColor: tab.color, borderColor: tab.color }]}
              onPress={() => setFilter(tab.key)}
            >
              <Ionicons name={tab.icon as any} size={13} color={isActive ? '#fff' : tab.color} />
              <Text style={[styles.filterBtnText, isActive && { color: '#fff' }]}>{tab.label}</Text>
              <View style={[styles.filterBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.28)' : tab.color + '20' }]}>
                <Text style={[styles.filterBadgeText, { color: isActive ? '#fff' : tab.color }]}>{cnt}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Field List ── */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyText}>Không có sân nào</Text>
          </View>
        ) : (
          filtered.map(field => {
            const cfg = STATUS_CONFIG[field.effectiveStatus];
            const isMaint = field.manualStatus === 'maintenance';
            const isInact = field.manualStatus === 'inactive';

            return (
              <TouchableOpacity
                key={field.id}
                style={[styles.fieldCard, field.effectiveStatus === 'booked' && styles.fieldCardBooked]}
                activeOpacity={0.85}
                onPress={() => { setSelField(field); setShowModal(true); }}
              >
                {/* Row top */}
                <View style={styles.fieldCardTop}>
                  <View style={[styles.typeTag, { backgroundColor: TYPE_COLORS[field.type] + '22' }]}>
                    <Text style={[styles.typeTagText, { color: TYPE_COLORS[field.type] }]}>{field.type}</Text>
                  </View>
                  <Text style={styles.fieldName}>{field.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon as any} size={12} color={cfg.color} />
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>

                {/* Current booking info */}
                {field.currentBooking && (
                  <View style={styles.bookingInfoBox}>
                    <Ionicons name="person-circle-outline" size={15} color="#EF4444" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bookingName}>{field.currentBooking.customerName}</Text>
                      <Text style={styles.bookingMeta}>{field.currentBooking.slot} · {field.currentBooking.phone}</Text>
                    </View>
                    <View style={styles.liveDot} />
                  </View>
                )}

                {/* Slot timeline */}
                {field.manualStatus === 'normal' && (
                  <View style={styles.slotTimeline}>
                    {ALL_SLOTS.map((slot, i) => {
                      const st = getSlotStatus(field, slot);
                      const isCurrent = slot === currentSlot;
                      const dotColor = st === 'booked' ? '#EF4444' : '#10B981';
                      return (
                        <View key={i} style={[
                          styles.slotDot,
                          { backgroundColor: dotColor },
                          isCurrent && styles.slotDotCurrent,
                        ]} />
                      );
                    })}
                    <Text style={styles.slotTimelineLabel}>05h → 23h</Text>
                  </View>
                )}

                {/* Actions row */}
                <View style={styles.fieldCardBottom}>
                  <Text style={styles.bookingsCount}>
                    {field.todayBookings.length} đặt hôm nay
                  </Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, isMaint && styles.actionBtnActive]}
                      onPress={() => toggleMaintenance(field.id)}
                    >
                      <Ionicons name="construct-outline" size={15} color={isMaint ? '#F59E0B' : '#9CA3AF'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, isInact && styles.actionBtnGray]}
                      onPress={() => toggleInactive(field.id)}
                    >
                      <Ionicons name={isInact ? 'eye-off-outline' : 'eye-outline'} size={15} color={isInact ? '#9CA3AF' : '#3B82F6'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => navigation.navigate('AddField', { clusterId, editField: field })}
                    >
                      <Ionicons name="create-outline" size={15} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => deleteField(field.id)}>
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Detail Modal ── */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedField && (() => {
              const effStatus = getEffectiveStatus(selectedField, currentSlot);
              const cfg       = STATUS_CONFIG[effStatus];
              return (
                <>
                  {/* Header */}
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalTitle}>{selectedField.name}</Text>
                      <View style={styles.modalSubRow}>
                        <View style={[styles.typeTag, { backgroundColor: TYPE_COLORS[selectedField.type] + '22' }]}>
                          <Text style={[styles.typeTagText, { color: TYPE_COLORS[selectedField.type] }]}>{selectedField.type}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                          <Ionicons name={cfg.icon as any} size={12} color={cfg.color} />
                          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Ionicons name="close-circle" size={28} color="#D1D5DB" />
                    </TouchableOpacity>
                  </View>

                  {/* Lịch đặt trong ngày */}
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="calendar-outline" size={14} color="#1F2937" /> Lịch đặt sân hôm nay
                  </Text>
                  <ScrollView style={{ maxHeight: 280 }} nestedScrollEnabled>
                    {ALL_SLOTS.map((slot, i) => {
                      const booking   = selectedField.todayBookings.find(b => b.slot === slot);
                      const isCurrent = slot === currentSlot;
                      const price     = selectedField.slotPrices.find(p => p.slot === slot);
                      return (
                        <View
                          key={i}
                          style={[
                            styles.daySlotRow,
                            isCurrent && styles.daySlotRowCurrent,
                            booking   && styles.daySlotRowBooked,
                          ]}
                        >
                          <View style={styles.daySlotLeft}>
                            {isCurrent && <View style={styles.currentIndicator} />}
                            <Text style={[styles.daySlotTime, isCurrent && { color: '#F59E0B', fontWeight: '800' }]}>
                              {slot}
                            </Text>
                          </View>
                          {booking ? (
                            <View style={styles.daySlotBooking}>
                              <Text style={styles.daySlotCustomer} numberOfLines={1}>{booking.customerName}</Text>
                              <Text style={styles.daySlotPhone}>{booking.phone}</Text>
                            </View>
                          ) : (
                            <Text style={styles.daySlotEmpty}>
                              {selectedField.manualStatus !== 'normal' ? '—' : 'Còn trống'}
                            </Text>
                          )}
                          {price && (
                            <Text style={styles.daySlotPrice}>{price.price}đ</Text>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.modalEditBtn}
                    onPress={() => {
                      setShowModal(false);
                      navigation.navigate('AddField', { clusterId, editField: selectedField });
                    }}
                  >
                    <Ionicons name="create-outline" size={17} color="#fff" />
                    <Text style={styles.modalEditBtnText}>Chỉnh sửa sân</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatPill = ({ value, color, label }: { value: number; color: string; label: string }) => (
  <View style={[styles.statPill, { borderColor: color + '40' }]}>
    <Text style={[styles.statPillValue, { color }]}>{value}</Text>
    <Text style={styles.statPillLabel}>{label}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#F59E0B', paddingTop: 20, paddingBottom: 20,
    paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle:  { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub:    { fontSize: 12, color: '#FEF3C7', marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  // Summary card
  summaryCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: -16,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  summaryLeft: { flex: 1 },
  clockRow:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  clockText:   { fontSize: 12, color: '#6B7280' },
  currentSlotText: { fontSize: 12, color: '#374151' },
  summaryStats:{ flexDirection: 'row', gap: 6 },
  statPill: {
    alignItems: 'center', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  statPillValue: { fontSize: 16, fontWeight: 'bold' },
  statPillLabel: { fontSize: 9, color: '#9CA3AF' },
  // Filter
  filterGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  filterBtnText:  { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  filterBadge: {
    minWidth: 17, height: 17, borderRadius: 9, paddingHorizontal: 3,
    justifyContent: 'center', alignItems: 'center',
  },
  filterBadgeText: { fontSize: 10, fontWeight: '800' },
  // List
  content:    { flex: 1, paddingHorizontal: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { fontSize: 48, marginBottom: 12 },
  emptyText:  { fontSize: 15, color: '#9CA3AF' },
  // Field card
  fieldCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginTop: 12, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    borderWidth: 1, borderColor: 'transparent',
  },
  fieldCardBooked: { borderColor: '#FECACA' },
  fieldCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typeTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, minWidth: 52, alignItems: 'center' },
  typeTagText:  { fontSize: 11, fontWeight: '700' },
  fieldName:    { flex: 1, fontSize: 15, fontWeight: '700', color: '#1F2937' },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText:   { fontSize: 11, fontWeight: '700' },
  // Booking info
  bookingInfoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, marginBottom: 8,
  },
  bookingName: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  bookingMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  // Slot timeline
  slotTimeline: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    marginBottom: 8, flexWrap: 'nowrap',
  },
  slotDot: { width: 10, height: 10, borderRadius: 5 },
  slotDotCurrent: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#F59E0B' },
  slotTimelineLabel: { fontSize: 9, color: '#D1D5DB', marginLeft: 2 },
  // Card bottom
  fieldCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bookingsCount:   { fontSize: 11, color: '#9CA3AF' },
  actionRow:       { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center',
  },
  actionBtnActive: { backgroundColor: '#FFFBEB' },
  actionBtnGray:   { backgroundColor: '#F3F4F6' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  modalTitle:   { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  modalSubRow:  { flexDirection: 'row', gap: 8, alignItems: 'center' },
  modalSectionTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 4 },
  // Day schedule slots
  daySlotRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', gap: 8,
  },
  daySlotRowCurrent: { backgroundColor: '#FFFBEB', borderRadius: 8, paddingHorizontal: 6, marginHorizontal: -6 },
  daySlotRowBooked:  { },
  daySlotLeft:    { flexDirection: 'row', alignItems: 'center', gap: 4, width: 110 },
  currentIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#F59E0B' },
  daySlotTime:    { fontSize: 12, color: '#374151', fontWeight: '600' },
  daySlotBooking: { flex: 1 },
  daySlotCustomer:{ fontSize: 13, fontWeight: '700', color: '#1F2937' },
  daySlotPhone:   { fontSize: 11, color: '#9CA3AF' },
  daySlotEmpty:   { flex: 1, fontSize: 12, color: '#10B981', fontWeight: '600' },
  daySlotPrice:   { fontSize: 11, color: '#9CA3AF' },
  modalEditBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#F59E0B', borderRadius: 12, paddingVertical: 14, marginTop: 14,
  },
  modalEditBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
