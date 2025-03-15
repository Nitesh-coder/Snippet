import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList, Alert, Share, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';
import CodeBox from './CodeBox';
import { getSavedCodes } from '../utils/storage';

// Sample code snippets
const sampleCodes = {
  javascript: 
`// JavaScript Example
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120`,

  python: 
`# Python Example
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fibonacci(10))  # 55`,

  java: 
`// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};

const Recent = () => {
  // Get the navigation object from context
  const navigation = useNavigation();
  const { isDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  const screenWidth = Dimensions.get('window').width;
  const boxWidth = screenWidth * 0.8; // 80% of screen width
  
  // State for recent saved codes
  const [recentCodes, setRecentCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load saved codes when component mounts
  useEffect(() => {
    loadRecentCodes();
  }, []);
  
  // Function to load recent saved codes
  const loadRecentCodes = async () => {
    try {
      const allCodes = await getSavedCodes();
      // Sort by most recent first and take only 3 items
      const recent = allCodes
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 3);
      setRecentCodes(recent);
    } catch (error) {
      console.error('Error loading recent codes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for edit action
  const handleEdit = (codeItem) => {
    navigation.navigate('Create', {
      editMode: true,
      codeData: codeItem
    });
  };

  // Handler for share action only (delete and export removed)
  const handleShare = async (codeItem) => {
    try {
      await Share.share({
        message: `${codeItem.title}\n\n${codeItem.code}\n\nShared from Code Editor`,
        title: codeItem.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share code');
    }
  };

  // If no saved codes, use sample codes
  const renderSampleCodes = () => {
    // Sample code snippets (existing code)
    const sampleCodes = {
      javascript: 
    `// JavaScript Example
    function factorial(n) {
      if (n <= 1) return 1;
      return n * factorial(n - 1);
    }
    
    console.log(factorial(5)); // 120`,
    
      python: 
    `# Python Example
    def fibonacci(n):
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a
    
    print(fibonacci(10))  # 55`,
    
      java: 
    `// Java Example
    public class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }`
    };
    
    // Convert sample codes to array for FlatList
    return Object.keys(sampleCodes).map(key => ({
      id: key,
      language: key.charAt(0).toUpperCase() + key.slice(1),
      code: sampleCodes[key],
      theme: key === 'javascript' ? 'light' : 
             key === 'python' ? 'dark' : 'darcula',
      title: key.charAt(0).toUpperCase() + key.slice(1) + ' Example',
      isSample: true
    }));
  };

  // Display loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.accentColor} style={{ margin: 20 }} />
      </View>
    );
  }

  // Decide which data to display
  const displayData = recentCodes.length > 0 ? recentCodes : renderSampleCodes();

  // Render a single code box item
  const renderItem = ({ item, index }) => (
    <View style={[styles.slideItem, { width: boxWidth }]}>
      <CodeBox 
        id={item.id}
        code={item.code} 
        theme={item.theme || 'light'} 
        language={item.language}
        title={item.title} 
        style={styles.codeBox}
        onEdit={handleEdit}
        onShare={handleShare}
        // Remove onDelete and onExport props
        showActions={true}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={boxWidth + 16} // Box width + margin
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.sliderContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  sliderContent: {
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
  slideItem: {
    marginHorizontal: 8,
  },
  codeBox: {
    width: '100%',
    height: 200,
  },
});

export default Recent; 