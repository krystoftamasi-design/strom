"""Run with python -m unittest discover -s web_viewer/testy -p test_documentation_check.py."""
import importlib.util
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'tools/check_documentation.py'
spec = importlib.util.spec_from_file_location('documentation_check', SCRIPT)
check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check)
sys.path.insert(0, str(SCRIPT.parent))
import review_documentation as reviewer
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
        self.assertEqual(check.inspect(check.Snapshot(self.root, 'disk'), 'AGENTS.md'), set())

    def test_czech_anchors_and_templates(self):
        self.write('AGENTS.md', VALID + '\n### Část okna\n\n[link](#část-okna)\n```markdown\n[placeholder](missing.md)\n```\n')
        self.assertEqual(check.inspect(check.Snapshot(self.root, 'disk'), 'AGENTS.md'), set())

    def test_content_edit_needs_no_history_update(self):
        self.write('AGENTS.md', VALID.replace('- Rule.', '- Modified rule.'))
        self.git('add', '.')
        self.assertEqual(self.run_check().returncode, 0)

    def test_markdown_without_frontmatter_is_valid(self):
        self.write('AGENTS.md', '# Document\n\n## Pravidla struktury\n\n- Rule.\n')
        self.git('add', '.')
        self.assertEqual(self.run_check().returncode, 0)

    def test_hook_checks_syntax_and_whitespace(self):
        self.write('web_viewer/tools/example.js', 'const broken = ;\n')
        self.git('add', '.')
        self.assertEqual(self.run_check().returncode, 1)
        self.write('web_viewer/tools/example.js', 'const valid = 1;  \n')
        self.git('add', '.')
        self.assertIn('whitespace', self.run_check().stdout)

    def test_changed_heading_breaks_inbound_link(self):
        self.write(check.EVIDENCE, VALID + '\n[link](../../AGENTS.md#document)\n')
        self.git('add', '.')
        self.commit()
        self.write('AGENTS.md', VALID.replace('# Document', '# Renamed').replace('Initial.', 'Renamed.'))
        self.git('add', '.')
        self.assertIn('missing heading anchor', self.run_check().stdout)

    def test_ten_commit_review_gate(self):
        head = self.git('rev-parse', 'HEAD').decode().strip()
        result = subprocess.run(['python', str(SCRIPT), '--review-complete', head], cwd=self.root, capture_output=True)
        self.assertEqual(result.returncode, 0)
        for i in range(10):
            self.write('counter.txt', str(i))
            self.git('add', 'counter.txt')
            self.commit()
            if i == 8:
                result = subprocess.run(['python', str(SCRIPT), '--review-status'], cwd=self.root, capture_output=True)
                self.assertIn(b'"review_due": false', result.stdout)
        result = subprocess.run(['python', str(SCRIPT), '--review-status'], cwd=self.root, capture_output=True)
        self.assertIn(b'"new_commits": 10', result.stdout)
        self.assertIn(b'"review_due": true', result.stdout)

    def test_review_waits_for_ten_commits(self):
        head = self.git('rev-parse', 'HEAD').decode().strip()
        (self.root / 'web_viewer/old').mkdir()
        reviewer.save_state(self.root, head)
        with patch.object(reviewer.shutil, 'which', side_effect=AssertionError('must not launch Codex')):
            self.assertEqual(reviewer.review(self.root), 0)

    def test_successful_review_writes_report_and_advances_baseline(self):
        original = subprocess.run
        def fake_run(command, **kwargs):
            if command[0] == 'fake-codex':
                self.assertIn('Chrome fixture', kwargs['input'])
                self.assertIn('Dokumentace je zdroj pozadavku', kwargs['input'])
                self.assertEqual(kwargs['creationflags'], subprocess.CREATE_NO_WINDOW if reviewer.os.name == 'nt' else 0)
                Path(command[command.index('-o') + 1]).write_text('NALEZY: test report', encoding='utf-8')
                return subprocess.CompletedProcess(command, 0)
            return original(command, **kwargs)
        with patch.object(reviewer, 'capture_browser', return_value='Chrome fixture'), patch.object(reviewer.shutil, 'which', return_value='fake-codex'), patch.object(reviewer.subprocess, 'run', side_effect=fake_run):
            self.assertEqual(reviewer.review(self.root, force=True), 0)
        self.assertIn('DOKONCENA', (self.root / 'web_viewer/old/revize_dokumentace.md').read_text(encoding='utf-8'))
        self.assertEqual(reviewer.status(self.root)[2], 0)

    def test_missing_codex_does_not_advance_baseline(self):
        with patch.object(reviewer.shutil, 'which', return_value=None):
            self.assertEqual(reviewer.review(self.root, force=True), 1)
        self.assertFalse((self.root / 'web_viewer/old/documentation_review_state.json').exists())
        self.assertIn('SELHANI', (self.root / 'web_viewer/old/revize_dokumentace.md').read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
