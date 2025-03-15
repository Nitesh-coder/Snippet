/**
 * Syntax Highlighting Utility
 * Provides functions and configurations for syntax highlighting of code in different languages
 */

// Theme configurations
export const themes = {
  darcula: {
    background: '#2B2B2B',
    text: '#A9B7C6',
    keywords: '#CC7832',
    strings: '#6A8759',
    numbers: '#6897BB',
    comments: '#808080',
    lineNumbers: '#606366',
    lineNumbersBg: '#313335',
    icon: '🌑',
  },
  dark: {
    background: '#1E1E1E',
    text: '#D4D4D4',
    keywords: '#569CD6',
    strings: '#CE9178',
    numbers: '#B5CEA8',
    comments: '#6A9955',
    lineNumbers: '#858585',
    lineNumbersBg: '#252526',
    icon: '🌚',
  },
  light: {
    background: '#FFFFFF',
    text: '#333333',
    keywords: '#0000FF',
    strings: '#A31515',
    numbers: '#098658',
    comments: '#008000',
    lineNumbers: '#999999',
    lineNumbersBg: '#F0F0F0',
    icon: '☀️',
  },
  github: {
    background: '#ffffff',
    text: '#24292e',
    keywords: '#d73a49',
    strings: '#032f62',
    numbers: '#005cc5',
    comments: '#6a737d',
    lineNumbers: '#6a737d',
    lineNumbersBg: '#f6f8fa',
    icon: '🐱',
  },
  powershell: {
    background: '#012456',
    text: '#EEEDF0',
    keywords: '#569CD6',
    strings: '#CE9178',
    numbers: '#B5CEA8',
    comments: '#608B4E',
    lineNumbers: '#808080',
    lineNumbersBg: '#012456',
    icon: '💻',
  },
  atom: {
    background: '#282C34',
    text: '#ABB2BF',
    keywords: '#C678DD',
    strings: '#98C379',
    numbers: '#D19A66',
    comments: '#5C6370',
    lineNumbers: '#4B5363',
    lineNumbersBg: '#282C34',
    icon: '⚛️',
  },
  monokai: {
    background: '#272822',
    text: '#F8F8F2',
    keywords: '#F92672',
    strings: '#E6DB74',
    numbers: '#AE81FF',
    comments: '#75715E',
    lineNumbers: '#90908A',
    lineNumbersBg: '#272822',
    icon: '🎨',
  },
  winter: {
    background: '#FFFFFF',
    text: '#434C5E',
    keywords: '#81A1C1',
    strings: '#A3BE8C',
    numbers: '#B48EAD',
    comments: '#616E88',
    lineNumbers: '#D8DEE9',
    lineNumbersBg: '#ECEFF4',
    icon: '❄️',
  },
  'night owl': {
    background: '#011627',
    text: '#d6deeb',
    keywords: '#c792ea',
    strings: '#ecc48d',
    numbers: '#f78c6c',
    comments: '#637777',
    lineNumbers: '#4b6479',
    lineNumbersBg: '#011627',
    icon: '🦉',
  },
  panda: {
    background: '#292A2B',
    text: '#E6E6E6',
    keywords: '#FF75B5',
    strings: '#19F9D8',
    numbers: '#FFB86C',
    comments: '#676B79',
    lineNumbers: '#676B79',
    lineNumbersBg: '#292A2B',
    icon: '🐼',
  }
};

