import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StaffScheduleScreenProps {
  navigation: any;
}

interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string;
  color: string;
}

type ShiftKey = 'shift1' | 'shift2';

interface DaySchedule {
  shift1: string | null; // staff id
  shift2: string | null;
}

// Mỗi ngày 2 ca: Ca 1 (05:00-13:00), Ca 2 (13:00-21:00)
const SHIFTS: Record<ShiftKey, { label: string; time: string; icon: string }> = {
  shift1: { label: 'Ca 1', time: '05:00 – 13:00', icon: 'sunny-outline' },
  shift2: { label: 'Ca 2', time: '13:00 – 21:00', icon: 'partly-sunny-outline' },
};

const STAFF_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: 'Trần Văn An',    phone: '0901234567', role: 'Nhân viên',   color: '#10B981' },
  { id: 's2', name: 'Nguyễn Thị Bích',phone: '0902345678', role: 'Nhân viên',   color: '#3B82F6' },
  { id: 's3', name: 'Lê Minh Cường',  phone: '0903456789', role: 'Quản lý ca',  color: '#F59E0B' },
  { id: 's4', name: 'Phạm Thị Dung',  phone: '0904567890', role: 'Nhân viên',   color: '#8B5CF6' },
];

// Tạo tuần hiện tại bắt đầu từ thứ 2
function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const day = startDate.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day; // offset về thứ 2
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + diff);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const INITIAL_SCHEDULE: Record<string, DaySchedule> = {
  '2026-03-16': { shift1: 's1', shift2: 's2' },
  '2026-03-17': { shift1: 's3', shift2: 's4' },
  '2026-03-18': { shift1: 's2', shift2: 's1' },
  '2026-03-19': { shift1: 's4', shift2: 's3' },
  '2026-03-20': { shift1: 's1', shift2: 's4' },
  '2026-03-21': { shift1: 's3', shift2: 's2' },
  '2026-03-22': { shift1: null, shift2: null },
};

