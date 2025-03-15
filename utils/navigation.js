import { createRef } from 'react';

// Navigation container reference used across the app
export const navigationRef = createRef();

// Navigate to a specific screen
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

// Go back to the previous screen
export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
}

// Reset the navigation state
export function reset(state) {
  if (navigationRef.current) {
    navigationRef.current.reset(state);
  }
}

// Get the current navigation state
export function getCurrentRoute() {
  if (navigationRef.current) {
    return navigationRef.current.getCurrentRoute();
  }
  return null;
} 