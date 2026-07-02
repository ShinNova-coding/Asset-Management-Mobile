import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistorySkeleton from "../../components/skeletons/HistorySkeleton";
import { getAssignmentHistory, getMaintenanceHistory } from "../../services/history.service";
import useIsOnline from "../../utils/useIsOnline";

type Activity = {
  id: string;
  type: "assignment" | "return" | "maintenance";
  title: string;
  asset: string;
  isDeleted: boolean;
  rawDate: string;
  date: string;
};

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useIsOnline();

  useEffect(() => {
  loadHistory();
}, []);

const loadHistory = async () => {
  try {
    setLoading(true);

    const history = await getAssignmentHistory();
    const repairHistory = await getMaintenanceHistory();

    const assignmentActivities = history.map((item: any) => ({
        id: item.id.toString(),

        type:
          item.status === "returned"
            ? "return"
            : "assignment",

        title:
          item.status === "returned"
            ? "Returned Asset"
            : "Asset Assigned",

        asset: item.asset?.name?? "Deleted Asset",

        isDeleted: item.asset == null,

        rawDate:
        item.status === "returned"
      ? item.returned_date
      : item.assigned_date,

        date:
          item.status === "returned"
            ? dayjs(item.returned_date).format("DD MMM YYYY")
            : dayjs(item.assigned_date).format("DD MMM YYYY"),
      }));

      const maintenanceActivities = repairHistory.map((item: any) => ({
        id: `maintenance-${item.id}`,
        type: "maintenance",
        title: "Asset Maintenance",
        asset: item.asset?.name ?? item.name ?? "Unknown Asset",
        isDeleted: false,
        rawDate: item.updated_at,
        date: dayjs(item.updated_at).format("DD MMM YYYY, h:mm A"),
      }));

        const allActivities = [
            ...assignmentActivities,
            ...maintenanceActivities,
          ].sort(
            (a, b) =>
              dayjs(b.rawDate).valueOf() -
              dayjs(a.rawDate).valueOf()
          );

    setActivities(allActivities);

  } catch (error) {
    console.log("HISTORY ERROR:",error);
  } finally {
    setLoading(false);
  }
};

// if (!activities.length) {
//   return (
//     <View style={styles.emptyContainer}>
//       <Ionicons
//         name="time-outline"
//         size={70}
//         color="#9CA3AF"
//       />

//       <Text>
//         No activity history found
//       </Text>
//     </View>
//   );
// }

  if (!isOnline) {
   return (
     <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
     >
      <HeaderBar
        title="History"
        backButtonAction={() => router.back()}
      />

      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text }]}>
          Recent Activities
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Track your recent asset actions and requests.
        </Text>
      </View>
      <View
        style={[styles.emptyContainer,{ backgroundColor: colors.background } ]}
       >
            <Ionicons
              name="cloud-offline-outline"
              size={80}
              color={colors.subText}
            />
  
            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text }
              ]}
            >
              No Internet Connection
            </Text>
  
            <Text
              style={[
                styles.emptySubtitle,
                { color: colors.subText }
              ]}
            >
              Please check your internet connection and try again.
            </Text>
          </View>
          </SafeAreaView>
        )
     };

  const getActivityStyle = (type: string) => {
    switch (type) {
      case "return":
        return {
          icon: "return-up-back-outline",
          bg: "#FFF7ED",
          iconColor: "#F97316",
        };

      case "assignment":
        return {
          icon: "cube-outline",
          bg: "#EEF4FF",
          iconColor: "#0070EB",
        };

      case "maintenance":
        return {
          icon: "warning-outline",
          bg: "#FEF2F2",
          iconColor: "#EF4444",
        };

      default:
        return {
          icon: "time-outline",
          bg: "#F3F4F6",
          iconColor: "#6B7280",
        };
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <HeaderBar
        title="History"
        backButtonAction={() => router.back()}
      />

     <View style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text }]}>
          Recent Activities
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Track your recent asset actions and requests.
        </Text>
      </View>

      {loading ? (
        <HistorySkeleton />
      ) : !activities.length ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={70} color="#9CA3AF" />
          <Text style={{ color: colors.subText, marginTop: 10 }}>
            No activity history found
          </Text>
        </View>
      ) : (

        <FlatList
          data={activities}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 15,
          }}
          renderItem={({ item }) => {
            const activityStyle =
              getActivityStyle(item.type);

            return (
              <View
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        activityStyle.bg,
                    },
                  ]}
                >
                  <Ionicons
                    name={activityStyle.icon as any}
                    size={24}
                    color={
                      activityStyle.iconColor
                    }
                  />
                </View>

                <View style={styles.activityContent}>
                  <Text
                    style={[
                      styles.activityTitle,
                      { color: colors.text },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.assetName,
                      { color: item.isDeleted? "#EF4444" : "#1E62C9", fontStyle: item.isDeleted? "italic" : "normal" },
                    ]}
                  >
                    {item.asset}
                  </Text>

                  <Text style={styles.timeText}>
                    {item.date}
                  </Text>
                </View>
              </View>
            );
          }}
        />)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
headerSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    paddingBottom: 12,
    marginTop: 6,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  activityContent: {
    flex: 1,
    marginLeft: 14,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  assetName: {
    fontSize: 15.6,
    marginTop: 5,
    fontWeight: "500",
  },

  timeText: {
    marginTop: 8,
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 30,
},
emptyTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 12,
},

emptySubtitle: {
  fontSize: 14,
  textAlign: "center",
  marginTop: 6,
},
});