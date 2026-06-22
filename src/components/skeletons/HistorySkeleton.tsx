import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SkeletonBox from "../skeletonBox";

export default function HistorySkeleton() {
  const { colors } = useTheme();
  const placeholderItems = Array.from({ length: 6 });

  return (
    <View style={styles.content}>
      {placeholderItems.map((_, index) => (
        <View 
          key={index} 
          style={[styles.activityCard, { backgroundColor: colors.card, marginBottom: 10 }]}
        >
         
          <SkeletonBox width={58} height={58} radius={18} />
          
          <View style={[styles.activityContent, { gap: 6 }]}>
            <SkeletonBox width="50%" height={16} radius={4} />
            <SkeletonBox width="60%" height={15} radius={4} />
            <SkeletonBox width="30%" height={13} radius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  activityContent: {
    flex: 1,
    marginLeft: 14,
  },
  
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
  },

} )