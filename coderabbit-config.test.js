import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

describe('.coderabbit.yaml configuration file tests', () => {
  let yamlContent;

  describe('File existence and basic structure', () => {
    it('should exist and be readable', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.length > 0);
    });

    it('should contain version field', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('version:'));
    });

    it('should contain jobs field', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('jobs:'));
    });

    it('should contain build job', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('build:'));
    });
  });

  describe('YAML syntax validation', () => {
    it('should not contain tabs (use spaces)', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!yamlContent.includes('\t'));
    });

    it('should end with newline', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.endsWith('\n'));
    });

    it('should use LF line endings (not CRLF)', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!yamlContent.includes('\r\n'));
    });

    it('should have consistent 2-space indentation', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const lines = yamlContent.split('\n').filter(l => l.trim().length > 0);
      const indents = lines.map(l => l.match(/^(\s*)/)[1].length).filter(i => i > 0);
      indents.forEach(indent => {
        assert.strictEqual(indent % 2, 0, `Indent ${indent} should be multiple of 2`);
      });
    });

    it('should be parseable as valid YAML', async () => {
      try {
        const { stdout } = await execAsync('python3 -c "import yaml; yaml.safe_load(open(\'.coderabbit.yaml\'))"');
        assert.ok(true);
      } catch (error) {
        assert.fail('YAML should be parseable');
      }
    });
  });

  describe('Required configuration fields', () => {
    it('should have version number set to 1', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const match = yamlContent.match(/version:\s*(\d+)/);
      assert.ok(match);
      assert.strictEqual(parseInt(match[1]), 1);
    });

    it('should specify runs-on environment', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('runs-on:'));
    });

    it('should use ubuntu-latest runner', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('ubuntu-latest'));
    });

    it('should have steps array', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('steps:'));
    });
  });

  describe('Build pipeline steps', () => {
    it('should use actions/checkout action', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('actions/checkout'));
    });

    it('should use actions/checkout@v2 or later', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const match = yamlContent.match(/actions\/checkout@v(\d+)/);
      assert.ok(match);
      assert.ok(parseInt(match[1]) >= 2);
    });

    it('should have install dependencies step', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('Install dependencies'));
      assert.ok(yamlContent.includes('npm install'));
    });

    it('should have build step', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.includes('Run build'));
      assert.ok(yamlContent.includes('npm run build'));
    });

    it('should have named steps', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const nameMatches = yamlContent.match(/name:\s*(.+)/g);
      assert.ok(nameMatches);
      assert.ok(nameMatches.length >= 2);
    });

    it('should have run commands', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const runMatches = yamlContent.match(/run:\s*(.+)/g);
      assert.ok(runMatches);
      assert.ok(runMatches.length >= 2);
    });
  });

  describe('Step ordering validation', () => {
    it('should checkout before installing dependencies', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const lines = yamlContent.split('\n');
      let checkoutIdx = -1, installIdx = -1;
      lines.forEach((line, i) => {
        if (line.includes('actions/checkout')) checkoutIdx = i;
        if (line.includes('npm install')) installIdx = i;
      });
      assert.ok(checkoutIdx < installIdx);
    });

    it('should install before building', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const lines = yamlContent.split('\n');
      let installIdx = -1, buildIdx = -1;
      lines.forEach((line, i) => {
        if (line.includes('npm install')) installIdx = i;
        if (line.includes('npm run build')) buildIdx = i;
      });
      assert.ok(installIdx < buildIdx);
    });
  });

  describe('Security best practices', () => {
    it('should not contain hardcoded passwords', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!/password:\s*[^\s]+/i.test(yamlContent));
    });

    it('should not contain hardcoded tokens', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!/token:\s*[^\s]+/i.test(yamlContent));
    });

    it('should not contain hardcoded API keys', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!/api[_-]?key:\s*[^\s]+/i.test(yamlContent));
    });

    it('should use pinned action versions', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const usesMatches = yamlContent.match(/uses:\s*([^\s]+)/g);
      if (usesMatches) {
        usesMatches.forEach(match => {
          const action = match.split(':')[1].trim();
          assert.ok(action.includes('@'), `Action should be pinned: ${action}`);
        });
      }
    });
  });

  describe('Best practices and style', () => {
    it('should have descriptive step names (min 5 chars)', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const nameMatches = yamlContent.match(/name:\s*(.+)/g);
      if (nameMatches) {
        nameMatches.forEach(match => {
          const name = match.split(':')[1].trim();
          assert.ok(name.length >= 5, `Step name too short: ${name}`);
        });
      }
    });

    it('should not use vague naming (step1, step2, temp)', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const vague = ['step1', 'step2', 'temp', 'test123'];
      vague.forEach(term => {
        assert.ok(!yamlContent.toLowerCase().includes(term));
      });
    });

    it('should not have trailing whitespace', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      const lines = yamlContent.split('\n');
      lines.forEach((line, i) => {
        if (line.trim().length > 0) {
          assert.strictEqual(line, line.trimEnd(), `Line ${i + 1} has trailing whitespace`);
        }
      });
    });

    it('should not use deprecated action versions', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(!/actions\/checkout@v1/.test(yamlContent));
      assert.ok(!/actions\/setup-node@v1/.test(yamlContent));
    });
  });

  describe('Completeness checks', () => {
    it('should include checkout step', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.toLowerCase().includes('checkout'));
    });

    it('should include install step', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.toLowerCase().includes('install'));
    });

    it('should include build step', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      assert.ok(yamlContent.toLowerCase().includes('build'));
    });

    it('should use npm consistently', () => {
      yamlContent = readFileSync('.coderabbit.yaml', 'utf8');
      if (yamlContent.includes('npm')) {
        const runCmds = yamlContent.match(/run:\s*(.+)/g);
        assert.ok(runCmds.some(cmd => cmd.includes('npm')));
      }
    });
  });
});