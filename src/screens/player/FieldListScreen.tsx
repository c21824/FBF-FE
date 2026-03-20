import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SearchBar } from '../../components/SearchBar';
import { CategoryFilter } from '../../components/CategoryFilter';
import { FieldCard, FieldData } from '../../components/FieldCard';

interface FieldListScreenProps {
  navigation: any;
}

export const FieldListScreen = ({ navigation }: FieldListScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'Sân 7', 'Sân 9', 'Sân 11'];

  // Mock data - sau này sẽ fetch từ API
  const allFields: FieldData[] = [
    {
      id: '1',
      name: 'Sân Bóng Thành Phố 1',
      address: 'Đường Lê Duẩn, Quận 1',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=San+1',
      type: 'Sân 7',
      available: true,
      clusterName: 'Cụm Sân Thể Thao Quận 1',
    },
    {
      id: '2',
      name: 'Sân Vận Động Mini A',
      address: 'Quận Tân Bình',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=San+2',
      type: 'Sân 9',
      available: true,
      clusterName: 'Cụm Sân Vận Động Tân Bình',
    },
    {
      id: '3',
      name: 'Sân Bóng Hoàng Gia',
      address: 'Quận 7',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=San+3',
      type: 'Sân 11',
      available: false,
      clusterName: 'Sân Bóng Hoàng Gia Complex',
    },
    {
      id: '4',
      name: 'Sân Bóng Ánh Dương',
      address: 'Quận Phú Nhuận',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=San+4',
      type: 'Sân 7',
      available: true,
      clusterName: 'Cụm Sân Bóng Phú Nhuận',
    },
    {
      id: '5',
      name: 'Sân Thành Phố 2',
      address: 'Đường Nguyễn Văn Linh, Quận 1',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=San+5',
      type: 'Sân 7',
      available: true,
      clusterName: 'Cụm Sân Thể Thao Quận 1',
    },
    {
      id: '6',
      name: 'Sân Mini B',
      address: 'Quận Tân Bình',
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=San+6',
      type: 'Sân 9',
      available: true,
      clusterName: 'Cụm Sân Vận Động Tân Bình',
    },
    {
      id: '7',
      name: 'Sân Chuyên Nghiệp 1',
      address: 'Quận 7',
      rating: 5.0,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=San+7',
      type: 'Sân 11',
      available: true,
      clusterName: 'Sân Bóng Hoàng Gia Complex',
    },
    {
      id: '8',
      name: 'Sân Ánh Dương 2',
      address: 'Quận Phú Nhuận',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=San+8',
      type: 'Sân 9',
      available: false,
      clusterName: 'Cụm Sân Bóng Phú Nhuận',
    },
  ];

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleFieldPress = (field: FieldData) => {
    if (!field.available) return;
    navigation.navigate('BookingFromList', {
      field,
      clusterName: field.clusterName || '',
    });
  };

  // Filter logic
  const filteredFields = allFields.filter((field) => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.clusterName && field.clusterName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'Tất cả' || field.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group by availability
  const availableFields = filteredFields.filter(f => f.available);
  const unavailableFields = filteredFields.filter(f => !f.available);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tất cả sân bóng</Text>
        <Text style={styles.headerSubtitle}>
          {filteredFields.length} sân có sẵn
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm sân hoặc cụm sân..."
            onFilterPress={handleFilterPress}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Fields */}
        {availableFields.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Sân còn trống
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{availableFields.length}</Text>
              </View>
            </View>
            
            {availableFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() => handleFieldPress(field)}
                showCluster={true}
              />
            ))}
          </View>
        )}

        {/* Unavailable Fields */}
        {unavailableFields.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Sân đã đặt
              </Text>
              <View style={[styles.badge, styles.badgeGray]}>
                <Text style={[styles.badgeText, styles.badgeTextGray]}>
                  {unavailableFields.length}
                </Text>
              </View>
            </View>
            
            {unavailableFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() => handleFieldPress(field)}
                showCluster={true}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredFields.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>😔</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy sân</Text>
            <Text style={styles.emptySubtitle}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginBottom: 16,
  },
  searchWrapper: {
    marginTop: 8,
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  badgeGray: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextGray: {
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
