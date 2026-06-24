import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types matching your backend data structure requirement
interface ExpenseItem {
  id: string;
  title: string;
  expense_date: string;
  expense_type: string;
  cost: string;
  status: 'requested' | 'approved' | 'rejected';
  icon: keyof typeof MaterialIcons.glyphMap;
}

export default function ExpenseHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data representing the exact items shown in image_7ca17d.jpg
  const expenseData: ExpenseItem[] = [
    {
      id: '1',
      title: 'Claim form for taxi fee',
      expense_date: '2026-02-02',
      expense_type: 'Claim',
      cost: '1,000,000 LAK',
      status: 'requested',
      icon: 'directions-car',
    },
    {
      id: '2',
      title: 'License renewal for IDE',
      expense_date: '2026-01-28',
      expense_type: 'Purchase',
      cost: '4,250,000 LAK',
      status: 'approved',
      icon: 'image',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header View */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="archive" size={24} color="#1E62C9" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Expense Requests</Text>
        </View>
        
        {/* Navigation Action to Form View */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/requestExpense')}
        >
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stat Cards Container */}
        <View style={styles.statsContainer}>
          {/* Card 1: Total Pending */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL PENDING</Text>
            <Text style={styles.statAmount}>2,450,000 LAK</Text>
            <Text style={[styles.statFooter, { color: '#1E62C9' }]}>3 Active Claims</Text>
          </View>

          {/* Card 2: Approved */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>APPROVED (THIS MONTH)</Text>
            <Text style={styles.statAmount}>15,200,000 LAK</Text>
            <Text style={[styles.statFooter, { color: '#B25E25' }]}>Budget Remaining: 45%</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Feather name="search" size={20} color="#6C757D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search claims..."
            placeholderTextColor="#8A92A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={16} color="#333" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>

        {/* Expense Requests List */}
        <View style={styles.listContainer}>
          {expenseData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listItem}>
              <View style={styles.itemMainRow}>
                {/* Icon Wrapper */}
                <View style={styles.iconWrapper}>
                  <MaterialIcons name={item.icon} size={22} color="#1E62C9" />
                </View>

                {/* Meta details */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDate}>{item.expense_date}</Text>
                  
                  <View style={styles.tagWrapper}>
                    <Text style={styles.tagText}>{item.expense_type}</Text>
                  </View>

                  <Text style={styles.itemCost}>{item.cost}</Text>

                  {/* Dynamic Badges Based on Backend Status Key */}
                  <View style={[
                    styles.statusBadge, 
                    item.status === 'requested' ? styles.badgeRequested : styles.badgeApproved
                  ]}>
                    <Text style={[
                      styles.statusText,
                      item.status === 'requested' ? styles.textRequested : styles.textApproved
                    ]}>
                      {item.status === 'requested' ? 'Requested' : 'Approved'}
                    </Text>
                  </View>
                </View>

                {/* Right Chevron */}
                <View style={styles.chevronWrapper}>
                  <Feather name="chevron-right" size={20} color="#333" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
    padding: 16,
  },
  itemMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
});