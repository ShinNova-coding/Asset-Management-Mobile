import { ScrollView, StyleSheet, View } from "react-native";
import SkeletonBox from "../skeletonBox";

export default function AssetsSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Title */}
      <SkeletonBox width={140} height={28} radius={6} />

      {/* Subtitle */}
      <View style={{ marginTop: 10 }}>
        <SkeletonBox width={250} height={14} radius={4} />
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <SkeletonBox width={"82%"} height={50} radius={16} />

        <SkeletonBox width={50} height={50} radius={16} />
      </View>

      {/* Asset Cards */}
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.assetCard}>
          {/* Image */}
          <SkeletonBox width={82} height={82} radius={18} />

          {/* Content */}
          <View style={styles.assetContent}>
            {/* Top Row */}
            <View style={styles.topRow}>
              <SkeletonBox width={"55%"} height={18} radius={5} />
              <SkeletonBox width={65} height={24} radius={20} />
            </View>

            {/* Serial */}
            <View style={{ marginTop: 10 }}>
              <SkeletonBox width={"45%"} height={14} radius={4} />
            </View>

            {/* Bottom */}
            <View style={styles.bottomRow}>
              <SkeletonBox width={90} height={14} radius={4} />
              <SkeletonBox width={22} height={22} radius={11} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },

  searchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },

  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 14,
    borderRadius: 24,
  },

  assetContent: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});