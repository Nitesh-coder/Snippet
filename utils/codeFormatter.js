/**
 * Code Formatter Utility
 * Provides formatting functions for different programming languages
 */

/**
 * Format Python code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatPythonCode = (code, newText, isNewLine) => {
  // If not a new line, just return the new text
  if (!isNewLine) return newText;
  
  const lines = newText.split('\n');
  const lastLineIndex = lines.length - 1;
  const newLine = lines[lastLineIndex] || '';
  const previousLine = lines[lastLineIndex - 1] || '';
  
  // Only format if the new line is empty (user just pressed Enter)
  if (newLine.trim() === '') {
    let indentLevel = 0;
    const indentSize = 4; // Python standard
    
    // Calculate the current indentation level from the previous line
    if (previousLine) {
      // Get the indentation of the current line
      const currentIndent = previousLine.length - previousLine.trimLeft().length;
      indentLevel = Math.floor(currentIndent / indentSize);
      
      // If the line ends with a colon, increase indent for the next line
      if (previousLine.trim().endsWith(':')) {
        indentLevel++;
      }
      
      // Decrease indent for lines that end a block
      if (previousLine.trim().startsWith('return') || 
          previousLine.trim().startsWith('break') || 
          previousLine.trim().startsWith('continue') || 
          previousLine.trim().startsWith('raise') || 
          previousLine.trim().startsWith('pass') || 
          previousLine.trim() === 'else:' || 
          previousLine.trim().startsWith('elif ') || 
          previousLine.trim().startsWith('except') || 
          previousLine.trim().startsWith('finally:')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
    }
    
    // Create the proper indentation for the new line
    const indent = ' '.repeat(indentLevel * indentSize);
    
    // Replace the empty new line with an indented one
    lines[lastLineIndex] = indent;
    
    // Join the lines back together
    return lines.join('\n');
  }
  
  return newText;
};

/**
 * Format JavaScript/TypeScript code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatJavaScriptCode = (code, newText, isNewLine) => {
  // If not a new line, just return the new text
  if (!isNewLine) return newText;
  
  const lines = newText.split('\n');
  const lastLineIndex = lines.length - 1;
  const newLine = lines[lastLineIndex] || '';
  const previousLine = lines[lastLineIndex - 1] || '';
  
  // Only format if the new line is empty (user just pressed Enter)
  if (newLine.trim() === '') {
    let indentLevel = 0;
    const indentSize = 2; // JS standard is often 2 spaces
    
    // Calculate the current indentation level from the previous line
    if (previousLine) {
      // Get the indentation of the current line
      const currentIndent = previousLine.length - previousLine.trimLeft().length;
      indentLevel = Math.floor(currentIndent / indentSize);
      
      // Check for opening braces
      const openBraces = (previousLine.match(/{/g) || []).length;
      const closeBraces = (previousLine.match(/}/g) || []).length;
      
      // Increase indent if there are more opening braces than closing ones
      if (openBraces > closeBraces) {
        indentLevel++;
      }
      
      // If the line has a closing brace at the end, don't increase indent
      if (previousLine.trimRight().endsWith('}')) {
        // Don't increase indent
      } else if (previousLine.includes('=>') && !previousLine.includes('{')) {
        // Arrow function without braces, increase indent
        indentLevel++;
      }
    }
    
    // Create the proper indentation for the new line
    const indent = ' '.repeat(indentLevel * indentSize);
    
    // Replace the empty new line with an indented one
    lines[lastLineIndex] = indent;
    
    // Join the lines back together
    return lines.join('\n');
  }
  
  return newText;
};

/**
 * Format Java code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatJavaCode = (code, newText, isNewLine) => {
  // Similar to JavaScript but with 4 spaces standard
  if (!isNewLine) return newText;
  
  const lines = newText.split('\n');
  const lastLineIndex = lines.length - 1;
  const newLine = lines[lastLineIndex] || '';
  const previousLine = lines[lastLineIndex - 1] || '';
  
  if (newLine.trim() === '') {
    let indentLevel = 0;
    const indentSize = 4; // Java standard
    
    if (previousLine) {
      const currentIndent = previousLine.length - previousLine.trimLeft().length;
      indentLevel = Math.floor(currentIndent / indentSize);
      
      // Check for opening braces
      const openBraces = (previousLine.match(/{/g) || []).length;
      const closeBraces = (previousLine.match(/}/g) || []).length;
      
      if (openBraces > closeBraces) {
        indentLevel++;
      }
    }
    
    const indent = ' '.repeat(indentLevel * indentSize);
    lines[lastLineIndex] = indent;
    return lines.join('\n');
  }
  
  return newText;
};

/**
 * Format C/C++ code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatCCode = (code, newText, isNewLine) => {
  // Similar to Java formatting
  return formatJavaCode(code, newText, isNewLine);
};

/**
 * Format Rust code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatRustCode = (code, newText, isNewLine) => {
  // If not a new line, just return the new text
  if (!isNewLine) return newText;
  
  const lines = newText.split('\n');
  const lastLineIndex = lines.length - 1;
  const newLine = lines[lastLineIndex] || '';
  const previousLine = lines[lastLineIndex - 1] || '';
  
  // Only format if the new line is empty (user just pressed Enter)
  if (newLine.trim() === '') {
    let indentLevel = 0;
    const indentSize = 4; // Rust standard
    
    // Calculate the current indentation level from the previous line
    if (previousLine) {
      // Get the indentation of the current line
      const currentIndent = previousLine.length - previousLine.trimLeft().length;
      indentLevel = Math.floor(currentIndent / indentSize);
      
      // Check for opening braces
      const openBraces = (previousLine.match(/{/g) || []).length;
      const closeBraces = (previousLine.match(/}/g) || []).length;
      
      // Increase indent if there are more opening braces than closing ones
      if (openBraces > closeBraces) {
        indentLevel++;
      }
    }
    
    // Create the proper indentation for the new line
    const indent = ' '.repeat(indentLevel * indentSize);
    
    // Replace the empty new line with an indented one
    lines[lastLineIndex] = indent;
    
    // Join the lines back together
    return lines.join('\n');
  }
  
  return newText;
};

/**
 * Format Dart code with proper indentation
 * @param {string} code - The code to format
 * @param {string} newText - The new text being entered
 * @param {boolean} isNewLine - Whether a new line was just added
 * @returns {string} - The formatted code
 */
