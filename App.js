import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';
import Create from './app/Create';
import Library from './app/Library';
import { navigationRef } from './utils/navigation';
import { ThemeProvider, useTheme } from './utils/themeContext';

// Create the stack navigator
const Stack = createStackNavigator();

// Custom tab bar component that accepts navigation as a prop
const CustomTabBar = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const { isDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  // Handle navigation
  const navigateTo = (screenName) => {
    setCurrentScreen(screenName);
    navigation.navigate(screenName);
  };
  
  return (
    <View style={[styles.tabBarContainer, { 
      backgroundColor: theme.cardBackground,
      borderTopColor: theme.borderColor
    }]}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'Home' ? styles.activeTab : null]} 
          onPress={() => navigateTo('Home')}
        >
          <Text style={[
            styles.tabText, 
            { color: theme.secondaryTextColor },
            currentScreen === 'Home' ? { color: theme.accentColor, fontWeight: 'bold' } : null
          ]}>Home</Text>
        </TouchableOpacity>
        
        <View style={styles.createButtonContainer}>
          <TouchableOpacity 
            style={[styles.createButton, { 
              backgroundColor: theme.cardBackground,
              shadowColor: theme.borderColor
            }]} 
            onPress={() => navigateTo('Create')}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'Library' ? styles.activeTab : null]} 
          onPress={() => navigateTo('Library')}
        >
          <Text style={[
            styles.tabText, 
            { color: theme.secondaryTextColor },
            currentScreen === 'Library' ? { color: theme.accentColor, fontWeight: 'bold' } : null
          ]}>Library</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Wrapper component for the app content with navigation
const MainContent = ({ setTabBarVisible }) => {
  const navigation = useNavigation();
  const [tabBarVisible, setTabBarVisibleState] = useState(true);
  const { isDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  // Sync the tabBarVisible state with the parent
  useEffect(() => {
    setTabBarVisible(tabBarVisible);
  }, [tabBarVisible, setTabBarVisible]);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.backgroundColor }
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Create">
            {props => <Create {...props} setTabBarVisible={setTabBarVisibleState} />}
          </Stack.Screen>
          <Stack.Screen name="Library" component={Library} />
        </Stack.Navigator>
      </View>
      
      {tabBarVisible && <CustomTabBar navigation={navigation} />}
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
};

// Main application component
export default function App() {
  const [tabBarVisible, setTabBarVisible] = useState(true);

  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <MainContent setTabBarVisible={setTabBarVisible} />
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 36,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'relative',
    height: 50,
    borderTopWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
  },
  createButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    width: 80,
  },
  createButton: {
    position: 'absolute',
    top: -20,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createButtonText: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
  },
});
