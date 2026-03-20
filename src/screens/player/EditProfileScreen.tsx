import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/CustomInput';
import { useAuth } from '../../context/AuthContext';

interface EditProfileScreenProps {
  navigation: any;
  route: any;
}

export const EditProfileScreen = ({ navigation, route }: EditProfileScreenProps) => {
  const { user: authUser } = useAuth();

  // Nhận dữ liệu hiện tại từ PersonalInfoScreen
  const currentInfo = route.params?.userInfo || {};

  // State form thông tin cơ bản
  const [fullName, setFullName] = useState(currentInfo.fullName || authUser?.name || '');
  const [phone, setPhone] = useState(currentInfo.phone || '');
  const [email, setEmail] = useState(currentInfo.email || authUser?.email || '');

  // State form đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State loading
  const [isSaving, setIsSaving] = useState(false);

  // Validate thông tin cơ bản
  const validateBasicInfo = (): string | null => {
    if (!fullName.trim()) return 'Vui lòng nhập họ và tên.';
    if (fullName.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.';
    if (!phone.trim()) return 'Vui lòng nhập số điện thoại.';
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(phone.trim())) return 'Số điện thoại không hợp lệ (VD: 0901234567).';
    if (!email.trim()) return 'Vui lòng nhập email.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Email không hợp lệ.';
    return null;
  };

  // Validate đổi mật khẩu (chỉ khi có nhập)
  const validatePassword = (): string | null => {
    if (!currentPassword && !newPassword && !confirmPassword) return null; // Không đổi mật khẩu
    if (!currentPassword) return 'Vui lòng nhập mật khẩu hiện tại.';
    if (!newPassword) return 'Vui lòng nhập mật khẩu mới.';
    if (newPassword.length < 6) return 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (newPassword !== confirmPassword) return 'Xác nhận mật khẩu không khớp.';
    if (currentPassword === newPassword) return 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    return null;
  };

  const handleSave = async () => {
    const basicError = validateBasicInfo();
    if (basicError) {
      Alert.alert('Lỗi', basicError);
      return;
    }

    const passError = validatePassword();
    if (passError) {
      Alert.alert('Lỗi', passError);
      return;
    }

    setIsSaving(true);
    // Giả lập gọi API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);

    Alert.alert(
      'Thành công',
      'Thông tin cá nhân đã được cập nhật!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const hasPasswordInput = currentPassword || newPassword || confirmPassword;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity
          style={[styles.saveIconButton, isSaving && styles.saveIconButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Avatar Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {fullName.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.bannerHint}>Chỉnh sửa thông tin bên dưới</Text>
        </View>

        {/* Form thông tin cơ bản */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          </View>

          <Text style={styles.fieldLabel}>Họ và tên</Text>
          <CustomInput
            icon="person-outline"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Số điện thoại</Text>
          <CustomInput
            icon="call-outline"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.fieldLabel}>Email</Text>
          <CustomInput
            icon="mail-outline"
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Form đổi mật khẩu */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
            <Text style={styles.optionalTag}>Không bắt buộc</Text>
          </View>

          <Text style={styles.fieldLabel}>Mật khẩu hiện tại</Text>
          <CustomInput
            icon="lock-closed-outline"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            isPassword
          />

          <Text style={styles.fieldLabel}>Mật khẩu mới</Text>
          <CustomInput
            icon="lock-open-outline"
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
          />

          <Text style={styles.fieldLabel}>Xác nhận mật khẩu mới</Text>
          <CustomInput
            icon="shield-checkmark-outline"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          {/* Indicator trạng thái match */}
          {newPassword.length > 0 && confirmPassword.length > 0 && (
            <View style={[
              styles.matchIndicator,
              newPassword === confirmPassword ? styles.matchIndicatorSuccess : styles.matchIndicatorError
            ]}>
              <Ionicons
                name={newPassword === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={newPassword === confirmPassword ? '#10B981' : '#EF4444'}
              />
              <Text style={[
                styles.matchText,
                newPassword === confirmPassword ? styles.matchTextSuccess : styles.matchTextError
              ]}>
                {newPassword === confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
              </Text>
            </View>
          )}
        </View>

        {/* Thông tin không thể chỉnh sửa */}
        <View style={styles.readonlyCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
            <Text style={styles.sectionTitleGray}>Thông tin hệ thống</Text>
          </View>
          <View style={styles.readonlyRow}>
            <Ionicons name="ribbon-outline" size={18} color="#9CA3AF" />
            <Text style={styles.readonlyLabel}>Vai trò:</Text>
            <Text style={styles.readonlyValue}>
              {authUser?.role === 'player' ? 'Người chơi' : 'Chủ sân'}
            </Text>
          </View>
          <View style={[styles.readonlyRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
            <Text style={styles.readonlyLabel}>Ngày tham gia:</Text>
            <Text style={styles.readonlyValue}>15/01/2024</Text>
          </View>
          <Text style={styles.readonlyNote}>
            * Các thông tin này do hệ thống quản lý, không thể chỉnh sửa.
          </Text>
        </View>

        {/* Nút Lưu */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Đang lưu...</Text>
            </>
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Nút Hủy */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIconButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  bannerCard: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bannerHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionTitleGray: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  optionalTag: {
    fontSize: 11,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 2,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: -8,
    marginBottom: 8,
  },
  matchIndicatorSuccess: {
    backgroundColor: '#ECFDF5',
  },
  matchIndicatorError: {
    backgroundColor: '#FEF2F2',
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
  },
  matchTextSuccess: {
    color: '#10B981',
  },
  matchTextError: {
    color: '#EF4444',
  },
  readonlyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  readonlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  readonlyLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  readonlyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  readonlyNote: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 10,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#6EE7B7',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
});
