import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const {colors, isDark} = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card,borderBottomColor:colors.background }]}>

      <View style={styles.leftSection}>

        <View>
          <Ionicons
            name="menu"
            size={23}
            color="#0070EB"
          />
        </View>

        <Text style={styles.logo}>
          ITAMS
        </Text>

      </View>

      <View style={styles.rightSection}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: isDark
                    ? "#1E293B"
                    : "#EEF4FF",
                },
              ]}
              onPress={() =>
                router.push("/(main)/history")
              }
            >
              <Ionicons
                name="time-outline"
                size={22}
                color="#0070EB"
              />
            </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    // borderBottomColor: "#EEE",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop:30
  },

  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0070EB",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  // iconButton: {
  //   marginLeft: 16,
  // },

  iconButton: {
  width: 35,
  height: 35,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 35,
},
});