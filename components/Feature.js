import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/themeContext';
import CodeBox from '../components/CodeBox';
import { themes } from '../utils/syntaxHighlighter';

// Sample code snippets for different languages and themes
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
}`,

  cpp: 
`// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  rust: 
`// Rust Example
fn main() {
    let greeting = "Hello, World!";
    println!("{}", greeting);
}`,

  dart: 
`// Dart Example
void main() {
  for (int i = 0; i < 5; i++) {
    print('hello \${i + 1}');
  }
}`,

  react: 
`// React JSX Example
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,

  sql: 
`-- SQL Example
SELECT users.name, 
       count(orders.id) as total_orders
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.active = true
GROUP BY users.id
HAVING count(orders.id) > 5
ORDER BY total_orders DESC
LIMIT 10;`,

  swift:
`// Swift Example
import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let message = "Hello, Swift!"
        print(message)
    }
    
    func calculateSum(a: Int, b: Int) -> Int {
        return a + b
    }
}`,

  go:
`// Go Example
package main

import "fmt"

func main() {
    // Declare an array of strings
    fruits := []string{"apple", "banana", "orange"}
    
    // Loop through the array
    for i, fruit := range fruits {
        fmt.Printf("%d: %s\\n", i, fruit)
    }
}`
};

// Map of themes to showcase with appropriate code snippets
const themeShowcase = [
  { theme: 'github', language: 'javascript', title: 'GitHub Theme' },
  { theme: 'powershell', language: 'python', title: 'PowerShell Theme' },
  { theme: 'dark', language: 'java', title: 'Dark Theme' },
  { theme: 'darcula', language: 'cpp', title: 'Darcula Theme' },
  { theme: 'atom', language: 'react', title: 'Atom Theme' },
  { theme: 'monokai', language: 'rust', title: 'Monokai Theme' },
  { theme: 'winter', language: 'swift', title: 'Winter Theme' },
  { theme: 'night owl', language: 'sql', title: 'Night Owl Theme' },
  { theme: 'panda', language: 'go', title: 'Panda Theme' },
  { theme: 'light', language: 'dart', title: 'Light Theme' }
];

const Feature = () => {
  const navigation = useNavigation();
  const { isDarkMode, getThemeColors } = useTheme();
  const theme = getThemeColors();
  
  // Calculate the width for a 2-column grid
  const screenWidth = Dimensions.get('window').width;
  const boxWidth = (screenWidth - 48) / 2; // 48 = padding and margins

  // Handle edit action
  const handleEdit = (codeItem) => {
    navigation.navigate('Create', {
      editMode: true,
      codeData: codeItem
    });
  };

  // Handle share action
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

  // Group code boxes into rows of 2 for clearer organization
  const renderCodeBoxes = () => {
    const rows = [];
    
    for (let i = 0; i < themeShowcase.length; i += 2) {
      const item1 = themeShowcase[i];
      const item1Data = {
        id: `theme-${item1.theme}`,
        code: sampleCodes[item1.language],
        theme: item1.theme,
        language: item1.language.charAt(0).toUpperCase() + item1.language.slice(1),
        title: item1.title
      };
      
      const row = (
        <View key={`row-${i}`} style={styles.row}>
          <View style={styles.codeBoxContainer}>
            <Text style={[styles.themeTitle, { color: theme.textColor }]}>
              <Text style={styles.themeIcon}>{themes[item1.theme].icon || '🎨'}</Text> {item1.title}
            </Text>
            <CodeBox 
              id={item1Data.id}
              code={item1Data.code} 
              theme={item1Data.theme}
              language={item1Data.language}
              title={item1Data.title}
              style={styles.codeBox}
              onEdit={handleEdit}
              onShare={handleShare}
              showActions={true}
            />
          </View>
          
          {i + 1 < themeShowcase.length && (
            <View style={styles.codeBoxContainer}>
              {(() => {
                const item2 = themeShowcase[i+1];
                const item2Data = {
                  id: `theme-${item2.theme}`,
                  code: sampleCodes[item2.language],
                  theme: item2.theme,
                  language: item2.language.charAt(0).toUpperCase() + item2.language.slice(1),
                  title: item2.title
                };
                return (
                  <>
                    <Text style={[styles.themeTitle, { color: theme.textColor }]}>
                      <Text style={styles.themeIcon}>{themes[item2.theme].icon || '🎨'}</Text> {item2.title}
                    </Text>
                    <CodeBox 
                      id={item2Data.id}
                      code={item2Data.code} 
                      theme={item2Data.theme}
                      language={item2Data.language}
                      title={item2Data.title}
                      style={styles.codeBox}
                      onEdit={handleEdit}
                      onShare={handleShare}
                      showActions={true}
                    />
                  </>
                );
              })()}
            </View>
          )} 
        </View>
      );
      rows.push(row);
    }
    
    return rows;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {renderCodeBoxes()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    margin: 0,
    padding: 0,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
    color: '#333',
  },
  subheader: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  codeBoxContainer: {
    width: '48%',
  },
  codeBox: {
    width: '100%',
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
  themeIcon: {
    fontSize: 16,
  },
});

export default Feature; 