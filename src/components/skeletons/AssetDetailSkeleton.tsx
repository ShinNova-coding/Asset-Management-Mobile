import { ScrollView, StyleSheet, View } from "react-native";
import SkeletonBox from "../skeletonBox";

export default function AssetDetailSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Image Card */}
      <View style={styles.imageCard}>
        <SkeletonBox width={"100%"} height={200} radius={18} />

        <View style={{ marginTop: 16 }}>
          <SkeletonBox width={"60%"} height={26} radius={6} />
        </View>

        <View style={{ marginTop: 10 }}>
          <SkeletonBox width={"40%"} height={16} radius={4} />
        </View>

        <View style={styles.badgeRow}>
          <SkeletonBox width={90} height={28} radius={12} />
          <SkeletonBox width={120} height={28} radius={12} />
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <SkeletonBox width={"70%"} height={12} radius={4} />
          <View style={{ marginTop: 8 }}>
            <SkeletonBox width={"90%"} height={16} radius={6} />
          </View>
        </View>

        <View style={styles.infoBox}>
          <SkeletonBox width={"70%"} height={12} radius={4} />
          <View style={{ marginTop: 8 }}>
            <SkeletonBox width={"90%"} height={16} radius={6} />
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={{ marginTop: 20 }}>
        <SkeletonBox width={"100%"} height={50} radius={16} />
        <View style={{ marginTop: 12 }}>
          <SkeletonBox width={"100%"} height={50} radius={16} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  imageCard: {
    marginBottom: 20,
  },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  infoBox: {
    width: "48%",
  },
});