import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
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

  iconButton: {
    marginLeft: 16,
  },
});