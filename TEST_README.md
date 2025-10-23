# Test Suite Documentation

## Overview
This test suite provides comprehensive unit and integration tests for the files changed in the current branch (`coderabitcheck`) compared to the `main` branch.

## Changed Files Tested
1. **app.js** - JavaScript file with greeting function and regex pattern matching
2. **.coderabbit.yaml** - CI/CD configuration file

## Test Files Created

### 1. app.test.js
**Coverage: 22 test cases**

#### Regex Pattern Tests (9 tests)
- Finding "ee" in words like "feel", "need", "see"
- Finding "oo" in words like "moon", "cool"
- Finding all 5 repeated vowels in the hardcoded sentence
- Returning null for words without repeated vowels
- Handling triple repeated vowels
- Case-insensitive matching
- Not matching different adjacent vowels
- Handling empty strings
- Handling strings with only consonants

#### Integration Tests (5 tests)
- Executing app.js and verifying greeting output
- Verifying repeated vowels message is logged
- Confirming "ee" appears in output
- Confirming "oo" appears in output
- Testing output consistency across multiple runs

#### Edge Case Tests (3 tests)
- Handling empty strings in template literals
- Handling numbers in template literals
- Handling special characters

### 2. coderabbit-config.test.js
**Coverage: 40+ test cases**

Comprehensive validation of `.coderabbit.yaml` including file structure, YAML syntax, required fields, build pipeline steps, security best practices, and code style.

## Running the Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
node --test app.test.js
node --test coderabbit-config.test.js
```

## Test Framework
**Node.js Built-in Test Runner** (Node.js v16.17.0+)

Benefits:
- Zero external dependencies
- Native assertion library
- ES Module support
- Built into Node.js

## Test Statistics
- **Total Test Files**: 2
- **Total Test Cases**: 60+
- **Coverage**: Happy paths, edge cases, security, integration, best practices

## Best Practices Applied
1. Clear, descriptive test names
2. Comprehensive edge case coverage
3. No external dependencies
4. Fast execution
5. Isolated, independent tests
6. Security validation
7. Style consistency checks

## Contributing
When adding features:
1. Add tests for new functionality
2. Ensure tests pass locally
3. Follow existing patterns
4. Update documentation