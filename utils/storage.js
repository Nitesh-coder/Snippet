/**
 * Storage Utility
 * Handles saving and retrieving code snippets using AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const SAVED_CODES_KEY = 'savedCodes';

/**
 * Save a code snippet to local storage
 * 
 * @param {object} codeData - The code data to save
 * @param {string} codeData.code - The code content
 * @param {string} codeData.language - The programming language
 * @param {string} codeData.title - The title of the code snippet
 * @param {string} codeData.theme - The theme used
 * @returns {Promise<boolean>} - Whether the save was successful
 */
export const saveCode = async (codeData) => {
  try {
    // Add creation timestamp and generate ID
    const timestamp = new Date().getTime();
    const newCodeData = {
      ...codeData,
      id: `code_${timestamp}`,
      createdAt: timestamp,
    };
    
    // Get existing saved codes
    const savedCodesJson = await AsyncStorage.getItem(SAVED_CODES_KEY);
    let savedCodes = savedCodesJson ? JSON.parse(savedCodesJson) : [];
    
    // Add new code to the array
    savedCodes = [newCodeData, ...savedCodes];
    
    // Save back to storage
    await AsyncStorage.setItem(SAVED_CODES_KEY, JSON.stringify(savedCodes));
    
    return true;
  } catch (error) {
    console.error('Error saving code:', error);
    return false;
  }
};

/**
 * Get all saved code snippets
 * 
 * @returns {Promise<Array>} - Array of saved code snippets
 */
export const getSavedCodes = async () => {
  try {
    const savedCodesJson = await AsyncStorage.getItem(SAVED_CODES_KEY);
    return savedCodesJson ? JSON.parse(savedCodesJson) : [];
  } catch (error) {
    console.error('Error retrieving saved codes:', error);
    return [];
  }
};

/**
 * Delete a saved code snippet
 * 
 * @param {string} id - The ID of the code snippet to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
export const deleteCode = async (id) => {
  try {
    // Get existing saved codes
    const savedCodesJson = await AsyncStorage.getItem(SAVED_CODES_KEY);
    let savedCodes = savedCodesJson ? JSON.parse(savedCodesJson) : [];
    
    // Filter out the code to delete
    savedCodes = savedCodes.filter(code => code.id !== id);
    
    // Save back to storage
    await AsyncStorage.setItem(SAVED_CODES_KEY, JSON.stringify(savedCodes));
    
    return true;
  } catch (error) {
    console.error('Error deleting code:', error);
    return false;
  }
};

export default {
  saveCode,
  getSavedCodes,
  deleteCode
}; 