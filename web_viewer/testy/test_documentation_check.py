"""Run with python -m unittest discover -s web_viewer/testy -p test_documentation_check.py."""
import importlib.util
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'tools/check_documentation.py'
spec = importlib.util.spec_from_file_location('documentation_check', SCRIPT)
check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check)
VALID = '''---
history:
  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a
    date: 2026-10-31
    change: Initial.
---
# Document

## Pravidla struktury

- Rule.
'''


class DocumentationChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.git('init', '-q')
        self.write('AGENTS.md', VALID)
        self.write(check.EVIDENCE, VALID)
        self.git('add', '.')
        self.commit()

    def tearDown(self):
        self.temp.cleanup()

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.root), *args], stderr=subprocess.STDOUT)

    def commit(self):
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture')

    def write(self, name, text):
        target = self.root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding='utf-8')

    def run_check(self):
        return subprocess.run(['python', str(SCRIPT), '--staged'], cwd=self.root,
                              capture_output=True, text=True, encoding='utf-8')

    def test_index_is_checked_instead_of_working_file(self):
        self.write('AGENTS.md', VALID.replace('Initial.', 'Broken.').replace('- Rule.', '- [missing](no.md)'))
        self.git('add', 'AGENTS.md')
        self.write('AGENTS.md', VALID)
        result = self.run_check()
        self.assertEqual(result.returncode, 1)
        self.assertIn('missing link target', result.stdout)

    def test_old_error_does_not_block_unrelated_edit(self):
        self.write('AGENTS.md', VALID + '\n[old link](no.md)\n')
        self.git('add', '.')
        self.commit()
        self.write('AGENTS.md', (VALID + '\n[old link](no.md)\n').replace('Initial.', 'Updated.').replace('- Rule.', '- New rule.'))
        self.git('add', '.')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertIn('EXISTING', result.stdout)

    def test_web_change_requires_evidence(self):
        self.write('web_viewer/index.html', '<html></html>')
        self.git('add', '.')
        self.assertIn('web code changes require staged', self.run_check().stdout)
        self.write(check.EVIDENCE, VALID.replace('Initial.', 'Web changed.'))
        self.git('add', '.')
        self.assertEqual(self.run_check().returncode, 0)

    def test_duplicate_yaml_and_bad_history(self):
        self.write('AGENTS.md', VALID.replace('history:', 'history: []\nhistory:'))
        self.assertTrue(any('invalid YAML' in e for e in check.inspect(check.Snapshot(self.root, 'disk'), 'AGENTS.md')))
        self.write('AGENTS.md', VALID.replace('history:\n', 'history: 42\nignored:\n'))
        self.assertIn('history must contain 1..5 entries', check.inspect(check.Snapshot(self.root, 'disk'), 'AGENTS.md'))

    def test_czech_anchors_and_templates(self):
        self.write('AGENTS.md', VALID + '\n### Část okna\n\n[link](#část-okna)\n```markdown\n[placeholder](missing.md)\n```\n')
        self.assertEqual(check.inspect(check.Snapshot(self.root, 'disk'), 'AGENTS.md'), set())

    def test_missing_history_update(self):
        self.write('AGENTS.md', VALID.replace('- Rule.', '- Modified rule.'))
        self.git('add', '.')
        self.assertIn('requires updated YAML history', self.run_check().stdout)

    def test_changed_heading_breaks_inbound_link(self):
        self.write(check.EVIDENCE, VALID + '\n[link](../../AGENTS.md#document)\n')
        self.git('add', '.')
        self.commit()
        self.write('AGENTS.md', VALID.replace('# Document', '# Renamed').replace('Initial.', 'Renamed.'))
        self.git('add', '.')
        self.assertIn('missing heading anchor', self.run_check().stdout)

    def test_five_commit_review_gate(self):
        head = self.git('rev-parse', 'HEAD').decode().strip()
        result = subprocess.run(['python', str(SCRIPT), '--review-complete', head], cwd=self.root, capture_output=True)
        self.assertEqual(result.returncode, 0)
        for i in range(5):
            self.write('counter.txt', str(i))
            self.git('add', 'counter.txt')
            self.commit()
        result = subprocess.run(['python', str(SCRIPT), '--review-status'], cwd=self.root, capture_output=True)
        self.assertIn(b'"new_commits": 5', result.stdout)
        self.assertIn(b'"review_due": true', result.stdout)


if __name__ == '__main__':
    unittest.main()
