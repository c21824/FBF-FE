import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

interface PersonalInfoScreenProps {
  navigation: any;
}

export const PersonalInfoScreen = ({ navigation }: PersonalInfoScreenProps) => {
  const { user: authUser } = useAuth();

  // Mock user data theo đúng model: userId, fullName, phone, email, password, role, status, createdAt
  const userInfo = {
    userId: 1,
    fullName: authUser?.name || 'Nguyễn Văn Player',
    phone: '0901234567',
    email: authUser?.email || 'player@test.com',
    password: '••••••••',
    role: authUser?.role === 'player' ? 'Người chơi' : 'Chủ sân',
    status: 'Hoạt động',
    createdAt: '15/01/2024',
  };

  const infoFields = [
    {
      label: 'Họ và tên',
      value: userInfo.fullName,
      icon: 'person-outline',
      editable: true,
    },
    {
      label: 'Số điện thoại',
      value: userInfo.phone,
      icon: 'call-outline',
      editable: true,
    },
    {
      label: 'Email',
      value: userInfo.email,
      icon: 'mail-outline',
      editable: true,
    },
    {
      label: 'Mật khẩu',
      value: userInfo.password,
      icon: 'lock-closed-outline',
      editable: true,
    },
    {
      label: 'Vai trò',
      value: userInfo.role,
      icon: 'ribbon-outline',
      editable: false,
    },
    {
      label: 'Ngày tham gia',
      value: userInfo.createdAt,
      icon: 'calendar-outline',
      editable: false,
    },
  ];

  const handleEdit = () => {
    navigation.navigate('EditProfile', { userInfo });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <TouchableOpacity style={styles.editIconButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar & Name Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userInfo.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.bannerName}>{userInfo.fullName}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{userInfo.status}</Text>
          </View>
        </View>

        {/* Info Fields */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Chi tiết tài khoản</Text>

          {infoFields.map((field, index) => (
            <View
              key={index}
              style={[
                styles.fieldRow,
                index === infoFields.length - 1 && styles.fieldRowLast,
              ]}
            >
              <View style={styles.fieldIconContainer}>
                <Ionicons name={field.icon as any} size={20} color="#10B981" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text
                  style={[
                    styles.fieldValue,
                    (field as any).isStatus && styles.fieldValueActive,
                  ]}
                >
                  {field.value}
                </Text>
              </View>
              {!field.editable && (
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  editIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  bannerCard: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bannerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  fieldValueActive: {
    color: '#10B981',
  },
  lockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
