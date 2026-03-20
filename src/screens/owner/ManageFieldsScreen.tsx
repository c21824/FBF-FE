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

interface ManageFieldsScreenProps {
  navigation: any;
}

export interface FieldSlotPrice {
  slot: string;
  price: string;
}

export interface Field {
  id: string;
  name: string;
  type: 'Sân 7' | 'Sân 9' | 'Sân 11';
  status: 'active' | 'inactive';
  slotPrices: FieldSlotPrice[];
}

export interface Cluster {
  id: string;
  name: string;
  address: string;
  fields: Field[];
}

// Mock data ban đầu
const INITIAL_CLUSTERS: Cluster[] = [
  {
    id: '1',
    name: 'Cụm Sân Thể Thao Quận 1',
    address: 'Đường Lê Duẩn, Quận 1, TP.HCM',
    fields: [
      {
        id: 'f1',
        name: 'Sân A',
        type: 'Sân 7',
        status: 'active',
        slotPrices: [
          { slot: '05:00 - 07:00', price: '200.000' },
          { slot: '07:00 - 09:00', price: '250.000' },
          { slot: '09:00 - 11:00', price: '250.000' },
          { slot: '11:00 - 13:00', price: '200.000' },
          { slot: '13:00 - 15:00', price: '200.000' },
          { slot: '15:00 - 17:00', price: '280.000' },
          { slot: '17:00 - 19:00', price: '350.000' },
          { slot: '19:00 - 21:00', price: '350.000' },
          { slot: '21:00 - 23:00', price: '300.000' },
        ],
      },
      {
        id: 'f2',
        name: 'Sân B',
        type: 'Sân 11',
        status: 'active',
        slotPrices: [
          { slot: '05:00 - 07:00', price: '400.000' },
          { slot: '07:00 - 09:00', price: '500.000' },
          { slot: '09:00 - 11:00', price: '500.000' },
          { slot: '11:00 - 13:00', price: '400.000' },
          { slot: '13:00 - 15:00', price: '400.000' },
          { slot: '15:00 - 17:00', price: '550.000' },
          { slot: '17:00 - 19:00', price: '650.000' },
          { slot: '19:00 - 21:00', price: '650.000' },
          { slot: '21:00 - 23:00', price: '580.000' },
        ],
      },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  'Sân 7': '#10B981',
  'Sân 9': '#3B82F6',
  'Sân 11': '#F59E0B',
};

export const ManageFieldsScreen = ({ navigation }: ManageFieldsScreenProps) => {
  const [clusters, setClusters] = useState<Cluster[]>(INITIAL_CLUSTERS);
  const [expandedClusters, setExpandedClusters] = useState<string[]>(['1']);

  const toggleCluster = (clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((id) => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  const handleClusterPress = (cluster: Cluster) => {
    navigation.navigate('OwnerClusterDetail', { cluster });
  };

  const handleDeleteCluster = (clusterId: string) => {
    Alert.alert(
      'Xóa cụm sân',
      'Bạn có chắc muốn xóa cụm sân này? Tất cả sân trong cụm cũng sẽ bị xóa.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () =>
            setClusters((prev) => prev.filter((c) => c.id !== clusterId)),
        },
      ]
    );
  };

  const handleDeleteField = (clusterId: string, fieldId: string) => {
    Alert.alert('Xóa sân', 'Bạn có chắc muốn xóa sân này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () =>
          setClusters((prev) =>
            prev.map((c) =>
              c.id === clusterId
                ? { ...c, fields: c.fields.filter((f) => f.id !== fieldId) }
                : c
            )
          ),
      },
    ]);
  };

  const totalFields = clusters.reduce((sum, c) => sum + c.fields.length, 0);
  const activeFields = clusters.reduce(
    (sum, c) => sum + c.fields.filter((f) => f.status === 'active').length,
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quản lý sân</Text>
          <Text style={styles.headerSub}>{clusters.length} cụm · {totalFields} sân</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddCluster', { onAdd: (c: Cluster) => setClusters((prev) => [...prev, c]) })}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{clusters.length}</Text>
          <Text style={styles.summaryLabel}>Cụm sân</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalFields}</Text>
          <Text style={styles.summaryLabel}>Tổng sân</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: '#10B981' }]}>{activeFields}</Text>
          <Text style={styles.summaryLabel}>Đang hoạt động</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {clusters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyTitle}>Chưa có cụm sân nào</Text>
            <Text style={styles.emptySubtitle}>Nhấn nút + ở trên để thêm cụm sân đầu tiên</Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => navigation.navigate('AddCluster', { onAdd: (c: Cluster) => setClusters((prev) => [...prev, c]) })}
            >
              <Ionicons name="add-circle-outline" size={20} color="#F59E0B" />
              <Text style={styles.emptyAddText}>Thêm cụm sân</Text>
            </TouchableOpacity>
          </View>
        ) : (
          clusters.map((cluster) => {
            const isExpanded = expandedClusters.includes(cluster.id);
            return (
              <View key={cluster.id} style={styles.clusterCard}>
                {/* Cluster Header */}
                <TouchableOpacity
                  style={styles.clusterHeader}
                  onPress={() => handleClusterPress(cluster)}
                >
                  <View style={styles.clusterIconBox}>
                    <Ionicons name="business" size={22} color="#F59E0B" />
                  </View>
                  <View style={styles.clusterInfo}>
                    <Text style={styles.clusterName}>{cluster.name}</Text>
                    <Text style={styles.clusterAddress} numberOfLines={1}>
                      {cluster.address}
                    </Text>
                    <Text style={styles.clusterCount}>{cluster.fields.length} sân</Text>
                  </View>
                  <View style={styles.clusterActions}>
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={() => handleDeleteCluster(cluster.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#F59E0B',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#FEF3C7', marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  summaryLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: '#F3F4F6' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#F59E0B', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  emptyAddText: { fontSize: 14, fontWeight: '600', color: '#F59E0B' },
  clusterCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, overflow: 'hidden',
  },
  clusterHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  clusterIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center',
  },
  clusterInfo: { flex: 1 },
  clusterName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  clusterAddress: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  clusterCount: { fontSize: 12, color: '#F59E0B', fontWeight: '600' },
  clusterActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center',
  },
  fieldsContainer: {
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    paddingHorizontal: 16, paddingBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  fieldRowLast: { borderBottomWidth: 0 },
  typeTag: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, minWidth: 54, alignItems: 'center',
  },
  typeTagText: { fontSize: 11, fontWeight: '700' },
  fieldInfo: { flex: 1 },
  fieldName: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  fieldSlots: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  addFieldBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, marginTop: 4,
    justifyContent: 'center',
    borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: 10, backgroundColor: '#FFFBEB',
  },
  addFieldText: { fontSize: 13, fontWeight: '600', color: '#F59E0B' },
});
