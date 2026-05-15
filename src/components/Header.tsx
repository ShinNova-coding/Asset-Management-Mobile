import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const {colors, isDark} = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card,borderBottomColor:colors.background }]}>

      {/* Left Side */}
      <View style={styles.leftSection}>

        <View>
          <Ionicons
            name="menu"
            size={24}
            color="#5B4BFF"
          />
        </View>

        <Text style={styles.logo}>
          ITAMS
        </Text>

      </View>

      {/* Right Side */}
      <View style={styles.rightSection}>

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
    fontSize: 28,
    fontWeight: "bold",
    color: "#5B4BFF",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginLeft: 16,
  },
});