export const formatDartCode = (code, newText, isNewLine) => {
  // Similar to JavaScript but with 2 spaces standard
  return formatJavaScriptCode(code, newText, isNewLine);
};

/**
 * Format the entire code based on language
 * @param {string} code - The code to format
 * @param {string} language - The programming language
 * @returns {string} - The formatted code
 */
export const formatEntireCode = (code, language) => {
  if (!code.trim()) {
    return code;
  }
  
  // Split the code into lines and process each line
  const lines = code.split('\n');
  const formattedLines = [];
  
  // Keep track of indentation level
  let indentLevel = 0;
  
  // Get the indent size for the language
  const indentSize = getIndentSize(language);
  
  // Process each line with proper indentation
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimLeft();  // Remove leading whitespace
    
    // Check if this line has a closing brace/bracket at the start
    // that would decrease indent level
    if (line.startsWith('}') || line.startsWith(')') || line.startsWith(']')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the proper indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    const formattedLine = (line.trim() === '') ? '' : indent + line;
    formattedLines.push(formattedLine);
    
    // Adjust indentation level for the next line
    // Increase indent if the line has an opening brace/bracket
    if (line.includes('{') && !line.includes('}')) {
      indentLevel++;
    } else if (line.includes('(') && !line.includes(')')) {
      indentLevel++;
    } else if (line.includes('[') && !line.includes(']')) {
      indentLevel++;
    } else if (language === 'Python' && line.endsWith(':')) {
      indentLevel++;
    }
    
    // Decrease indent if the line has a closing brace/bracket
    if (line.includes('}') && !line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    } else if (line.includes(')') && !line.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    } else if (line.includes(']') && !line.startsWith(']')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }
  
  return formattedLines.join('\n');
};

/**
 * Get the indent size for a specific language
 * @param {string} language - The programming language
 * @returns {number} - The indent size in spaces
 */
const getIndentSize = (language) => {
  switch (language) {
    case 'JavaScript':
    case 'Dart':
      return 2;
    case 'Python':
    case 'Java':
    case 'C':
    case 'C++':
    case 'Rust':
      return 4;
    default:
      return 2;
  }
};

/**
 * Get the appropriate formatter for the selected language
 * @param {string} language - The programming language
 * @returns {Function} - The formatter function for that language
 */
export const getFormatter = (language) => {
  switch (language) {
    case 'Python':
      return formatPythonCode;
    case 'JavaScript':
      return formatJavaScriptCode;
    case 'Java':
      return formatJavaCode;
    case 'C':
    case 'C++':
      return formatCCode;
    case 'Rust':
      return formatRustCode;
    case 'Dart':
      return formatDartCode;
    default:
      // Return a no-op formatter for unsupported languages
      return (code, newText) => newText;
  }
};

export default {
  formatPythonCode,
  formatJavaScriptCode,
  formatJavaCode,
  formatCCode,
  formatRustCode,
  formatDartCode,
  formatEntireCode,
  getFormatter
}; 