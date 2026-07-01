import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import SkeletonBox from "../skeletonBox";

export default function ExpenseSkeleton() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBox width={180} height={26} radius={8} />
        <SkeletonBox width={40} height={40} radius={10} />
      </View>

      {/* Search */}
      <View style={{ marginBottom: 18 }}>
        <SkeletonBox width="100%" height={46} radius={12} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <SkeletonBox width={90} height={12} />
          <View style={{ height: 10 }} />
          <SkeletonBox width={130} height={24} />
          <View style={{ height: 12 }} />
          <SkeletonBox width={100} height={12} />
        </View>

        <View style={styles.statCard}>
          <SkeletonBox width={90} height={12} />
          <View style={{ height: 10 }} />
          <SkeletonBox width={130} height={24} />
          <View style={{ height: 12 }} />
          <SkeletonBox width={100} height={12} />
        </View>
      </View>

      {/* Expense Cards */}
      {Array.from({ length: 5 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.expenseCard,
            { backgroundColor: colors.card },
          ]}
        >
          <SkeletonBox width={48} height={48} radius={14} />

          <View style={styles.content}>
            <SkeletonBox width="60%" height={16} />
            <View style={{ height: 8 }} />

            <SkeletonBox width="35%" height={12} />
            <View style={{ height: 10 }} />

            <SkeletonBox width="45%" height={18} />
            <View style={{ height: 10 }} />

            <SkeletonBox width={80} height={22} radius={12} />
          </View>

          <SkeletonBox width={18} height={18} radius={9} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    marginTop: 18,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsContainer: {
    gap: 14,
    marginBottom: 20,
  },

  statCard: {
    padding: 16,
    borderRadius: 14,
  },

  expenseCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },
});