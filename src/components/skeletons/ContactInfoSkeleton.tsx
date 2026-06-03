import { ScrollView, StyleSheet, View } from "react-native";
import SkeletonBox from "../skeletonBox";

export default function ContactInfoSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <SkeletonBox
          width={90}
          height={90}
          radius={45}
        />

        <View style={{ marginTop: 14 }}>
          <SkeletonBox
            width={180}
            height={24}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <SkeletonBox
            width={120}
            height={14}
          />
        </View>

        <View style={styles.badgeRow}>
          <SkeletonBox
            width={90}
            height={28}
            radius={8}
          />

          <SkeletonBox
            width={90}
            height={28}
            radius={8}
          />
        </View>
      </View>

      {/* Work Information Card */}
      <View style={styles.card}>
        <SkeletonBox
          width={150}
          height={20}
        />

        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={styles.infoRow}
          >
            <SkeletonBox
              width={90}
              height={14}
            />

            <SkeletonBox
              width={120}
              height={14}
            />
          </View>
        ))}
      </View>

      {/* Contact Details Card */}
      <View style={styles.card}>
        <SkeletonBox
          width={140}
          height={20}
        />

        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={styles.infoRow}
          >
            <SkeletonBox
              width={110}
              height={14}
            />

            <SkeletonBox
              width={140}
              height={14}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
});