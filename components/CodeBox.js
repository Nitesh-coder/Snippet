import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { useTheme } from '../utils/themeContext';
import ThreeDot from '../utils/threeDots';
import { themes, processCodeLine } from '../utils/syntaxHighlighter';

const CodeBox = ({ 
  code = '// Write your code here...', 
  theme = 'light', 
  title = 'Code Snippet',
  language = 'JavaScript',
  onPress,
  style,
  maxHeight = 200,
  id,
  onEdit,
  onDelete,
  onExport,
  onShare,
  showActions = true
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const { isDarkMode, getThemeColors } = useTheme();
  const globalTheme = getThemeColors();
  
  // Determine which actions are available
  const hasEditAction = !!onEdit;
  const hasDeleteAction = !!onDelete;
  const hasExportAction = !!onExport;
  const hasShareAction = !!onShare;
  
  // Get the theme colors or default to light theme
  const themeColors = themes[theme] || themes.light;
  
  // Split code into lines for line numbers
  const codeLines = code.split('\n');
  
  // Function to apply syntax highlighting to a line of code
  const applySyntaxHighlighting = (line) => {
    const processedSegments = processCodeLine(line, language, themeColors);
    
    // Render the segments
    return (
      <Text style={styles.codeLine}>
        {processedSegments.map((segment, index) => (
          <Text key={index} style={segment.style}>{segment.text}</Text>
        ))}
      </Text>
    );
  };

  // Handle long press to show menu
  const handleLongPress = () => {
    if (showActions && (hasEditAction || hasShareAction || hasDeleteAction || hasExportAction)) {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Handle menu close
  const handleCloseMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  // Handle menu options
  const handleEdit = () => {
    handleCloseMenu();
    if (hasEditAction) {
      onEdit({
        id,
        code,
        language,
        theme,
        title
      });
    }
  };

  const handleExport = () => {
    handleCloseMenu();
    if (hasExportAction) {
      onExport({
        id,
        code,
        language,
        theme,
        title
      });
    }
  };

  const handleDelete = () => {
    handleCloseMenu();
    if (hasDeleteAction) {
      onDelete(id);
    }
  };

  const handleShare = () => {
    handleCloseMenu();
    if (hasShareAction) {
      onShare({
        id,
        code,
        language,
        theme,
        title
      });
    }
  };
  
  // Menu animation styles
  const menuScaleAnimation = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const menuOpacityAnimation = menuAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: themeColors.background }, style]}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      delayLongPress={500}
    >
      <View style={[styles.header, { borderBottomColor: globalTheme.borderColor }]}>
        <Text style={[styles.titleText, { color: themeColors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.languageTag, { color: themeColors.text }]}>{language}</Text>
          {showActions && (hasEditAction || hasShareAction || hasDeleteAction || hasExportAction) && (
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={handleLongPress}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <ThreeDot size={10} color={themeColors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView 
        style={[styles.codeContainer, { maxHeight }]}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.codeContent}>
          <View style={[styles.lineNumbers, { backgroundColor: themeColors.lineNumbersBg }]}>
            {codeLines.map((_, index) => (
              <Text key={index} style={[styles.lineNumber, { color: themeColors.lineNumbers }]}>
                {index + 1}
              </Text>
            ))}
          </View>
          
          <View style={styles.codeTextContainer}>
            {codeLines.map((line, index) => (
              <View key={index}>
                {applySyntaxHighlighting(line)}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Popup Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: globalTheme.modalOverlayColor }]} 
          activeOpacity={1} 
          onPress={handleCloseMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              {
                opacity: menuOpacityAnimation,
                transform: [{ scale: menuScaleAnimation }],
                backgroundColor: globalTheme.cardBackground
              }
            ]}
          >
            {hasEditAction && (
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Text style={styles.menuIcon}>✏️</Text>
                <Text style={[styles.menuText, { color: globalTheme.textColor }]}>Edit</Text>
              </TouchableOpacity>
            )}
            
            {hasExportAction && (
              <TouchableOpacity style={styles.menuItem} onPress={handleExport}>
                <Text style={styles.menuIcon}>📤</Text>
                <Text style={[styles.menuText, { color: globalTheme.textColor }]}>Export</Text>
              </TouchableOpacity>
            )}
            
            {hasShareAction && (
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <Text style={styles.menuIcon}>📢</Text>
                <Text style={[styles.menuText, { color: globalTheme.textColor }]}>Share</Text>
              </TouchableOpacity>
            )}
            
            {hasDeleteAction && (
              <TouchableOpacity style={[styles.menuItem, styles.deleteItem]} onPress={handleDelete}>
                <Text style={styles.menuIcon}>🗑️</Text>
                <Text style={[styles.menuText, styles.deleteText, { color: globalTheme.destructiveColor }]}>Delete</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  languageTag: {
    fontSize: 12,
    opacity: 0.7,
    marginRight: 8,
  },
  menuButton: {
    padding: 4,
  },
  codeContainer: {
    flex: 1,
  },
  codeContent: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  lineNumbers: {
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'flex-end',
  },
  lineNumber: {
    fontSize: 12,
    lineHeight: 20,
  },
  codeTextContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 12,
  },
  codeLine: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deleteItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  deleteText: {
    color: '#ff3b30',
  },
});

export default CodeBox; 