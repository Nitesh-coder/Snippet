import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Switch,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  Keyboard,
  Share,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';
import { getFormatter, formatEntireCode } from '../utils/codeFormatter';
import { saveCode } from '../utils/storage';
import { themes, processCodeLine } from '../utils/syntaxHighlighter';
import ThreeDot from '../utils/threeDots';

const Create = ({ setTabBarVisible }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode, getThemeColors } = useTheme();
  const globalTheme = getThemeColors();
  
  // Check if we're in edit mode
  const editMode = route?.params?.editMode || false;
  const existingCode = route?.params?.codeData || null;
  
  // Initialize state with edited code if available
  const [code, setCode] = useState(existingCode ? existingCode.code : '');
  const [lineNumbers, setLineNumbers] = useState(['1']);
  const [selectedLanguage, setSelectedLanguage] = useState(
    existingCode ? existingCode.language : 'JavaScript'
  );
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    existingCode ? existingCode.theme : (isDarkMode ? 'dark' : 'light')
  );
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [codeTitle, setCodeTitle] = useState(
    existingCode ? existingCode.title : 'Untitled Code'
  );
  const [showTitleInput, setShowTitleInput] = useState(false);
  const editorRef = useRef(null);
  
  const languages = ['Python', 'Java', 'C', 'C++', 'Rust', 'JavaScript', 'Dart'];
  // Available theme names
  const themeNames = Object.keys(themes);

  // Set up initial line numbers
  useEffect(() => {
    if (code) {
      const lines = code.split('\n');
      const newLineNumbers = Array.from({ length: lines.length }, (_, i) => (i + 1).toString());
      setLineNumbers(newLineNumbers);
    }
  }, []);

  // Set up keyboard listeners to hide/show tab bar
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (setTabBarVisible) setTabBarVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (setTabBarVisible) setTabBarVisible(true);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [setTabBarVisible]);

  // Enhanced handleCodeChange function with live formatting for all languages
  const handleCodeChange = (text) => {
    // Get the appropriate formatter for the selected language
    const formatter = getFormatter(selectedLanguage);
    
    // Check if a new line was added
    const oldLines = code.split('\n');
    const newLines = text.split('\n');
    const isNewLine = newLines.length > oldLines.length;
    
    // Format the code using the language-specific formatter
    const formattedText = formatter(code, text, isNewLine);
    
    // Update the code state
    setCode(formattedText);
    
    // Update line numbers
    const lines = formattedText.split('\n');
    const newLineNumbers = Array.from({ length: lines.length }, (_, i) => (i + 1).toString());
    setLineNumbers(newLineNumbers);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  const selectTheme = (theme) => {
    setSelectedTheme(theme);
    setShowThemeModal(false);
  };

  // Enhanced handleSave function to handle edit mode
  const handleSave = async () => {
    if (code.trim() === '') {
      Alert.alert('Error', 'Cannot save empty code. Please write some code first.');
      return;
    }
    
    // Ask for title if not already set and not in edit mode
    if (codeTitle === 'Untitled Code' && !editMode) {
      setShowTitleInput(true);
      return;
    }
    
    // Prepare the code data
    const codeData = {
      code,
      language: selectedLanguage,
      title: codeTitle,
      theme: selectedTheme,
      // If we're editing, keep the original ID
      ...(existingCode && { id: existingCode.id })
    };
    
    // Save to storage
    const success = await saveCode(codeData);
    
    if (success) {
      Alert.alert(
        'Saved Successfully', 
        `Your code "${codeTitle}" has been saved to your library.`,
        [
          { 
            text: 'View Library', 
            onPress: () => navigation.navigate('Library') 
          },
          { 
            text: 'OK', 
            style: 'default' 
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save code. Please try again.');
    }
  };

  // Function to save code with the entered title
  const saveWithTitle = async (title) => {
    setCodeTitle(title);
    setShowTitleInput(false);
    
    // Prepare the code data
    const codeData = {
      code,
      language: selectedLanguage,
      title: title,
      theme: selectedTheme,
    };
    
    // Save to storage
    const success = await saveCode(codeData);
    
    if (success) {
      Alert.alert(
        'Saved Successfully', 
        `Your code "${title}" has been saved to your library.`,
        [
          { 
            text: 'View Library', 
            onPress: () => navigation.navigate('Library') 
          },
          { 
            text: 'OK', 
            style: 'default' 
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save code. Please try again.');
    }
  };

  const handleFormat = () => {
    try {
      const formattedCode = formatEntireCode(code, selectedLanguage);
      setCode(formattedCode);
      
      // Update line numbers for the formatted code
      const lines = formattedCode.split('\n');
      const newLineNumbers = Array.from({ length: lines.length }, (_, i) => (i + 1).toString());
      setLineNumbers(newLineNumbers);
      
      Alert.alert('Success', 'Code has been formatted');
    } catch (error) {
      Alert.alert('Error', `Failed to format code: ${error.message}`);
    }
  };

  const handleExport = () => {
    Alert.alert('Export Options', 'Choose export format', [
      { text: 'Text File (.txt)', onPress: () => Alert.alert('Exported', 'Code exported as text file') },
      { text: 'Source File', onPress: () => Alert.alert('Exported', `Code exported as ${getFileExtension(selectedLanguage)} file`) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleShare = () => {
    Alert.alert('Shared', 'Sharing options would appear here');
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
 
  // Get the current theme colors
  const themeColors = themes[selectedTheme] || themes.light;
  
  // Define custom theme for UI elements, using global theme as base
  const theme = {
    backgroundColor: globalTheme.backgroundColor,
    cardBackground: themeColors.background,
    headerBackground: globalTheme.headerBackground,
    textColor: themeColors.text,
    secondaryTextColor: globalTheme.secondaryTextColor,
    borderColor: globalTheme.borderColor,
    lineNumberBackground: themeColors.lineNumbersBg,
    buttonBackground: globalTheme.buttonBackground,
    selectedItemBackground: globalTheme.selectedItemBackground,
    selectedItemColor: globalTheme.selectedItemColor,
    modalOverlayColor: globalTheme.modalOverlayColor,
    switchTrackColor: globalTheme.switchTrackColor,
    switchThumbColor: globalTheme.switchThumbColor,
    placeholderTextColor: globalTheme.placeholderTextColor,
    accentColor: globalTheme.accentColor,
  };

  // Helper function to render syntax-highlighted text
  const renderHighlightedText = (line) => {
    const processedSegments = processCodeLine(line, selectedLanguage, themeColors);
    
    return (
      <Text style={styles.codeLine}>
        {processedSegments.map((segment, index) => (
          <Text key={index} style={segment.style}>{segment.text}</Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.fixedEditorWrapper}>
        <View style={[styles.editorContainer, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.editorHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.borderColor }]}>
            <ThreeDot size={16} />
            <View style={styles.selectorContainer}>
              <TouchableOpacity 
                style={[styles.themeSelector, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} 
                onPress={() => setShowThemeModal(true)}
              >
                <Text style={styles.themeIcon}>{themeColors.icon || '🎨'}</Text>
                <Text style={[styles.themeSelectorText, { color: theme.textColor }]}>{selectedTheme}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.languageSelector, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} 
                onPress={() => setShowLanguageModal(true)}
              >
                <Text style={[styles.languageText, { color: theme.textColor }]}>{selectedLanguage} ▼</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.editor} ref={editorRef}>
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContentContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.codeContainer}>
                <TextInput
                  style={[styles.codeInput]}
                  multiline
                  value={code}
                  onChangeText={handleCodeChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  textAlignVertical="top"
                  placeholder="Write your code here..."
                  placeholderTextColor={theme.placeholderTextColor}
                  keyboardAppearance={isDarkMode ? 'dark' : 'light'}
                />
                <View style={[styles.lineNumbersContainer, { backgroundColor: theme.lineNumberBackground }]} pointerEvents="none">
                  {lineNumbers.map((num, index) => (
                    <Text key={index} style={[styles.lineNumber, { color: theme.secondaryTextColor }]}>{num}</Text>
                  ))}
                </View>
                <View style={styles.highlightedCodeContainer} pointerEvents="none">
                  {code.split('\n').map((line, index) => (
                    <View key={index} style={styles.highlightedLine}>
                      {renderHighlightedText(line)}
                    </View>
                  ))}
                  {code === '' && (
                    <Text style={[styles.placeholder, { color: theme.placeholderTextColor }]}>
                      Write your code here...
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
          
          <View style={[styles.actionButtonsContainer, { backgroundColor: theme.headerBackground, borderTopColor: theme.borderColor }]}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} onPress={handleSave}>
              <View style={styles.buttonContent}>
                <Text style={styles.actionButtonIcon}>💾</Text>
                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>
                  {editMode ? 'Update' : 'Save'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} onPress={handleFormat}>
              <View style={styles.buttonContent}>
                <Text style={styles.actionButtonIcon}>🔠</Text>
                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Format</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} onPress={handleExport}>
              <View style={styles.buttonContent}>
                <Text style={styles.actionButtonIcon}>📤</Text>
                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Export</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBackground, borderColor: theme.borderColor }]} onPress={handleShare}>
              <View style={styles.buttonContent}>
                <Text style={styles.actionButtonIcon}>📢</Text>
                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlayColor }]} 
          activeOpacity={1} 
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageModalContainer}>
            <View style={[styles.languageModal, { backgroundColor: theme.cardBackground }]}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language && [styles.selectedLanguageOption, { backgroundColor: theme.selectedItemBackground }]
                  ]}
                  onPress={() => selectLanguage(language)}
                >
                  <Text 
                    style={[
                      styles.languageOptionText,
                      { color: theme.textColor },
                      selectedLanguage === language && [styles.selectedLanguageOptionText, { color: theme.selectedItemColor }]
                    ]}
                  >
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlayColor }]} 
          activeOpacity={1} 
          onPress={() => setShowThemeModal(false)}
        >
          <View style={styles.themeModalContainer}>
            <View style={[styles.themeModal, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.themeModalTitle, { color: theme.textColor }]}>
                Select Theme
              </Text>
              <View style={styles.themeGrid}>
                {themeNames.map((themeName) => (
                  <TouchableOpacity
                    key={themeName}
                    style={[
                      styles.themeOption,
                      { backgroundColor: themes[themeName].background },
                      selectedTheme === themeName && styles.selectedThemeOption
                    ]}
                    onPress={() => selectTheme(themeName)}
                  >
                    <Text style={styles.themeIcon}>
                      {themes[themeName].icon || '🎨'}
                    </Text>
                    <Text 
                      style={[
                        styles.themeOptionText,
                        { color: themes[themeName].text }
                      ]}
                      numberOfLines={1}
                    >
                      {themeName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Title Input Modal */}
      <Modal
        visible={showTitleInput}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTitleInput(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlayColor }]} 
          activeOpacity={1} 
          onPress={() => setShowTitleInput(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>
              Enter a title for your code
            </Text>
            <TextInput
              style={[styles.titleInput, { 
                color: theme.textColor,
                backgroundColor: theme.buttonBackground,
                borderColor: theme.borderColor
              }]}
              placeholder="Enter title..."
              placeholderTextColor={theme.placeholderTextColor}
              autoFocus={true}
              defaultValue=""
              onSubmitEditing={(e) => saveWithTitle(e.nativeEvent.text || 'Untitled Code')}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.buttonBackground }]} 
                onPress={() => setShowTitleInput(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.accentColor }]}
                onPress={(e) => saveWithTitle(e.nativeEvent.text || 'Untitled Code')}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fixedEditorWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.85,
    height: height * 0.6,
    marginLeft: -(width * 0.85) / 2,
    marginTop: -(height * 0.6) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  editor: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  codeContainer: {
    flexDirection: 'row',
    flex: 1,
    minHeight: '100%',
    width: '100%',
    alignItems: 'flex-start',
  },
  lineNumbersContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingTop: 8,
  },
  lineNumber: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  codeInput: {
    flex: 1,
    color: 'transparent',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingLeft: 48,
    paddingTop: 8,
    paddingRight: 8,
    lineHeight: 20,
    textAlignVertical: 'top',
    zIndex: 2,
    height: '100%',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '23%',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModalContainer: {
    width: width * 0.7,
    maxHeight: height * 0.6,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageModal: {
    padding: 8,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedLanguageOption: {
    backgroundColor: '#e6f2ff',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  languageSelector: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  highlightedCodeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingLeft: 48,
    paddingTop: 8,
    paddingRight: 8,
    zIndex: 1,
    height: '100%',
  },
  highlightedLine: {
    minHeight: 20,
    lineHeight: 20,
  },
  placeholder: {
    position: 'absolute',
    top: 8,
    left: 48,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeLine: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  themeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  themeSelectorText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  themeModalContainer: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeModal: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeOption: {
    width: '31%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThemeOption: {
    borderColor: '#4287f5',
  },
  themeOptionText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Create;