import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const assets = [
  {
    id: 1,
    name: "MacBook Pro 16",
    category: "Laptop",
    status: "Assigned",
    condition: "Excellent",
  },

  {
    id: 2,
    name: "Dell UltraSharp 27",
    category: "Display",
    status: "Assigned",
    condition: "Good",
  },

  {
    id: 3,
    name: "iPhone 15 Pro",
    category: "Mobile",
    status: "Repair",
    condition: "Damaged",
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.header}>
        Hello, Alex!
      </Text>

      <Text style={styles.subheader}>
        Here is your hardware inventory overview.
      </Text>

      {/* Stats */}
      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>TOTAL</Text>
          <Text style={styles.statNumber}>4</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>REPAIR</Text>
          <Text style={styles.statNumber}>1</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>ACTIVE</Text>
          <Text style={styles.statNumber}>3</Text>
        </View>

      </View>

      <Text style={styles.sectionTitle}>
        My Assets
      </Text>

      <FlatList
        data={assets}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.assetCard}>
            <Text style={styles.assetName}>
              {item.name}
            </Text>

            <Text>
              Category: {item.category}
            </Text>

            <Text>
              Status: {item.status}
            </Text>

            <Text>
              Condition: {item.condition}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    padding: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
  },

  subheader: {
    color: "#666",
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    backgroundColor: "white",
    width: "30%",
    padding: 18,
    borderRadius: 16,
  },

  statTitle: {
    color: "#666",
    fontSize: 12,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  assetCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },

  assetName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});