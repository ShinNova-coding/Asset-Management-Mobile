import { ScrollView, StyleSheet, View } from "react-native";
import SkeletonBox from "../skeletonBox";

export default function NotiSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Title */}
      <SkeletonBox width={180} height={26} radius={6} />

      {/* Subtitle */}
      <View style={{ marginTop: 8, marginBottom: 20 }}>
        <SkeletonBox width={240} height={14} radius={4} />
      </View>

      {/* Sections */}
      {[1, 2, 3].map((section) => (
        <View key={section} style={{ marginBottom: 20 }}>

          {/* Section Header */}
          <SkeletonBox width={120} height={16} radius={4} />

          {/* Cards */}
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.card}>

              {/* Icon */}
              <SkeletonBox width={46} height={46} radius={23} />

              {/* Content */}
              <View style={styles.content}>
                {/* Title Row */}
                <View style={styles.row}>
                  <SkeletonBox width={"60%"} height={16} radius={4} />
                  <SkeletonBox width={40} height={12} radius={4} />
                </View>

                {/* Message */}
                <View style={{ marginTop: 8 }}>
                  <SkeletonBox width={"90%"} height={14} radius={4} />
                </View>
              </View>

            </View>
          ))}
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  card: {
    flexDirection: "row",
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});