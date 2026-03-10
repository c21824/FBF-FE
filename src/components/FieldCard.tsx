import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FieldData {
  id: string;
  name: string;
  address: string;
  price: string;
  rating: number;
  image: string;
  type: string;
  available: boolean;
  clusterName?: string;
}

interface FieldCardProps {
  field: FieldData;
  onPress?: () => void;
  showCluster?: boolean;
}

export const FieldCard: React.FC<FieldCardProps> = ({ 
  field, 
  onPress,
  showCluster = false 
}) => {
  return (
    <TouchableOpacity 
      style={styles.fieldCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: field.image }} 
        style={styles.fieldImage}
      />
      {!field.available && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Booked</Text>
        </View>
      )}
      <View style={styles.fieldInfo}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>{field.rating}</Text>
          </View>
        </View>
        
        <View style={styles.fieldDetails}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.address}>{field.address}</Text>
        </View>
        
        {showCluster && field.clusterName && (
          <View style={styles.clusterRow}>
            <Ionicons name="business-outline" size={14} color="#10B981" />
            <Text style={styles.clusterText}>{field.clusterName}</Text>
          </View>
        )}
        
        <View style={styles.fieldFooter}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{field.type}</Text>
          </View>
          <Text style={styles.price}>{field.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fieldCard: {
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
  fieldImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unavailableText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fieldInfo: {
    padding: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fieldDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  clusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  clusterText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  fieldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
});
