import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SkeletonBox from "../skeletonBox";

export default function DashboardSkeleton() {
  const { isDark } = useTheme();

  const baseColor = isDark ? "#334155" : "#E5E7EB";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <SkeletonBox width={180} height={32} radius={8} />

      {/* Stats */}
      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.statCard,
              { backgroundColor: baseColor },
            ]}
          >
            <SkeletonBox width={50} height={12} />
            <View style={{ marginTop: 12 }}>
              <SkeletonBox width={35} height={22} />
            </View>
          </View>
        ))}
      </View>

      {/* Title */}
      <SkeletonBox width={140} height={24} radius={6} />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={{ marginRight: 10 }}>
            <SkeletonBox width={80} height={38} radius={20} />
          </View>
        ))}
      </ScrollView>

      {/* Grid */}
      <View style={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.assetCard}>
            <SkeletonBox width={"100%"} height={120} radius={18} />

            <View style={{ marginTop: 12 }}>
              <SkeletonBox width={"80%"} height={16} />
            </View>

            <View style={styles.badgesRow}>
              <SkeletonBox width={65} height={24} radius={20} />
              <SkeletonBox width={75} height={24} radius={20} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },

  statCard: {
    width: "31%",
    height: 90,
    borderRadius: 18,
    padding: 16,
  },

  categoriesContainer: {
    paddingVertical: 14,
    paddingRight: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  assetCard: {
    width: "48%",
    marginBottom: 12,
  },

  badgesRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});