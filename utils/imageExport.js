import { Platform, Share, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

/**
 * Request permission to save images to media library (Android only)
 */
export async function requestSavePermission() {
  if (Platform.OS !== 'web') {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Sorry, we need media library permissions to save the image!');
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Generate a unique filename for the exported image
 * @param {string} codeTitle - Title of the code snippet
 * @param {string} format - Image format (png or jpg)
 * @returns {string} - Generated filename
 */
export function generateFilename(codeTitle, format) {
  const sanitizedTitle = codeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = new Date().getTime();
  return `code_${sanitizedTitle}_${timestamp}.${format}`;
}

/**
 * Capture component as image and save to media library
 * @param {React.RefObject} viewRef - Reference to the component to capture
 * @param {string} codeTitle - Title of the code snippet
 * @param {string} format - Image format (png or jpg)
 * @returns {Promise<Object>} - Result object with success status, message and file path
 */
export async function captureAndSaveImage(viewRef, codeTitle, format = 'png') {
  try {
    console.log('Starting image capture process...');
    
    // Request permission first
    const hasPermission = await requestSavePermission();
    if (!hasPermission && Platform.OS !== 'web') {
      console.log('Permission denied');
      return { 
        success: false, 
        message: 'Permission to access media library was denied' 
      };
    }
    
    // Capture the component as an image
    const targetFormat = format === 'jpg' ? 'jpg' : 'png';
    const quality = targetFormat === 'jpg' ? 0.9 : 1.0;
    
    // Use current on the ref if it has that, otherwise use the ref directly
    const refToCapture = viewRef.current ? viewRef.current : viewRef;
    
    if (!refToCapture) {
      console.error('ViewShot reference is invalid');
      return {
        success: false,
        message: 'ViewShot reference is invalid',
      };
    }
    
    console.log('Attempting to capture image...');
    const captureOptions = {
      format: targetFormat,
      quality: quality,
      result: 'file',
      snapshotContentContainer: true
    };
    
    const uri = await captureRef(refToCapture, captureOptions);
    console.log('Image captured successfully:', uri);
    
    if (!uri) {
      console.error('Capture failed - no URI returned');
      return {
        success: false,
        message: 'Failed to capture image - no URI returned',
      };
    }
    
    // Save the image to media library
    if (Platform.OS !== 'web') {
      console.log('Saving to media library...');
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Create an album if it doesn't exist
      const album = await MediaLibrary.getAlbumAsync('Code Snippets');
      if (album === null) {
        await MediaLibrary.createAlbumAsync('Code Snippets', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      
      console.log('Image saved successfully');
      return {
        success: true,
        message: `Image saved to your gallery in the "Code Snippets" album`,
        path: uri,
      };
    } else {
      return {
        success: true,
        message: 'Image captured successfully',
        path: uri,
      };
    }
  } catch (error) {
    console.error('Error capturing or saving image:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

/**
 * Share the captured image
 * @param {string} imagePath - Path to the captured image
 * @param {string} codeTitle - Title of the code snippet
 * @returns {Promise<boolean>} - Whether sharing was successful
 */
export async function shareImage(imagePath, codeTitle) {
  try {
    if (Platform.OS === 'web') {
      return false;
    }
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
      return false;
    }
    
    // Share the image
    await Sharing.shareAsync(imagePath, {
      mimeType: imagePath.endsWith('png') ? 'image/png' : 'image/jpeg',
      dialogTitle: `Share ${codeTitle}`,
    });
    
    return true;
  } catch (error) {
    console.error('Error sharing image:', error);
    Alert.alert('Error', `Failed to share image: ${error.message}`);
    return false;
  }
}

export default {
  captureAndSaveImage,
  shareImage
}; 