import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { ClusterCard, ClusterData } from '../../components/ClusterCard';

export const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - sau này sẽ fetch từ API
  const clusters: ClusterData[] = [
    {
      id: '1',
      name: 'District 1 Sports Complex',
      address: 'Le Duan Street, District 1, HCMC',
      fieldCount: 5,
      rating: 4.8,
      image: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Complex+1',
      distance: '2.5 km',
    },
    {
      id: '2',
      name: 'Tan Binh Stadium Complex',
      address: 'Tan Binh District, HCMC',
      fieldCount: 8,
      rating: 4.9,
      image: 'https://via.placeholder.com/400x200/059669/FFFFFF?text=Complex+2',
      distance: '3.2 km',
    },
    {
      id: '3',
      name: 'Phu Nhuan Football Fields',
      address: 'Phu Nhuan District, HCMC',
      fieldCount: 4,
      rating: 4.7,
      image: 'https://via.placeholder.com/400x200/047857/FFFFFF?text=Complex+3',
      distance: '1.8 km',
    },
    {
      id: '4',
      name: 'Royal Football Complex',
      address: 'District 7, HCMC',
      fieldCount: 12,
      rating: 4.9,
      image: 'https://via.placeholder.com/400x200/065F46/FFFFFF?text=Complex+4',
      distance: '5.1 km',
    },
  ];

  const handleClusterPress = (cluster: ClusterData) => {
    // TODO: Navigate to cluster detail screen
    console.log('Cluster pressed:', cluster.name);
  };

  const handleFilterPress = () => {
    // TODO: Show filter modal
    console.log('Filter pressed');
  };

  const filteredClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.headerTitle}>Choose Field Complex</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for complexes..."
          onFilterPress={handleFilterPress}
        />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="business" size={24} color="#10B981" />
            <Text style={styles.statNumber}>{clusters.length}</Text>
            <Text style={styles.statLabel}>Complexes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="football" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>
              {clusters.reduce((sum, c) => sum + c.fieldCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Fields</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>
              {(clusters.reduce((sum, c) => sum + c.rating, 0) / clusters.length).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Clusters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Nearby Complexes
            </Text>
            <View style={styles.resultCount}>
              <Text style={styles.resultText}>
                {filteredClusters.length} results
              </Text>
            </View>
          </View>
          
          {filteredClusters.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No complexes found</Text>
              <Text style={styles.emptySubtext}>Try different search keywords</Text>
            </View>
          ) : (
            filteredClusters.map((cluster) => (
              <ClusterCard
                key={cluster.id}
                cluster={cluster}
                onPress={() => handleClusterPress(cluster)}
              />
            ))
          )}
        </View>

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#D1FAE5',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultCount: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
