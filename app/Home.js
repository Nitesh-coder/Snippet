import React, { memo, useCallback, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';
import Recent from '../components/Recent';
import Feature from '../components/Feature';

const { width } = Dimensions.get('window');

const SectionHeader = memo(({ title, actionText, onActionPress, textColor }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
    {actionText && (
      <TouchableOpacity onPress={onActionPress} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
));

const Home = () => {
  const navigation = useNavigation();
  const { width: windowWidth, height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const { isDarkMode, toggleDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  useFocusEffect(
    useCallback(() => {
      if (contentLoaded) return;
      
      const loadData = async () => {
        setContentLoaded(false);
        await new Promise(resolve => setTimeout(resolve, 300));
        setContentLoaded(true);
      };
      
      loadData();
    }, [contentLoaded])
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleViewAllRecent = useCallback(() => {
    navigation.navigate('Library');
  }, [navigation]);
  
  const handleViewAllThemes = useCallback(() => {
    // Could navigate to a themes gallery in the future
  }, []);
  
  const handleCreateNew = useCallback(() => {
    navigation.navigate('Create');
  }, [navigation]);
  
  const handleToggleTheme = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);
  
  const dynamicStyles = useMemo(() => ({
    welcomeCard: {
      margin: windowWidth > 600 ? 24 : 16,
      padding: windowWidth > 600 ? 30 : 20,
      backgroundColor: theme.cardBackground,
    },
    welcomeTitle: {
      fontSize: windowWidth > 600 ? 28 : 22,
      color: theme.textColor,
    },
    appTitle: {
      fontSize: windowWidth > 600 ? 28 : 24,
      color: theme.textColor,
    },
    welcomeSubtitle: {
      color: theme.secondaryTextColor,
    },
    container: {
      backgroundColor: theme.backgroundColor,
    },
    headerBackground: {
      backgroundColor: theme.headerBackground,
      borderBottomColor: theme.borderColor,
    },
    iconButton: {
      backgroundColor: theme.buttonBackground,
    }
  }), [windowWidth, theme]);

  if (!contentLoaded) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer, dynamicStyles.container]}>
        <ActivityIndicator size="large" color={theme.accentColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor={theme.statusBarBackgroundColor} 
      />
      
      <View style={[styles.header, dynamicStyles.headerBackground]}>
        <Text style={[styles.appTitle, dynamicStyles.appTitle]}>Code Editor</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.iconButton, dynamicStyles.iconButton]} 
            onPress={handleToggleTheme}
          >
            <Text style={styles.iconText}>{isDarkMode ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={[styles.scrollContainer, dynamicStyles.container]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.accentColor]}
            tintColor={theme.accentColor}
            progressBackgroundColor={theme.cardBackground}
          />
        }
      >
        <View style={[styles.welcomeCard, dynamicStyles.welcomeCard]}>
          <Text style={[styles.welcomeTitle, dynamicStyles.welcomeTitle]}>Welcome back!</Text>
          <Text style={[styles.welcomeSubtitle, dynamicStyles.welcomeSubtitle]}>Continue your coding journey</Text>
          <TouchableOpacity 
            style={styles.createNewButton}
            onPress={handleCreateNew}
            activeOpacity={0.8}
          >
            <Text style={styles.createNewButtonText}>Create New Code</Text>
          </TouchableOpacity>
        </View>
        
        <SectionHeader 
          title="Recent Code" 
          actionText="View All" 
          onActionPress={handleViewAllRecent} 
          textColor={theme.textColor}
        />
        <View style={styles.recentContainer}>
          <Recent />
        </View>
        
        <SectionHeader 
          title="Featured Themes" 
          actionText="Explore" 
          onActionPress={handleViewAllThemes}
          textColor={theme.textColor}
        />
        <View style={styles.featureContainer}>
          <Feature />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      }
    }),
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createNewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createNewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  recentContainer: {
    marginBottom: 20,
  },
  featureContainer: {
    marginBottom: 20,
  }
});

export default memo(Home); 