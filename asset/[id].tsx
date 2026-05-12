import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { mockAssets } from "@/data/mockAssets";
import { useLocalSearchParams } from "expo-router";

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams();

  const asset = mockAssets.find(
    (item) => item.id.toString() === id
  );

  if (!asset) {
    return (
      <View style={styles.container}>
        <Text>Asset not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: asset.image }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {asset.name}
      </Text>

      <Text style={styles.info}>
        Category: {asset.category}
      </Text>

      <Text style={styles.info}>
        Status: {asset.status}
      </Text>

      <Text style={styles.info}>
        Condition: {asset.condition}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
  },

  info: {
    marginTop: 10,
    fontSize: 18,
    color: "#666",
  },
});