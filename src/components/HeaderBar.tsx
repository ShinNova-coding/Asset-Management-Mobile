import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface HeaderBarProps {
  title: string;
  showBackButton?: boolean;
  backButtonAction?: () => void;
  rightComponent?: React.ReactNode;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBackButton = true,
  backButtonAction,
  rightComponent,
}) => {
  const {colors, isDark} = useTheme()

  const handleBackPress = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      router.back();
    }
  };

  return (
    <ThemedView lightColor="#fff" darkColor="#0D3C47" style={[styles.container, {backgroundColor: colors.background, borderBottomColor: colors.background}]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.subText}
              darkColor="#fff"           
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <ThemedText
          darkColor="#fff"
          lightColor={colors.subText}
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </ThemedText>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    // color: "#4A4A4A",
    lineHeight: 38,
  },
  placeholder: {
    width: 24, 
  },
});

export default HeaderBar;
