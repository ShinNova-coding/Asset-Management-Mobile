import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExpenseDetailScreen() {
  const { colors } = useTheme();

  const { expense } = useLocalSearchParams();

  const data = expense
    ? JSON.parse(expense as string)
    : null;

  if (!data) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>
          Expense not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
<HeaderBar title="Expense Details" backButtonAction={()=> router.back()}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.subText },
            ]}
          >
            TITLE
          </Text>

          <Text
            style={[
              styles.value,
              { color: colors.text },
            ]}
          >
            {data.title}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.subText },
            ]}
          >
            AMOUNT
          </Text>

          <Text style={styles.amount}>
            {Number(data.cost).toLocaleString()} MMK
          </Text>
        </View>

        {/* Status + Type */}

        <View style={styles.row}>
          <View
            style={[
              styles.halfCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: colors.subText },
              ]}
            >
              STATUS
            </Text>

            <View
              style={[
                styles.statusBadge,
                data.status === "requested"
                  ? styles.badgeRequested
                  : data.status === "approved"
                  ? styles.badgeApproved
                  : styles.badgeRejected,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  data.status === "requested"
                    ? styles.textRequested
                    : data.status === "approved"
                    ? styles.textApproved
                    : styles.textRejected,
                ]}
              >
                {data.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.halfCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: colors.subText },
              ]}
            >
              TYPE
            </Text>

            <Text
              style={[
                styles.value,
                { color: colors.text },
              ]}
            >
              {data.expense_type}
            </Text>
          </View>
        </View>

        {/* Date */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.subText },
            ]}
          >
            EXPENSE DATE
          </Text>

          <Text
            style={[
              styles.value,
              { color: colors.text },
            ]}
          >
            {dayjs(data.expense_date).format(
              "DD MMM YYYY"
            )}
          </Text>
        </View>

        {/* Description */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.subText },
            ]}
          >
            DESCRIPTION
          </Text>

          <Text
            style={[
              styles.description,
              { color: colors.text },
            ]}
          >
            {data.description || "No description"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  voucherImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  halfCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
  },

  amount: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1E62C9",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeRequested: {
    backgroundColor: "#FFF7E6",
  },

  badgeApproved: {
    backgroundColor: "#E6F4EA",
  },

  badgeRejected: {
    backgroundColor: "#FDECEC",
  },

  statusText: {
    fontWeight: "700",
    fontSize: 12,
  },

  textRequested: {
    color: "#B25E25",
  },

  textApproved: {
    color: "#137333",
  },

  textRejected: {
    color: "#D93025",
  },
});