// Language-specific syntax patterns
export const syntaxPatterns = {
  JavaScript: {
    keywords: /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|class|import|export|from|this|null|undefined|true|false|new|async|await)\b/g,
    strings: /(["'`])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
  Python: {
    keywords: /\b(def|if|else|elif|for|while|break|continue|return|import|from|as|class|try|except|finally|with|in|is|not|and|or|True|False|None)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(#.*$)/gm,
  },
  Java: {
    keywords: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
  'C++': {
    keywords: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|namespace|template|try|catch|throw|new|delete|private|protected|public|virtual|inline|explicit|friend|using|nullptr|true|false)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
  C: {
    keywords: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
  Rust: {
    keywords: /\b(as|break|const|continue|crate|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while|async|await|dyn)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
  Dart: {
    keywords: /\b(abstract|dynamic|implements|show|as|else|import|static|assert|enum|in|super|async|export|interface|switch|await|extends|is|sync|break|external|library|this|case|factory|mixin|throw|catch|false|new|true|class|final|null|try|const|finally|on|typedef|continue|for|operator|var|covariant|Function|part|void|default|get|rethrow|while|deferred|hide|return|with|do|if|set|yield)\b/g,
    strings: /(["'])(.*?)\1/g,
    numbers: /\b\d+\b/g,
    comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
  },
};

// Default syntax patterns for languages that don't have specific configurations
export const defaultSyntaxPatterns = {
  keywords: /\b(function|return|if|else|for|while|var|let|const|class|import|export)\b/g,
  strings: /(["'])(.*?)\1/g,
  numbers: /\b\d+\b/g,
  comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
};

/**
 * Processes a line of code and returns an array of segments with styling information
 * 
 * @param {string} line - The line of code to process
 * @param {string} language - The programming language
 * @param {object} themeColors - The theme colors to use
 * @returns {array} - Array of segments with text and style information
 */
export const processCodeLine = (line, language, themeColors) => {
  // Get appropriate syntax patterns for the language
  const patterns = syntaxPatterns[language] || defaultSyntaxPatterns;
  
  // First, create segments with their respective styles
  const segments = [];
  
  // Check for comments first (since they can contain other patterns)
  let commentMatch;
  let remainingLine = line;
  let lastIndex = 0;
  
  // Try to find comments
  if (patterns.comments) {
    patterns.comments.lastIndex = 0;
    commentMatch = patterns.comments.exec(line);
    
    if (commentMatch) {
      // Add the text before the comment
      if (commentMatch.index > 0) {
        segments.push({
          text: line.substring(0, commentMatch.index),
          style: { color: themeColors.text }
        });
      }
      
      // Add the comment
      segments.push({
        text: commentMatch[0],
        style: { color: themeColors.comments }
      });
      
      // Set the remaining line to empty as comments typically go to the end of the line
      remainingLine = line.substring(commentMatch.index + commentMatch[0].length);
      lastIndex = commentMatch.index + commentMatch[0].length;
    }
  }
  
  // If no comment was found, process the whole line
  if (segments.length === 0) {
    segments.push({
      text: line,
      style: { color: themeColors.text }
    });
  }
  
  // Process the non-comment parts for other syntax elements
  const processedSegments = [];
  
  segments.forEach(segment => {
    if (segment.style.color === themeColors.comments) {
      // Don't process comments further
      processedSegments.push(segment);
      return;
    }
    
    let text = segment.text;
    let textSegments = [];
    
    // Check for strings
    if (patterns.strings) {
      patterns.strings.lastIndex = 0;
      let stringMatch;
      let lastStringIndex = 0;
      
      while ((stringMatch = patterns.strings.exec(text)) !== null) {
        // Add the text before the string
        if (stringMatch.index > lastStringIndex) {
          textSegments.push({
            text: text.substring(lastStringIndex, stringMatch.index),
            style: { color: themeColors.text }
          });
        }
        
        // Add the string
        textSegments.push({
          text: stringMatch[0],
          style: { color: themeColors.strings }
        });
        
        lastStringIndex = stringMatch.index + stringMatch[0].length;
      }
      
      // Add any remaining text
      if (lastStringIndex < text.length) {
        textSegments.push({
          text: text.substring(lastStringIndex),
          style: { color: themeColors.text }
        });
      }
    }
    
    // If no strings were found, use the whole segment
    if (textSegments.length === 0) {
      textSegments.push({
        text,
        style: { color: themeColors.text }
      });
    }
    
    // Process keywords and numbers in non-string segments
    const finalSegments = [];
    
    textSegments.forEach(textSegment => {
      if (textSegment.style.color === themeColors.strings) {
        // Don't process strings further
        finalSegments.push(textSegment);
        return;
      }
      
      let segmentText = textSegment.text;
      
      // Replace keywords
      if (patterns.keywords) {
        segmentText = segmentText.replace(patterns.keywords, match => 
          `<keyword>${match}</keyword>`
        );
      }
      
      // Replace numbers
      if (patterns.numbers) {
        segmentText = segmentText.replace(patterns.numbers, match => 
          `<number>${match}</number>`
        );
      }
      
      // Split by markers and create segments
      const parts = segmentText.split(/(<keyword>.*?<\/keyword>|<number>.*?<\/number>)/g);
      
      parts.forEach(part => {
        if (part.startsWith('<keyword>') && part.endsWith('</keyword>')) {
          finalSegments.push({
            text: part.substring(9, part.length - 10),
            style: { color: themeColors.keywords }
          });
        } else if (part.startsWith('<number>') && part.endsWith('</number>')) {
          finalSegments.push({
            text: part.substring(8, part.length - 9),
            style: { color: themeColors.numbers }
          });
        } else if (part) {
          finalSegments.push({
            text: part,
            style: { color: themeColors.text }
          });
        }
      });
    });
    
    processedSegments.push(...finalSegments);
  });
  
  return processedSegments;
};

export default {
  themes,
  syntaxPatterns,
  defaultSyntaxPatterns,
  processCodeLine
}; 