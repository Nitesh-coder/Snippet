import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Dimensions,
  Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';
import CodeBox from '../components/CodeBox';
import { getSavedCodes, deleteCode } from '../utils/storage';

const Library = () => {
  const navigation = useNavigation();
  const { isDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  const [savedCodes, setSavedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  
  const screenWidth = Dimensions.get('window').width;
  const boxWidth = (screenWidth - 48) / 2; // 48 = padding and margins for grid view
  const tileWidth = screenWidth * 0.9; // 90% of screen width for tile view
  
  // Load saved codes when component mounts
  useEffect(() => {
    loadSavedCodes();
  }, []);
  
  // Function to load saved codes from storage
  const loadSavedCodes = async () => {
    setLoading(true);
    try {
      const codes = await getSavedCodes();
      setSavedCodes(codes);
    } catch (error) {
      console.error('Error loading saved codes:', error);
      Alert.alert('Error', 'Failed to load your saved code snippets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadSavedCodes();
  };
  
  // Handle edit
  const handleEdit = (codeItem) => {
    // Navigate to Create screen with params
    if (navigation) {
      navigation.navigate('Create', { 
        editMode: true,
        codeData: codeItem
      });
    }
  };
  
  const handleDelete = async (id) => {
    try {
      // Ask for confirmation
      Alert.alert(
        'Delete Code',
        'Are you sure you want to delete this code snippet?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const success = await deleteCode(id);
              if (success) {
                // Update the list
                setSavedCodes(savedCodes.filter(code => code.id !== id));
                Alert.alert('Success', 'Code snippet deleted successfully.');
              } else {
                Alert.alert('Error', 'Failed to delete code snippet.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting code:', error);
      Alert.alert('Error', 'An error occurred while deleting the code snippet.');
    }
  };
  
  const handleExport = (codeItem) => {
    Alert.alert('Export Options', 'Choose export format', [
      { text: 'Text File (.txt)', onPress: () => Alert.alert('Exported', 'Code exported as text file') },
      { text: 'Source File', onPress: () => {
        const extension = getFileExtension(codeItem.language);
        Alert.alert('Exported', `Code exported as ${extension} file`);
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };
  
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
  
  const getFileExtension = (language) => {
    const extensions = {
      'Python': '.py',
      'Java': '.java',
      'C': '.c',
      'C++': '.cpp',
      'Rust': '.rs',
      'JavaScript': '.js',
      'Dart': '.dart'
    };
    return extensions[language] || '.txt';
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'tile' : 'grid');
  };
  
  // Render a code item in grid mode
  const renderGridItem = ({ item }) => (
    <View style={styles.gridItemContainer}>
      <CodeBox
        id={item.id}
        code={item.code}
        theme={item.theme || 'light'}
        title={item.title}
        language={item.language}
        style={styles.gridCodeBox}
        maxHeight={200}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onShare={handleShare}
      />
    </View>
  );
  
  // Render a code item in tile mode (like Recent.js)
  const renderTileItem = ({ item }) => (
    <View style={[styles.tileItemContainer, { width: tileWidth }]}>
      <CodeBox
        id={item.id}
        code={item.code}
        theme={item.theme || 'light'}
        title={item.title}
        language={item.language}
        style={styles.tileCodeBox}
        maxHeight={200}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onShare={handleShare}
      />
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.secondaryTextColor }]}>No saved code snippets yet</Text>
      <Text style={[styles.emptySubtext, { color: theme.secondaryTextColor }]}>
        Your saved code snippets will appear here.
      </Text>
    </View>
  );

  // Render the appropriate list based on view mode
  const renderContent = () => {
    if (loading && !refreshing) {
      return <ActivityIndicator size="large" color={theme.accentColor} style={styles.loader} />;
    }
    
    if (viewMode === 'grid') {
      return (
        <FlatList
          key="grid"
          data={savedCodes}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.gridContent}
          numColumns={2}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      );
    } else {
      return (
        <FlatList
          key="tile"
          data={savedCodes}
          renderItem={renderTileItem}
          keyExtractor={item => item.id}
          horizontal={false}
          numColumns={1}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.tileContent}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: theme.headerBackground }]}>
        <Text style={[styles.header, { color: theme.textColor }]}>My Code Library</Text>
        <TouchableOpacity 
          style={[styles.viewToggleButton, { backgroundColor: theme.buttonBackground }]} 
          onPress={toggleViewMode}
        >
          <Text style={[styles.viewToggleText, { color: theme.accentColor }]}>
            {viewMode === 'grid' ? '🔄 Tile View' : '🔄 Grid View'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
    paddingVertical: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  viewToggleButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  viewToggleText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  gridContent: {
    paddingBottom: 20,
  },
  tileContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  gridItemContainer: {
    width: '47%',
    margin: '1.5%',
  },
  tileItemContainer: {
    marginVertical: 8,
  },
  gridCodeBox: {
    width: '100%',
    height: 200,
  },
  tileCodeBox: {
    width: '100%',
    height: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loader: {
    marginTop: 10,
  },
});

export default Library; 