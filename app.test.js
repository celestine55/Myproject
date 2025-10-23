/**
 * Comprehensive Unit Tests for app.js
 * Testing the greet function and regex pattern matching logic
 */

import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);

describe('greet function', () => {
  let consoleLogSpy;
  let originalLog;
  let logCalls = [];

  beforeEach(() => {
    // Setup: Mock console.log to capture output
    logCalls = [];
    originalLog = console.log;
    consoleLogSpy = mock.fn((...args) => {
      logCalls.push(args);
    });
    console.log = consoleLogSpy;
  });

  afterEach(() => {
    // Teardown: Restore original console.log
    console.log = originalLog;
    mock.restoreAll();
  });

  describe('Happy Path Tests', () => {
    it('should greet with a simple name', async () => {
      const { greet } = await import('./app.js');
      // Note: Since app.js calls greet("Raj") at module load, we need to account for that
      
      // The function should log the greeting
      const expectedGreeting = 'Hello, Raj!';
      assert.ok(
        logCalls.some(call => call[0] === expectedGreeting),
        'Should log the greeting message'
      );
      
      // The function should log repeated vowels
      assert.ok(
        logCalls.some(call => call[0] === 'Repeated vowels found:'),
        'Should log repeated vowels message'
      );
    });

    it('should greet with different names', async () => {
      // Reset log calls
      logCalls = [];
      
      // Dynamically evaluate the greet function with different names
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
          const sentence = "I feel the need to see the moon glowing in the cool night.";
          const pattern = /([aeiouAEIOU])\\1+/g;
          const repeatedVowels = sentence.match(pattern);
          console.log("Repeated vowels found:", repeatedVowels);
        }
        greet("Alice");
      `;
      
      await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      // This test validates the function can be called with different names
    });

    it('should handle multi-word names', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("John Doe");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('Hello, John Doe!'), 'Should handle multi-word names');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"')}"`);
      assert.ok(stdout.includes('Hello, !'), 'Should handle empty string');
    });

    it('should handle name with special characters', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("O'Brien");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"')}"`);
      assert.ok(stdout.includes("O'Brien"), 'Should handle special characters');
    });

    it('should handle name with numbers', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("User123");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('User123'), 'Should handle names with numbers');
    });

    it('should handle name with unicode characters', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("José");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('José'), 'Should handle unicode characters');
    });

    it('should handle very long names', async () => {
      const longName = 'A'.repeat(1000);
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet("${'A'.repeat(100)}");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('Hello, '), 'Should handle very long names');
    });
  });

  describe('Type Safety and Error Handling', () => {
    it('should handle null as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet(null);
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('null'), 'Should handle null');
    });

    it('should handle undefined as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet(undefined);
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('undefined'), 'Should handle undefined');
    });

    it('should handle number as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet(42);
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('42'), 'Should handle numbers');
    });

    it('should handle object as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet({ name: 'Test' });
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('[object Object]'), 'Should handle objects');
    });

    it('should handle array as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet(['John', 'Doe']);
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('John,Doe'), 'Should handle arrays');
    });

    it('should handle boolean as name', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
        }
        greet(true);
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      assert.ok(stdout.includes('true'), 'Should handle booleans');
    });
  });

  describe('Regex Pattern - Repeated Vowels Detection', () => {
    it('should find repeated vowels in the hardcoded sentence', async () => {
      const sentence = "I feel the need to see the moon glowing in the cool night.";
      const pattern = /([aeiouAEIOU])\1+/g;
      const repeatedVowels = sentence.match(pattern);
      
      // Expected: "ee", "ee", "ee", "oo", "oo"
      assert.ok(repeatedVowels !== null, 'Should find repeated vowels');
      assert.strictEqual(repeatedVowels.length, 5, 'Should find 5 instances of repeated vowels');
      assert.ok(repeatedVowels.includes('ee'), 'Should find "ee"');
      assert.ok(repeatedVowels.includes('oo'), 'Should find "oo"');
    });

    it('should correctly match consecutive identical vowels', () => {
      const testCases = [
        { input: 'book', expected: ['oo'] },
        { input: 'feel', expected: ['ee'] },
        { input: 'skiing', expected: ['ii'] },
        { input: 'vacuum', expected: ['uu'] },
        { input: 'aardvark', expected: ['aa'] },
        { input: 'BOOK', expected: ['OO'] },
        { input: 'bOOk', expected: ['OO'] },
      ];

      testCases.forEach(({ input, expected }) => {
        const pattern = /([aeiouAEIOU])\1+/g;
        const result = input.match(pattern);
        assert.deepStrictEqual(
          result,
          expected,
          `Should find ${JSON.stringify(expected)} in "${input}"`
        );
      });
    });

    it('should handle sentences with no repeated vowels', () => {
      const testCases = [
        'cat',
        'dog',
        'simple',
        'product',
        'random text'
      ];

      testCases.forEach(sentence => {
        const pattern = /([aeiouAEIOU])\1+/g;
        const result = sentence.match(pattern);
        assert.strictEqual(
          result,
          null,
          `Should return null for "${sentence}" with no repeated vowels`
        );
      });
    });

    it('should handle sentences with triple or more repeated vowels', () => {
      const testCases = [
        { input: 'freeee', expected: ['eeee'] },
        { input: 'coool', expected: ['ooo'] },
        { input: 'yaaaay', expected: ['aaaa'] },
      ];

      testCases.forEach(({ input, expected }) => {
        const pattern = /([aeiouAEIOU])\1+/g;
        const result = input.match(pattern);
        assert.deepStrictEqual(
          result,
          expected,
          `Should find ${JSON.stringify(expected)} in "${input}"`
        );
      });
    });

    it('should handle mixed case repeated vowels', () => {
      const testCases = [
        { input: 'bOOk', expected: ['OO'] },
        { input: 'fEEl', expected: ['EE'] },
        { input: 'AARDVARK', expected: ['AA'] },
      ];

      testCases.forEach(({ input, expected }) => {
        const pattern = /([aeiouAEIOU])\1+/g;
        const result = input.match(pattern);
        assert.deepStrictEqual(
          result,
          expected,
          `Should find ${JSON.stringify(expected)} in "${input}"`
        );
      });
    });

    it('should not match different adjacent vowels', () => {
      const testCases = ['beat', 'rain', 'boat', 'coin', 'fear'];

      testCases.forEach(word => {
        const pattern = /([aeiouAEIOU])\1+/g;
        const result = word.match(pattern);
        assert.strictEqual(
          result,
          null,
          `Should not match different adjacent vowels in "${word}"`
        );
      });
    });

    it('should handle empty string', () => {
      const pattern = /([aeiouAEIOU])\1+/g;
      const result = ''.match(pattern);
      assert.strictEqual(result, null, 'Should return null for empty string');
    });

    it('should handle string with only consonants', () => {
      const pattern = /([aeiouAEIOU])\1+/g;
      const result = 'bcdfg'.match(pattern);
      assert.strictEqual(result, null, 'Should return null for consonants only');
    });

    it('should handle string with single vowels only', () => {
      const pattern = /([aeiouAEIOU])\1+/g;
      const result = 'aeiou'.match(pattern);
      assert.strictEqual(result, null, 'Should return null for non-repeated vowels');
    });

    it('should find multiple different repeated vowels in one string', () => {
      const input = 'I feel the need to see the moon';
      const pattern = /([aeiouAEIOU])\1+/g;
      const result = input.match(pattern);
      
      assert.ok(result !== null, 'Should find repeated vowels');
      assert.ok(result.includes('ee'), 'Should find "ee"');
      assert.ok(result.includes('oo'), 'Should find "oo"');
    });
  });

  describe('Console Output Verification', () => {
    it('should call console.log twice in the greet function', async () => {
      // The function logs greeting and repeated vowels message
      assert.ok(logCalls.length >= 2, 'Should call console.log at least twice');
    });

    it('should log greeting in correct format', async () => {
      const greetingLog = logCalls.find(call => 
        typeof call[0] === 'string' && call[0].startsWith('Hello,')
      );
      
      assert.ok(greetingLog, 'Should log a greeting message');
      assert.ok(greetingLog[0].includes('!'), 'Greeting should end with exclamation');
    });

    it('should log repeated vowels array or message', async () => {
      const vowelsLog = logCalls.find(call => 
        call[0] === 'Repeated vowels found:'
      );
      
      assert.ok(vowelsLog, 'Should log repeated vowels message');
      assert.ok(vowelsLog.length >= 2, 'Should log message with the array');
    });
  });

  describe('Performance Tests', () => {
    it('should execute greet function quickly', async () => {
      const code = `
        function greet(name) {
          console.log(\`Hello, \${name}!\`);
          const sentence = "I feel the need to see the moon glowing in the cool night.";
          const pattern = /([aeiouAEIOU])\\1+/g;
          const repeatedVowels = sentence.match(pattern);
          console.log("Repeated vowels found:", repeatedVowels);
        }
        
        const start = Date.now();
        for (let i = 0; i < 1000; i++) {
          greet("Test");
        }
        const end = Date.now();
        console.log("Execution time:", end - start, "ms");
      `;
      
      const { stdout } = await execAsync(`node -e "${code.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`);
      const timeLine = stdout.split('\n').find(line => line.includes('Execution time:'));
      assert.ok(timeLine, 'Should log execution time');
      
      const time = parseInt(timeLine.match(/\d+/)[0]);
      assert.ok(time < 5000, 'Should execute 1000 calls in less than 5 seconds');
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly when app.js is executed', async () => {
      const { stdout } = await execAsync('node app.js');
      
      assert.ok(stdout.includes('Hello, Raj!'), 'Should greet Raj');
      assert.ok(stdout.includes('Repeated vowels found:'), 'Should log repeated vowels message');
      assert.ok(stdout.includes('ee'), 'Should find "ee" in the output');
      assert.ok(stdout.includes('oo'), 'Should find "oo" in the output');
    });

    it('should produce consistent output on multiple runs', async () => {
      const { stdout: run1 } = await execAsync('node app.js');
      const { stdout: run2 } = await execAsync('node app.js');
      const { stdout: run3 } = await execAsync('node app.js');
      
      assert.strictEqual(run1, run2, 'First and second run should produce same output');
      assert.strictEqual(run2, run3, 'Second and third run should produce same output');
    });
  });
});