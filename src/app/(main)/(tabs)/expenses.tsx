import { getExpenses } from '@/src/services/expense.service';
import { Expense } from '@/src/types/expense.type';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from "dayjs";
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExpenseHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredExpenses = expenses.filter(item =>
  item.title.toLowerCase()
    .includes(searchQuery.toLowerCase())
);

  useEffect(() => {
    fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
    try {
        setLoading(true);

        const data = await getExpenses();
         console.log("EXPENSES ===>", data);

        setExpenses(data);

    } catch (error) {
        console.log("GET EXPENSE ERROR", error);
    } finally {
        setLoading(false);
    }
    };

        const pendingExpenses = expenses.filter(
            item => item.status === "requested"
        );

        const approvedExpenses = expenses.filter(
            item => item.status === "approved"
        );

        const pendingCost = pendingExpenses.reduce(
            (sum, item) => sum + item.cost,
            0
        );

        const approvedCost = approvedExpenses.reduce(
            (sum, item) => sum + item.cost,
            0
        );

        const pendingCount = pendingExpenses.length;

        const approvedCount = approvedExpenses.length;

        const renderExpenseItem = ({ item }: { item: Expense }) => (
  <TouchableOpacity style={styles.listItem}>
    <View style={styles.itemMainRow}>

      {/* icon */}
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name="receipt-long"
          size={22}
          color="#1E62C9"
        />
      </View>

      {/* details */}
      <View style={styles.itemDetails}>

        <Text style={styles.itemTitle}>
          {item.title}
        </Text>

        <Text style={styles.itemDate}>
          {dayjs(item.expense_date).format("DD MMM YYYY")}
        </Text>

        <Text
          numberOfLines={2}
          style={styles.description}
        >
          {item.description}
        </Text>

        <View style={styles.tagWrapper}>
          <Text style={styles.tagText}>
            {item.expense_type}
          </Text>
        </View>

        <Text style={styles.itemCost}>
          {item.cost.toLocaleString()} MMK
        </Text>

        <View
          style={[
            styles.statusBadge,
            item.status === "requested"
              ? styles.badgeRequested
              : item.status === "approved"
              ? styles.badgeApproved
              : styles.badgeRejected
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "requested"
                ? styles.textRequested
                : item.status === "approved"
                ? styles.textApproved
                : styles.textRejected
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

      </View>

      <Feather
        name="chevron-right"
        size={20}
        color="#999"
      />

    </View>
  </TouchableOpacity>
);

const listHeader = useMemo(
  () => (
    <>
      <View style={styles.statsContainer}>
        ...
      </View>

      <View style={styles.searchSection}>
        <Feather
          name="search"
          size={20}
          color="#6C757D"
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search claims..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </>
  ),
  [
    pendingCost,
    pendingCount,
    approvedCost,
    approvedCount,
    searchQuery
  ]
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="archive" size={24} color="#1E62C9" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Expense Requests</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/requestExpense')}
        >
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
<FlatList
  data={filteredExpenses}
  keyExtractor={(item) => item.id}
  renderItem={renderExpenseItem}
  ListHeaderComponent={listHeader}
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={
    !loading ? (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="receipt-outline"
          size={70}
          color="#B0B0B0"
        />

        <Text style={styles.emptyTitle}>
          No expense requests
        </Text>

        <Text style={styles.emptyText}>
          Tap + to create one
        </Text>
      </View>
    ) : null
  }
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECEF',
    marginTop: -50
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E62C9',
  },
  addButton: {
    backgroundColor: '#1E62C9',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFF1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C757D',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },
  statFooter: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF1F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E5E9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFF1F3',
    overflow: 'hidden',
  },
listItem: {
  backgroundColor: "#FFF",
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.05,
  shadowRadius: 4,

  elevation: 2
},
  itemMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 10,
  },
  tagWrapper: {
    backgroundColor: '#EAECEF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
  },
  itemCost: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  description:{
    color:"#6C757D",
    marginBottom:10,
    fontSize:13
},
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeRequested: {
    backgroundColor: '#FFF7E6',
  },
  badgeApproved: {
    backgroundColor: '#E6F4EA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textRequested: {
    color: '#B25E25',
  },
  textApproved: {
    color: '#137333',
  },
  chevronWrapper: {
    justifyContent: 'center',
    height: '100%',
    paddingLeft: 8,
    alignSelf: 'center',
  },
  badgeRejected:{
    backgroundColor:"#FDECEC"
},

textRejected:{
    color:"#D93025"
},
emptyContainer:{
 alignItems:"center",
 marginTop:80
},

emptyTitle:{
 marginTop:16,
 fontSize:18,
 fontWeight:"700"
},

emptyText:{
 color:"#888",
 marginTop:6
},
});