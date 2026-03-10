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

export const FieldListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', '5-a-side', '7-a-side', '11-a-side'];

  // Mock data - sau này sẽ fetch từ API
  const allFields: FieldData[] = [
    {
      id: '1',
      name: 'City Football Field 1',
      address: 'Le Duan St, District 1',
      price: '$15/hour',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Field+1',
      type: '7-a-side',
      available: true,
      clusterName: 'District 1 Sports Complex',
    },
    {
      id: '2',
      name: 'Mini Stadium A',
      address: 'Tan Binh District',
      price: '$12/hour',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Field+2',
      type: '5-a-side',
      available: true,
      clusterName: 'Tan Binh Stadium Complex',
    },
    {
      id: '3',
      name: 'Royal Football Field',
      address: 'District 7',
      price: '$25/hour',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=Field+3',
      type: '11-a-side',
      available: false,
      clusterName: 'Royal Football Complex',
    },
    {
      id: '4',
      name: 'Sunshine Field',
      address: 'Phu Nhuan District',
      price: '$14/hour',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=Field+4',
      type: '7-a-side',
      available: true,
      clusterName: 'Phu Nhuan Football Fields',
    },
    {
      id: '5',
      name: 'City Field 2',
      address: 'Nguyen Van Linh St, Dist 1',
      price: '$16/hour',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Field+5',
      type: '7-a-side',
      available: true,
      clusterName: 'District 1 Sports Complex',
    },
    {
      id: '6',
      name: 'Mini Field B',
      address: 'Tan Binh District',
      price: '$11/hour',
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Field+6',
      type: '5-a-side',
      available: true,
      clusterName: 'Tan Binh Stadium Complex',
    },
    {
      id: '7',
      name: 'Professional Field 1',
      address: 'District 7',
      price: '$28/hour',
      rating: 5.0,
      image: 'https://via.placeholder.com/300x200/047857/FFFFFF?text=Field+7',
      type: '11-a-side',
      available: true,
      clusterName: 'Royal Football Complex',
    },
    {
      id: '8',
      name: 'Sunshine Field 2',
      address: 'Phu Nhuan District',
      price: '$13/hour',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/065F46/FFFFFF?text=Field+8',
      type: '5-a-side',
      available: false,
      clusterName: 'Phu Nhuan Football Fields',
    },
  ];

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleFieldPress = (field: FieldData) => {
    console.log('Field pressed:', field.name);
    // TODO: Navigate to field detail
  };

  // Filter logic
  const filteredFields = allFields.filter((field) => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.clusterName && field.clusterName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || field.type === selectedCategory;
    
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
        <Text style={styles.headerTitle}>All Football Fields</Text>
        <Text style={styles.headerSubtitle}>
          {filteredFields.length} fields available
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search fields or complexes..."
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
                Available Fields
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
                Booked Fields
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
            <Text style={styles.emptyTitle}>No fields found</Text>
            <Text style={styles.emptySubtitle}>
              Try changing filters or search keywords
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
