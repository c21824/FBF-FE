import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ClusterData {
  id: string;
  name: string;
  address: string;
  fieldCount: number;
  rating: number;
  image: string;
  distance?: string;
}

interface ClusterCardProps {
  cluster: ClusterData;
  onPress?: () => void;
}

export const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.clusterCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: cluster.image }} 
        style={styles.clusterImage}
      />
      <View style={styles.overlay} />
      <View style={styles.clusterContent}>
        <View style={styles.clusterHeader}>
          <Text style={styles.clusterName}>{cluster.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>{cluster.rating}</Text>
          </View>
        </View>
        
        <View style={styles.clusterDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color="#FFFFFF" />
            <Text style={styles.detailText}>{cluster.address}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="football-outline" size={14} color="#FFFFFF" />
            <Text style={styles.detailText}>{cluster.fieldCount} fields</Text>
          </View>
          
          {cluster.distance && (
            <View style={styles.detailRow}>
              <Ionicons name="navigate-outline" size={14} color="#FFFFFF" />
              <Text style={styles.detailText}>{cluster.distance}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clusterCard: {
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  clusterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#E5E7EB',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  clusterContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  clusterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clusterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  clusterDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
