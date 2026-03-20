import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FieldCard, FieldData } from '../../components/FieldCard';
import { ClusterData } from '../../components/ClusterCard';

interface ClusterDetailScreenProps {
  navigation: any;
  route: any;
}

// Mock dữ liệu sân theo từng cụm
const FIELDS_BY_CLUSTER: Record<string, FieldData[]> = {
  '1': [
    {
      id: 'c1-f1',
      name: 'Sân A - Thể Thao Quận 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=San+A',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c1-f2',
      name: 'Sân B - Thể Thao Quận 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=San+B',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c1-f3',
      name: 'Sân C - Thể Thao Quận 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=San+C',
      type: 'Sân 9',
      available: false,
    },
    {
      id: 'c1-f4',
      name: 'Sân D - Thể Thao Quận 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=San+D',
      type: 'Sân 11',
      available: true,
    },
    {
      id: 'c1-f5',
      name: 'Sân E - Thể Thao Quận 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=San+E',
      type: 'Sân 7',
      available: true,
    },
  ],
  '2': [
    {
      id: 'c2-f1',
      name: 'Sân 1 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=TB+1',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c2-f2',
      name: 'Sân 2 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=TB+2',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c2-f3',
      name: 'Sân 3 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=TB+3',
      type: 'Sân 7',
      available: false,
    },
    {
      id: 'c2-f4',
      name: 'Sân 4 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=TB+4',
      type: 'Sân 11',
      available: true,
    },
    {
      id: 'c2-f5',
      name: 'Sân 5 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.3,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=TB+5',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c2-f6',
      name: 'Sân 6 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=TB+6',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c2-f7',
      name: 'Sân 7 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=TB+7',
      type: 'Sân 11',
      available: false,
    },
    {
      id: 'c2-f8',
      name: 'Sân 8 - Tân Bình',
      address: 'Quận Tân Bình, TP.HCM',
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=TB+8',
      type: 'Sân 9',
      available: true,
    },
  ],
  '3': [
    {
      id: 'c3-f1',
      name: 'Sân Alpha - Phú Nhuận',
      address: 'Quận Phú Nhuận, TP.HCM',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=PN+Alpha',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c3-f2',
      name: 'Sân Beta - Phú Nhuận',
      address: 'Quận Phú Nhuận, TP.HCM',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=PN+Beta',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c3-f3',
      name: 'Sân Gamma - Phú Nhuận',
      address: 'Quận Phú Nhuận, TP.HCM',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=PN+Gamma',
      type: 'Sân 11',
      available: false,
    },
    {
      id: 'c3-f4',
      name: 'Sân Delta - Phú Nhuận',
      address: 'Quận Phú Nhuận, TP.HCM',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=PN+Delta',
      type: 'Sân 7',
      available: true,
    },
  ],
  '4': [
    {
      id: 'c4-f1',
      name: 'Sân VIP 1 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=HG+VIP1',
      type: 'Sân 11',
      available: false,
    },
    {
      id: 'c4-f2',
      name: 'Sân VIP 2 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 5.0,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=HG+VIP2',
      type: 'Sân 11',
      available: true,
    },
    {
      id: 'c4-f3',
      name: 'Sân Pro 1 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=HG+Pro1',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c4-f4',
      name: 'Sân Pro 2 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=HG+Pro2',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c4-f5',
      name: 'Sân Standard - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=HG+Std',
      type: 'Sân 11',
      available: true,
    },
    {
      id: 'c4-f6',
      name: 'Sân Training - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=HG+Train',
      type: 'Sân 7',
      available: false,
    },
    {
      id: 'c4-f7',
      name: 'Sân Elite 1 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=HG+Elite1',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c4-f8',
      name: 'Sân Elite 2 - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=HG+Elite2',
      type: 'Sân 9',
      available: false,
    },
    {
      id: 'c4-f9',
      name: 'Sân Champions - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 5.0,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=HG+Champ',
      type: 'Sân 11',
      available: true,
    },
    {
      id: 'c4-f10',
      name: 'Sân Premier - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=HG+Prem',
      type: 'Sân 7',
      available: true,
    },
    {
      id: 'c4-f11',
      name: 'Sân Grand - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=HG+Grand',
      type: 'Sân 9',
      available: true,
    },
    {
      id: 'c4-f12',
      name: 'Sân Master - Hoàng Gia',
      address: 'Quận 7, TP.HCM',
      rating: 5.0,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=HG+Master',
      type: 'Sân 11',
      available: true,
    },
  ],
};

