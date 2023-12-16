
export const compareStrings = (str1, str2) => {
    console.log(str1, " ... ", str2)
    // Normalize strings: trim, convert to lowercase, and remove spaces
    const normalize = (str) => {
        // Make sure str is a string
        if (typeof str !== 'string') {
          console.error('Expected a string');
          return ''; // or throw an error, depending on how you want to handle this case
        }
        return str.trim().toLowerCase().replace(/\s/g, '');
      };
      
  
    let s1 = normalize(str1);
    let s2 = normalize(str2);
  
    // Quick check for exact match
    if (s1 === s2) {
      return true;
    }
  
    // Check if strings are off by one character
    function isOneCharOff(s1, s2) {
      if (s1.length !== s2.length) {
        // Check if they are one insertion/deletion off
        let [longer, shorter] = s1.length > s2.length ? [s1, s2] : [s2, s1];
        for (let i = 0; i < longer.length; i++) {
          let shorterWithChar = longer.slice(0, i) + longer.slice(i + 1);
          if (shorterWithChar === shorter) {
            return true;
          }
        }
      } else {
        // Check if they are one replacement off
        let diffs = 0;
        for (let i = 0; i < s1.length; i++) {
          if (s1[i] !== s2[i]) {
            diffs++;
            if (diffs > 1) {
              return false;
            }
          }
        }
        return diffs === 1;
      }
      return false;
    }
  
    // Check if they are one character off
    return isOneCharOff(s1, s2);
  }

export const removeSpaces = (str) => {
  return str.replace(/\s+/g, '');
}
