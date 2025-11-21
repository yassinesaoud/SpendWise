/**
 * App Navigator
 * Main navigation setup with stack and bottom tabs
 */

import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';

// Auth Screens
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

// Main Screens
import BillsScreen from '../screens/bills/BillsScreen';
import BudgetScreen from '../screens/budget/BudgetScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import ExpenseDetailsScreen from '../screens/expenses/ExpenseDetailsScreen';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import MoreScreen from '../screens/MoreScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import StatisticsScreen from '../screens/statistics/StatisticsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import BankSyncScreen from '../screens/sync/BankSyncScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseListScreen}
        options={{
          tabBarLabel: 'Dépenses',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Statistiques',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'Plus',
          tabBarIcon: ({ color, size }) => (
            <Feather name="more-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Bills" component={BillsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="BankSync" component={BankSyncScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  // TODO: Implement actual authentication check
  // For now, allow navigation to Main for testing
  // In production, check AsyncStorage or auth state
  const [isAuthenticated] = React.useState(false);

  // Debug: Log navigation setup
  React.useEffect(() => {
    console.log('✅ AppNavigator mounted');
    console.log('✅ WelcomeScreen:', typeof WelcomeScreen);
  }, []);

  try {
    return (
      <NavigationContainer 
        onReady={() => {
          console.log('✅ NavigationContainer ready');
          console.log('✅ App should be visible now!');
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Main" component={MainStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('❌❌❌ CRITICAL ERROR in AppNavigator:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.text}>Navigation Error</Text>
        <Text style={errorStyles.subtext}>{error.message}</Text>
        <Text style={errorStyles.subtext}>Check console for details</Text>
      </View>
    );
  }
};

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AppNavigator;

