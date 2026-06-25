import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { requestExpense } from "@/src/services/expense.service";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useIsOnline from "../../utils/useIsOnline";

export default function NewExpenseScreen() {
 
    const { colors } = useTheme();
    const [title, setTitle] = useState("");
    const [cost, setCost] = useState("");
    const [description, setDescription] = useState("");
    const [voucher, setVoucher] = useState<string | null>(null);
    const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isOnline = useIsOnline();

    const pickVoucher = async () => {

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                "Permission required",
                "Please allow photo access."
                );
                return;
            }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.6,
            base64: true,
        });

        if (!result.canceled) {

            setVoucher(result.assets[0].base64!);

            setVoucherPreview(result.assets[0].uri);
        }
    };

      const handleSubmit = async () => {

        if (!isOnline) {
          Alert.alert(
            "No Internet Connection",
            "You must be online to submit an expense request."
          );
          return;
        }

        try{

            if (!title.trim()) {
            Alert.alert("Title is required");
            return;
            }

            if (!cost) {
            Alert.alert("Cost is required");
            return;
            }

            if (!description.trim()) {
            Alert.alert(
                "Description required",
                "Please explain the purpose of this expense."
            );
            return;
            }

            if (!voucher) {
            Alert.alert("Please upload voucher image");
            return;
            }

            setLoading(true);

            const payload = {
              status:"requested",
              cost:Number(cost.replace(/,/g,"")),
              expense_date:dayjs().format("YYYY-M-D"),
              title,
              expense_type:"claim",
              description,
              voucher,
            };

            const response = await requestExpense(payload);

            Alert.alert(
              "Success",
              response.message
            );

            router.back();

        }catch(error){

            console.log(error);

            Alert.alert(
              "Error",
              "Unable to submit expense request."
            );

        }finally{
            setLoading(false);
        }
    };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <HeaderBar title="Expenses" backButtonAction={()=> router.back()}/>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.infoBox, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <MaterialIcons name="info" size={20} color="#1E62C9" style={styles.infoIcon} />
            <Text style={[styles.infoText, {color: colors.subText}]}>
              Please provide accurate details for your expense claim. Ensure your receipt clearly shows the vendor name, date, and total amount.
            </Text>
          </View>

          <View style={[styles.formCard, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label,{color: colors.text}]}>EXPENSE TITLE</Text>
              <TextInput
                style={[styles.input,{color: colors.text,backgroundColor: colors.background, borderColor: colors.border}]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter expense title"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label,{color: colors.text}]}>TOTAL COST</Text>
              <View style={[styles.costInputWrapper,{backgroundColor: colors.background, borderColor: colors.border}]}>
                <Text style={[styles.currencyPrefix,{color: colors.subText}]}>MMK</Text>
                <TextInput
                  style={[styles.costInput,{color: colors.text}]}
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label,{color: colors.text}]}>DESCRIPTION / PURPOSE</Text>
              <TextInput
                style={[styles.textArea,{backgroundColor: colors.background, color: colors.text, borderColor: colors.border}]}
                value={description}
                onChangeText={setDescription}
                placeholder="Briefly explain the nature of this expense..."
                placeholderTextColor="#A0AEC0"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={[styles.voucherSection, {backgroundColor: colors.card, borderColor: colors.border}]}>
            {voucherPreview ? (
                <>
                <Image
                    source={{ uri: voucherPreview }}
                    style={styles.receiptImage}
                />

                <TouchableOpacity
                    style={[styles.uploadContainer, {backgroundColor: colors.background}]}
                    onPress={pickVoucher}
                >
                    <Feather
                    name="upload-cloud"
                    size={32}
                    color={colors.primary}
                    />

                    <Text style= { [{color: colors.text}]}>Change Receipt Image</Text>
                </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity
                style={[styles.uploadContainer, {backgroundColor: colors.background}]}
                onPress={pickVoucher}
                >
                <Feather
                    name="upload-cloud"
                    size={32}
                    color={colors.primary}
                />

                <Text style= { [{color: colors.text}]}>Upload Receipt Image</Text>

                <Text style={{ color: "#999", marginTop: 5 }}>
                    JPG, PNG (Max 5MB)
                </Text>
                </TouchableOpacity>
            )}
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
            style={[styles.submitButton, (loading || !isOnline) && {opacity: 0.6}]}
            disabled={loading}
            onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>
                {loading ? "Submitting..."
                  : "Submit Request"}
                </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECEF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E62C9',
  },
  headerRightSpacer: {
    width: 32, // Perfect symmetrical balancing element
  },
  scrollContent: {
    padding: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F4FA',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D2E3FC',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFF1F3',
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 15,
    color: '#2D3748',
    backgroundColor: '#FFF',
  },
  costInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 40,
  },
  currencyPrefix: {
    fontSize: 15,
    color: '#718096',
    marginRight: 8,
  },
  costInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    height: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2D3748',
    backgroundColor: '#FFF',
    height: 100,
  },
  voucherSection: {
    backgroundColor: '#F4F7FC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  voucherLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  uploadIcon: {
    marginBottom: 8,
  },

  footerActions: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#1E62C9',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  receiptImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    resizeMode: "cover",
},
});