export const StaffScheduleScreen = ({ navigation }: StaffScheduleScreenProps) => {
  const today = new Date('2026-03-20');
  const [baseDate, setBaseDate] = useState(today);
  const weekDays = getWeekDays(baseDate);

  const [staff, setStaff]       = useState<Staff[]>(INITIAL_STAFF);
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(INITIAL_SCHEDULE);

  // Picker modal
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget]   = useState<{ dayKey: string; shift: ShiftKey } | null>(null);

  // Add staff modal
  const [addStaffVisible, setAddStaffVisible] = useState(false);
  const [newName,  setNewName]  = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole,  setNewRole]  = useState('Nhân viên');

  // Tab: 'schedule' | 'staff'
  const [tab, setTab] = useState<'schedule' | 'staff'>('schedule');

  const goWeek = (dir: -1 | 1) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dir * 7);
    setBaseDate(d);
  };

  const openPicker = (dayKey: string, shift: ShiftKey) => {
    setPickerTarget({ dayKey, shift });
    setPickerVisible(true);
  };

  const assignStaff = (staffId: string | null) => {
    if (!pickerTarget) return;
    const { dayKey, shift } = pickerTarget;
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || { shift1: null, shift2: null }), [shift]: staffId },
    }));
    setPickerVisible(false);
    setPickerTarget(null);
  };

  const getStaffById = (id: string | null): Staff | undefined =>
    id ? staff.find(s => s.id === id) : undefined;

  const handleAddStaff = () => {
    if (!newName.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên nhân viên'); return; }
    if (!newPhone.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại'); return; }
    const color = STAFF_COLORS[staff.length % STAFF_COLORS.length];
    const newStaff: Staff = {
      id: 's' + Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      role: newRole.trim() || 'Nhân viên',
      color,
    };
    setStaff(prev => [...prev, newStaff]);
    setNewName(''); setNewPhone(''); setNewRole('Nhân viên');
    setAddStaffVisible(false);
  };

  const handleDeleteStaff = (staffId: string) => {
    Alert.alert('Xóa nhân viên', 'Bạn có chắc muốn xóa nhân viên này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: () => {
          setStaff(prev => prev.filter(s => s.id !== staffId));
          // Remove from schedule
          setSchedule(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(k => {
              if (updated[k].shift1 === staffId) updated[k] = { ...updated[k], shift1: null };
              if (updated[k].shift2 === staffId) updated[k] = { ...updated[k], shift2: null };
            });
            return updated;
          });
        },
      },
    ]);
  };

  // Week label
  const weekLabel = `${weekDays[0].getDate()}/${weekDays[0].getMonth() + 1} – ${weekDays[6].getDate()}/${weekDays[6].getMonth() + 1}/${weekDays[6].getFullYear()}`;
  const todayKey = dateKey(today);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Lịch làm việc nhân viên</Text>
          <Text style={styles.headerSub}>2 ca/ngày · Ca 1: 05-13h · Ca 2: 13-21h</Text>
        </View>
        {tab === 'staff' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddStaffVisible(true)}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'schedule' && styles.tabBtnActive]}
          onPress={() => setTab('schedule')}
        >
          <Ionicons name="calendar-outline" size={16} color={tab === 'schedule' ? '#8B5CF6' : '#9CA3AF'} />
          <Text style={[styles.tabText, tab === 'schedule' && styles.tabTextActive]}>Lịch ca</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'staff' && styles.tabBtnActive]}
          onPress={() => setTab('staff')}
        >
          <Ionicons name="people-outline" size={16} color={tab === 'staff' ? '#8B5CF6' : '#9CA3AF'} />
          <Text style={[styles.tabText, tab === 'staff' && styles.tabTextActive]}>Nhân viên ({staff.length})</Text>
        </TouchableOpacity>
      </View>

      {tab === 'schedule' ? (
        <>
          {/* Week Navigation */}
          <View style={styles.weekNav}>
            <TouchableOpacity style={styles.weekNavBtn} onPress={() => goWeek(-1)}>
              <Ionicons name="chevron-back" size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.weekLabel}>{weekLabel}</Text>
            <TouchableOpacity style={styles.weekNavBtn} onPress={() => goWeek(1)}>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Schedule List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {weekDays.map((day, idx) => {
              const key = dateKey(day);
              const daySched = schedule[key] || { shift1: null, shift2: null };
              const isToday = key === todayKey;
              return (
                <View key={key} style={[styles.dayCard, isToday && styles.dayCardToday]}>
                  {/* Day label */}
                  <View style={styles.dayHeader}>
                    <View style={[styles.dayLabelBox, isToday && styles.dayLabelBoxToday]}>
                      <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{DAY_LABELS[idx]}</Text>
                      <Text style={[styles.dayDate,  isToday && styles.dayDateToday]}>
                        {day.getDate()}/{day.getMonth() + 1}
                      </Text>
                    </View>
                    {isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>Hôm nay</Text>
                      </View>
                    )}
                  </View>

                  {/* Shifts */}
                  <View style={styles.shiftsRow}>
                    {(Object.keys(SHIFTS) as ShiftKey[]).map(sk => {
                      const shiftCfg = SHIFTS[sk];
                      const assignedId = daySched[sk];
                      const assignedStaff = getStaffById(assignedId);
                      return (
                        <TouchableOpacity
                          key={sk}
                          style={[
                            styles.shiftCell,
                            assignedStaff && { borderColor: assignedStaff.color, borderWidth: 1.5 },
                          ]}
                          onPress={() => openPicker(key, sk)}
                        >
                          <View style={styles.shiftHeader}>
                            <Ionicons name={shiftCfg.icon as any} size={14} color="#F59E0B" />
                            <Text style={styles.shiftLabel}>{shiftCfg.label}</Text>
                          </View>
                          <Text style={styles.shiftTime}>{shiftCfg.time}</Text>
                          {assignedStaff ? (
                            <View style={styles.assignedBox}>
                              <View style={[styles.avatarCircle, { backgroundColor: assignedStaff.color }]}>
                                <Text style={styles.avatarText}>{assignedStaff.name.charAt(assignedStaff.name.lastIndexOf(' ') + 1)}</Text>
                              </View>
                              <Text style={styles.assignedName} numberOfLines={1}>{assignedStaff.name}</Text>
                            </View>
                          ) : (
                            <View style={styles.unassignedBox}>
                              <Ionicons name="add-circle-outline" size={18} color="#D1D5DB" />
                              <Text style={styles.unassignedText}>Chưa phân công</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollView>
        </>
      ) : (
        /* Staff List */
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {staff.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyText}>Chưa có nhân viên nào</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setAddStaffVisible(true)}>
                <Ionicons name="add-circle-outline" size={18} color="#8B5CF6" />
                <Text style={styles.emptyAddText}>Thêm nhân viên</Text>
              </TouchableOpacity>
            </View>
          ) : (
            staff.map(s => {
              // Count shifts this week
              const weekShifts = weekDays.reduce((sum, day) => {
                const k = dateKey(day);
                const d = schedule[k];
                if (!d) return sum;
                return sum + (d.shift1 === s.id ? 1 : 0) + (d.shift2 === s.id ? 1 : 0);
              }, 0);
              return (
                <View key={s.id} style={styles.staffCard}>
                  <View style={[styles.staffAvatar, { backgroundColor: s.color }]}>
                    <Text style={styles.staffAvatarText}>{s.name.charAt(s.name.lastIndexOf(' ') + 1)}</Text>
                  </View>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{s.name}</Text>
                    <Text style={styles.staffRole}>{s.role}</Text>
                    <Text style={styles.staffPhone}>{s.phone}</Text>
                  </View>
                  <View style={styles.staffRight}>
                    <View style={styles.shiftCountBadge}>
                      <Text style={styles.shiftCountNum}>{weekShifts}</Text>
                      <Text style={styles.shiftCountLabel}>ca/tuần</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteStaffBtn}
                      onPress={() => handleDeleteStaff(s.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* Picker Modal: chọn nhân viên cho ca */}
      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerBox}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                Chọn nhân viên cho {pickerTarget ? SHIFTS[pickerTarget.shift].label : ''}
              </Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.pickerTime}>
              {pickerTarget ? SHIFTS[pickerTarget.shift].time : ''}
            </Text>

            {/* Remove assignment option */}
            <TouchableOpacity style={styles.pickerRow} onPress={() => assignStaff(null)}>
              <View style={[styles.pickerAvatar, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="close" size={18} color="#9CA3AF" />
              </View>
              <Text style={[styles.pickerName, { color: '#9CA3AF' }]}>Bỏ phân công</Text>
            </TouchableOpacity>

            {staff.map(s => (
              <TouchableOpacity key={s.id} style={styles.pickerRow} onPress={() => assignStaff(s.id)}>
                <View style={[styles.pickerAvatar, { backgroundColor: s.color }]}>
                  <Text style={styles.pickerAvatarText}>{s.name.charAt(s.name.lastIndexOf(' ') + 1)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickerName}>{s.name}</Text>
                  <Text style={styles.pickerRole}>{s.role} · {s.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Add Staff Modal */}
      <Modal visible={addStaffVisible} transparent animationType="fade" onRequestClose={() => setAddStaffVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.addStaffBox}>
            <Text style={styles.addStaffTitle}>Thêm nhân viên</Text>

            <Text style={styles.inputLabel}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nguyễn Văn A"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="09xxxxxxxx"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />

            <Text style={styles.inputLabel}>Chức vụ</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhân viên / Quản lý ca"
              value={newRole}
              onChangeText={setNewRole}
            />

            <View style={styles.addStaffBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddStaffVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAddStaff}>
                <Text style={styles.confirmBtnText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 11, color: '#E9D5FF', marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    paddingVertical: 8, borderRadius: 10, backgroundColor: '#F9FAFB',
  },
  tabBtnActive: { backgroundColor: '#EDE9FE' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#8B5CF6' },
  weekNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  weekNavBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center',
  },
  weekLabel: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1, padding: 16 },
  dayCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    padding: 14, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  dayCardToday: { borderWidth: 2, borderColor: '#8B5CF6' },
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  dayLabelBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center',
  },
  dayLabelBoxToday: { backgroundColor: '#8B5CF6' },
  dayLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  dayLabelToday: { color: '#fff' },
  dayDate: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  dayDateToday: { color: '#fff' },
  todayBadge: {
    backgroundColor: '#EDE9FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  todayBadgeText: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },
  shiftsRow: { flexDirection: 'row', gap: 10 },
  shiftCell: {
    flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  shiftHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  shiftLabel: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  shiftTime: { fontSize: 10, color: '#9CA3AF', marginBottom: 8 },
  assignedBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatarCircle: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  assignedName: { flex: 1, fontSize: 11, fontWeight: '600', color: '#374151' },
  unassignedBox: { alignItems: 'center', gap: 4 },
  unassignedText: { fontSize: 10, color: '#D1D5DB', textAlign: 'center' },
  // Staff list
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF', marginBottom: 16 },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#8B5CF6', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  emptyAddText: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  staffCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  staffAvatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  staffAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  staffRole: { fontSize: 12, color: '#8B5CF6', fontWeight: '600', marginBottom: 2 },
  staffPhone: { fontSize: 12, color: '#9CA3AF' },
  staffRight: { alignItems: 'flex-end', gap: 8 },
  shiftCountBadge: {
    backgroundColor: '#EDE9FE', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center',
  },
  shiftCountNum: { fontSize: 16, fontWeight: 'bold', color: '#8B5CF6' },
  shiftCountLabel: { fontSize: 9, color: '#8B5CF6' },
  deleteStaffBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center',
  },
  // Picker modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  pickerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  pickerTime: { fontSize: 12, color: '#9CA3AF', marginBottom: 16 },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  pickerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  pickerAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  pickerName: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  pickerRole: { fontSize: 12, color: '#9CA3AF' },
  // Add staff modal
  addStaffBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24,
  },
  addStaffTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: '#1F2937', marginBottom: 14,
  },
  addStaffBtns: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  confirmBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 12,
    backgroundColor: '#8B5CF6', alignItems: 'center',
  },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
