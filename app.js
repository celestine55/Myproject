/**
   * Log a personalized greeting and the repeated-vowel sequences found in a sample sentence.
   *
   * @param {string} name - The name to include in the greeting.
   */
  function greet(name) {
    console.log(`Hello, ${name}!`);
  
    // Sample sentence
    const sentence = "I feel the need to see the moon glowing in the cool night.";
  
    // Regex pattern to find repeated vowels (case-insensitive)
    const pattern = /([aeiouAEIOU])\1+/g;
  
    // Find all matches
    const repeatedVowels = sentence.match(pattern);
  
    console.log("Repeated vowels found:", repeatedVowels);
  }
  
  greet("Raj");
  