export const ClusterDetailScreen = ({ navigation, route }: ClusterDetailScreenProps) => {
  const cluster: ClusterData = route.params?.cluster;
  const [selectedType, setSelectedType] = useState('Tất cả');

  const fieldTypes = ['Tất cả', 'Sân 7', 'Sân 9', 'Sân 11'];
  const allFields = FIELDS_BY_CLUSTER[cluster.id] || [];

  const filteredFields = allFields.filter((field) =>
    selectedType === 'Tất cả' || field.type === selectedType
  );

  const availableFields = filteredFields.filter((f) => f.available);
  const unavailableFields = filteredFields.filter((f) => !f.available);

  // Đếm theo loại sân
  const countByType = (type: string) =>
    allFields.filter((f) => f.type === type).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Hero Header */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: cluster.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Hero Content */}
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{cluster.name}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#D1FAE5" />
              <Text style={styles.metaText}>{cluster.address}</Text>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.statBadge}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.statBadgeText}>{cluster.rating}</Text>
              </View>
              <View style={styles.statBadge}>
                <Ionicons name="football-outline" size={14} color="#FFFFFF" />
                <Text style={styles.statBadgeText}>{cluster.fieldCount} sân</Text>
              </View>
              {cluster.distance && (
                <View style={styles.statBadge}>
                  <Ionicons name="navigate-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.statBadgeText}>{cluster.distance}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Thống kê nhanh */}
      <View style={styles.quickStats}>
        {['Sân 7', 'Sân 9', 'Sân 11'].map((type) => (
          <View key={type} style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{countByType(type)}</Text>
            <Text style={styles.quickStatLabel}>{type}</Text>
          </View>
        ))}
        <View style={[styles.quickStatItem, styles.quickStatAvailable]}>
          <Text style={[styles.quickStatNumber, { color: '#10B981' }]}>
            {allFields.filter((f) => f.available).length}
          </Text>
          <Text style={styles.quickStatLabel}>Còn trống</Text>
        </View>
      </View>

      {/* Bộ lọc loại sân */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {fieldTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextActive,
                ]}
              >
                {type}
              </Text>
              {type !== 'Tất cả' && (
                <View style={[
                  styles.filterCount,
                  selectedType === type && styles.filterCountActive,
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    selectedType === type && styles.filterCountTextActive,
                  ]}>
                    {countByType(type)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách sân */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Sân còn trống */}
        {availableFields.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Còn trống</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{availableFields.length}</Text>
              </View>
            </View>
            {availableFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() => navigation.navigate('Booking', { field, clusterName: cluster.name })}
              />
            ))}
          </View>
        )}

        {/* Sân đã đặt */}
        {unavailableFields.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, styles.sectionDotGray]} />
              <Text style={styles.sectionTitle}>Đã được đặt</Text>
              <View style={[styles.countBadge, styles.countBadgeGray]}>
                <Text style={[styles.countBadgeText, styles.countBadgeTextGray]}>
                  {unavailableFields.length}
                </Text>
              </View>
            </View>
            {unavailableFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() => {
                  if (field.available) {
                    navigation.navigate('Booking', { field, clusterName: cluster.name });
                  }
                }}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredFields.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyTitle}>Không có sân {selectedType}</Text>
            <Text style={styles.emptySubtitle}>Cụm sân này chưa có loại sân bạn chọn</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroContainer: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#E5E7EB',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#D1FAE5',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  quickStatAvailable: {
    borderRightWidth: 0,
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  filterSection: {
    paddingVertical: 14,
    paddingLeft: 16,
  },
  filterRow: {
    paddingRight: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  sectionDotGray: {
    backgroundColor: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeGray: {
    backgroundColor: '#F3F4F6',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  countBadgeTextGray: {
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
