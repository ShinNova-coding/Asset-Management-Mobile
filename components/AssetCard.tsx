import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

export default function AssetCard({ asset }: any) {
  return (
<TouchableOpacity
  style={styles.card}
  onPress={() =>
    router.push(`/asset/${asset.id}` as any)
  }
>
      <Image
        source={{ uri: asset.image }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {asset.name}
        </Text>

        <Text style={styles.category}>
          Category: {asset.category}
        </Text>

        <Text style={styles.condition}>
          Condition: {asset.condition}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  category: {
    color: "#666",
    marginTop: 5,
  },

  condition: {
    color: "#4F46E5",
    marginTop: 5,
  },
});