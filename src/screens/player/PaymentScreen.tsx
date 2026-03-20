import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServiceOrder {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
}

interface SlotPrice {
  slot: string;
  price: number;
}

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const DEPOSIT_AMOUNT = 100000; // Tiền cọc cố định 100k

const PAYMENT_METHODS = [
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Ví điện tử & ATM nội địa',
    logo: '💳',
    color: '#EE0033',
    bgColor: '#FFF0F3',
    borderColor: '#EE0033',
    recommended: true,
  },
  {
    id: 'momo',
    name: 'MoMo',
    description: 'Ví MoMo',
    logo: '💜',
    color: '#A50064',
    bgColor: '#FDF4FB',
    borderColor: '#A50064',
    recommended: false,
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    description: 'Tất cả ngân hàng nội địa',
    logo: '🏦',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#3B82F6',
    recommended: false,
  },
];

// Trạng thái modal thanh toán VNPay
type PaymentStep = 'idle' | 'connecting' | 'qr' | 'processing' | 'success' | 'failed';

export const PaymentScreen = ({ navigation, route }: PaymentScreenProps) => {
  const field = route.params?.field;
  const clusterName: string = route.params?.clusterName || '';
  const selectedSlot: SlotPrice = route.params?.selectedSlot;
  const services: ServiceOrder[] = route.params?.services || [];
  const total: number = route.params?.total || 0;
  const bookingDate: string = route.params?.bookingDate || '';

  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('idle');
  const [modalVisible, setModalVisible] = useState(false);

  const remaining = Math.max(0, total - DEPOSIT_AMOUNT);
  const activeServices = services.filter((s) => s.quantity > 0);

  // Animation cho loading spinner
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const startSpin = () => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startSuccessAnim = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePay = () => {
    setModalVisible(true);
    setPaymentStep('connecting');
    startSpin();

    // Giả lập kết nối VNPay
    setTimeout(() => {
      setPaymentStep('qr');
    }, 1800);
  };

  const handleConfirmQR = () => {
    setPaymentStep('processing');
    startSpin();
    setTimeout(() => {
      setPaymentStep('success');
      startSuccessAnim();
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    setModalVisible(false);
    setPaymentStep('idle');
    // Navigate về home hoặc màn lịch đặt
    navigation.reset({
      index: 0,
      routes: [{ name: 'PlayerTabs' }],
    });
  };

  const handlePaymentFailed = () => {
    setPaymentStep('idle');
    setModalVisible(false);
    Alert.alert('Thanh toán thất bại', 'Vui lòng thử lại hoặc chọn phương thức khác.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán cọc</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ===== Tóm tắt đơn đặt ===== */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={18} color="#10B981" />
            <Text style={styles.cardTitle}>Chi tiết đặt sân</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="football-outline" size={15} color="#6B7280" />
            <Text style={styles.infoLabel}>Sân</Text>
            <Text style={styles.infoValue}>{field?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={15} color="#6B7280" />
            <Text style={styles.infoLabel}>Cụm sân</Text>
            <Text style={styles.infoValue}>{clusterName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={15} color="#6B7280" />
            <Text style={styles.infoLabel}>Khung giờ</Text>
            <Text style={styles.infoValue}>{selectedSlot?.slot}</Text>
          </View>

          {activeServices.length > 0 && (
            <>
              <View style={styles.divider} />
              {activeServices.map((s) => (
                <View key={s.id} style={styles.infoRow}>
                  <Ionicons name="bag-outline" size={15} color="#6B7280" />
                  <Text style={styles.infoLabel}>{s.name}</Text>
                  <Text style={styles.infoValue}>
                    {s.quantity} {s.unit} × {s.pricePerUnit.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ===== Bảng chi phí ===== */}
        <View style={styles.costCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={18} color="#10B981" />
            <Text style={styles.cardTitle}>Tổng chi phí</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tiền sân</Text>
            <Text style={styles.costValue}>
              {(selectedSlot?.price || 0).toLocaleString('vi-VN')}đ
            </Text>
          </View>
          {activeServices.map((s) => (
            <View key={s.id} style={styles.costRow}>
              <Text style={styles.costLabel}>
                {s.name} × {s.quantity}
              </Text>
              <Text style={styles.costValue}>
                {(s.pricePerUnit * s.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
          <View style={styles.costDivider} />
          <View style={styles.costRow}>
            <Text style={styles.costTotalLabel}>Tổng cộng</Text>
            <Text style={styles.costTotalValue}>{total.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* ===== Tiền cọc ===== */}
        <View style={styles.depositCard}>
          <View style={styles.depositBadge}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#10B981" />
            <Text style={styles.depositBadgeText}>Thanh toán cọc giữ chỗ</Text>
          </View>

          <View style={styles.depositAmountRow}>
            <View>
              <Text style={styles.depositLabel}>Số tiền cần thanh toán ngay</Text>
              <Text style={styles.depositNote}>Cọc 100.000đ để giữ chỗ</Text>
            </View>
            <Text style={styles.depositAmount}>
              {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}đ
            </Text>
          </View>

          <View style={styles.remainingRow}>
            <Ionicons name="information-circle-outline" size={15} color="#6B7280" />
            <Text style={styles.remainingText}>
              Số tiền còn lại{' '}
              <Text style={styles.remainingAmount}>
                {remaining.toLocaleString('vi-VN')}đ
              </Text>{' '}
              thanh toán tại sân
            </Text>
          </View>
        </View>

        {/* ===== Phương thức thanh toán ===== */}
        <View style={styles.methodCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={18} color="#10B981" />
            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          </View>

          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  isSelected && { borderColor: method.borderColor, backgroundColor: method.bgColor },
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodLeft}>
                  <Text style={styles.methodLogo}>{method.logo}</Text>
                  <View>
                    <View style={styles.methodNameRow}>
                      <Text style={[styles.methodName, isSelected && { color: method.color }]}>
                        {method.name}
                      </Text>
                      {method.recommended && (
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedText}>Khuyến nghị</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.methodDesc}>{method.description}</Text>
                  </View>
                </View>
                <View style={[styles.radioOuter, isSelected && { borderColor: method.color }]}>
                  {isSelected && (
                    <View style={[styles.radioInner, { backgroundColor: method.color }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ===== Nút thanh toán ===== */}
        <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <Text style={styles.payBtnText}>
            Thanh toán {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}đ qua{' '}
            {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.secureNote}>
          🔒 Giao dịch được mã hoá SSL 256-bit. Thông tin thanh toán được bảo mật tuyệt đối.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ===== Modal VNPay ===== */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          if (paymentStep !== 'processing') {
            setModalVisible(false);
            setPaymentStep('idle');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>

            {/* ---- Đang kết nối ---- */}
            {paymentStep === 'connecting' && (
              <View style={styles.modalBody}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="sync-outline" size={52} color="#EE0033" />
                </Animated.View>
                <Text style={styles.modalTitle}>Đang kết nối VNPay...</Text>
                <Text style={styles.modalSub}>Vui lòng chờ trong giây lát</Text>
              </View>
            )}

            {/* ---- Quét QR ---- */}
            {paymentStep === 'qr' && (
              <View style={styles.modalBody}>
                {/* Header VNPay branded */}
                <View style={styles.vnpayHeader}>
                  <Text style={styles.vnpayLogo}>VN</Text>
                  <Text style={styles.vnpayLogoAccent}>PAY</Text>
                </View>

                {/* Fake QR code */}
                <View style={styles.qrBox}>
                  <View style={styles.qrGrid}>
                    {Array.from({ length: 81 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.qrCell,
                          {
                            backgroundColor:
                              Math.sin(i * 7 + 3) > 0 ? '#1F2937' : '#fff',
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.qrOverlay}>
                    <Text style={styles.qrAmount}>
                      {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}đ
                    </Text>
                    <Text style={styles.qrAmountLabel}>Quét để thanh toán</Text>
                  </View>
                </View>

                <Text style={styles.qrExpire}>⏱ Mã QR hết hạn sau 10:00</Text>

                {/* Nút giả lập đã thanh toán thành công */}
                <TouchableOpacity style={styles.confirmPayBtn} onPress={handleConfirmQR}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.confirmPayBtnText}>Tôi đã thanh toán</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelPayBtn}
                  onPress={() => {
                    setModalVisible(false);
                    setPaymentStep('idle');
                  }}
                >
                  <Text style={styles.cancelPayBtnText}>Huỷ thanh toán</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ---- Đang xử lý ---- */}
            {paymentStep === 'processing' && (
              <View style={styles.modalBody}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="sync-outline" size={52} color="#10B981" />
                </Animated.View>
                <Text style={styles.modalTitle}>Đang xác nhận thanh toán...</Text>
                <Text style={styles.modalSub}>Vui lòng không đóng ứng dụng</Text>
              </View>
            )}

            {/* ---- Thành công ---- */}
            {paymentStep === 'success' && (
              <View style={styles.modalBody}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <View style={styles.successCircle}>
                    <Ionicons name="checkmark" size={54} color="#fff" />
                  </View>
                </Animated.View>
                <Text style={styles.successTitle}>Thanh toán thành công!</Text>
                <Text style={styles.successSub}>
                  Đã đặt cọc{' '}
                  <Text style={styles.successHighlight}>
                    {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}đ
                  </Text>
                </Text>

                {/* Receipt mini */}
                <View style={styles.receipt}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Sân</Text>
                    <Text style={styles.receiptValue}>{field?.name}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Khung giờ</Text>
                    <Text style={styles.receiptValue}>{selectedSlot?.slot}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Đặt cọc</Text>
                    <Text style={[styles.receiptValue, { color: '#10B981', fontWeight: '700' }]}>
                      {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}đ ✓
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Còn lại tại sân</Text>
                    <Text style={styles.receiptValue}>{remaining.toLocaleString('vi-VN')}đ</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={handlePaymentSuccess}>
                  <Text style={styles.doneBtnText}>Về trang chủ</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  // Header
  header: {
    backgroundColor: '#10B981',
    paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },

  // Cards chung
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },

  // Summary card
  summaryCard: {
    backgroundColor: '#fff', margin: 16, marginBottom: 0,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 5,
  },
  infoLabel: { fontSize: 13, color: '#6B7280', width: 80 },
  infoValue: { fontSize: 13, color: '#1F2937', fontWeight: '600', flex: 1, textAlign: 'right' },

  // Cost card
  costCard: {
    backgroundColor: '#fff', margin: 16, marginBottom: 0,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  costLabel: { fontSize: 14, color: '#6B7280' },
  costValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  costDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  costTotalLabel: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  costTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },

  // Deposit card
  depositCard: {
    backgroundColor: '#ECFDF5', margin: 16, marginBottom: 0,
    borderRadius: 20, padding: 18,
    borderWidth: 1.5, borderColor: '#10B981',
  },
  depositBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
  },
  depositBadgeText: { fontSize: 15, fontWeight: '700', color: '#059669' },
  depositAmountRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  depositLabel: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  depositNote: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  depositAmount: { fontSize: 28, fontWeight: 'bold', color: '#10B981' },
  remainingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  remainingText: { fontSize: 12, color: '#6B7280', flex: 1, lineHeight: 18 },
  remainingAmount: { color: '#1F2937', fontWeight: '700' },

  // Method card
  methodCard: {
    backgroundColor: '#fff', margin: 16, marginBottom: 0,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  methodItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, marginBottom: 10,
  },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodLogo: { fontSize: 28 },
  methodNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  methodName: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  recommendedBadge: {
    backgroundColor: '#ECFDF5', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8,
  },
  recommendedText: { fontSize: 10, color: '#10B981', fontWeight: '700' },
  methodDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },

  // Pay button
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EE0033', marginHorizontal: 16, marginTop: 20,
    paddingVertical: 18, borderRadius: 16, gap: 10,
    shadowColor: '#EE0033', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  payBtnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  secureNote: {
    textAlign: 'center', fontSize: 11, color: '#9CA3AF',
    marginTop: 12, paddingHorizontal: 20, lineHeight: 17,
  },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 40, minHeight: 360,
  },
  modalBody: {
    alignItems: 'center', paddingTop: 32, paddingHorizontal: 24, paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginTop: 18, marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#9CA3AF' },

  // VNPay branding
  vnpayHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
  },
  vnpayLogo: {
    fontSize: 28, fontWeight: '900', color: '#EE0033',
    letterSpacing: -1,
  },
  vnpayLogoAccent: {
    fontSize: 28, fontWeight: '900', color: '#1F2937',
    letterSpacing: -1,
  },

  // QR code
  qrBox: {
    width: 200, height: 200, borderRadius: 16,
    borderWidth: 2, borderColor: '#EE0033',
    overflow: 'hidden', position: 'relative',
    justifyContent: 'center', alignItems: 'center',
  },
  qrGrid: {
    width: 200, height: 200,
    flexDirection: 'row', flexWrap: 'wrap',
    position: 'absolute',
  },
  qrCell: { width: 200 / 9, height: 200 / 9 },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  qrAmount: { fontSize: 20, fontWeight: 'bold', color: '#EE0033' },
  qrAmountLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  qrExpire: { fontSize: 12, color: '#9CA3AF', marginTop: 14, marginBottom: 20 },

  confirmPayBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 32, gap: 8, width: '100%', marginBottom: 10,
  },
  confirmPayBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cancelPayBtn: { paddingVertical: 10 },
  cancelPayBtnText: { fontSize: 14, color: '#9CA3AF' },

  // Success
  successCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 18 },
  successSub: { fontSize: 14, color: '#6B7280', marginTop: 6, marginBottom: 20 },
  successHighlight: { color: '#10B981', fontWeight: '700' },

  receipt: {
    width: '100%', backgroundColor: '#F9FAFB', borderRadius: 14,
    padding: 16, marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,
  },
  receiptLabel: { fontSize: 13, color: '#6B7280' },
  receiptValue: { fontSize: 13, color: '#1F2937', fontWeight: '500' },

  doneBtn: {
    backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 48, width: '100%', alignItems: 'center',
  },
  doneBtnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
