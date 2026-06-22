import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SkeletonBox from "../skeletonBox";

export default function DashboardSkeleton() {
  const { colors } = useTheme(); // Use context colors directly for precise theme matching

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Profile Header Lineup Placeholder */}
      <View style={styles.profileHeader}>
        <SkeletonBox width={42} height={42} radius={21} />
        <View style={{ flex: 1, gap: 5 }}>
          <SkeletonBox width={130} height={12} radius={4} />
          <SkeletonBox width={100} height={18} radius={4} />
          <SkeletonBox width={80} height={12} radius={4} />
        </View>
      </View>

      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.statCard,
              { backgroundColor: colors.card }, // Matches real card background color context
            ]}
          >
            <SkeletonBox width={45} height={12} radius={4} />
            <View style={{ marginTop: 10 }}>
              <SkeletonBox width={30} height={20} radius={4} />
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginBottom: 12 }}>
        <SkeletonBox width={150} height={22} radius={6} />
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]} />
        <View style={[styles.filterButton, { backgroundColor: colors.card }]} />
      </View>

      <View style={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.assetGridCard, { backgroundColor: colors.card }]}>
            <SkeletonBox width={150} height={120} radius={18} />

            <View style={{ marginTop: 10, marginBottom: 12 }}>
              <SkeletonBox width={150} height={15} radius={4} />
            </View>

            <View style={styles.assetInfoRow}>
              <SkeletonBox width={35} height={21} radius={30} />
              <SkeletonBox width={55} height={21} radius={30} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 15,
  },
  statCard: {
    width: "31%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center", // Align skeleton text layers cleanly to the center
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    height: 50,
    borderRadius: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    marginLeft: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  assetGridCard: {
    width: "48%",
    borderRadius: 22,
    padding: 10,
    marginBottom: 10,
  },
  assetInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});