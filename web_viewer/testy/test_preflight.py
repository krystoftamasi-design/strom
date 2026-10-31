import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import check_documentation as checks


class PreflightTests(unittest.TestCase):
    def test_html_checks_module_but_skips_importmap_and_json(self):
        source = '<script type="importmap">{"imports":{}}</script><script type="application/ld+json">{}</script><script type="module">import x from "./missing.js";</script>'
        self.assertEqual(checks.check_syntax('page.html', source), [])
        self.assertTrue(checks.check_syntax('page.html', '<script type="module">const x = ;</script>'))

    def test_js_only_checks_syntax_without_running_browser_code(self):
        self.assertEqual(checks.check_syntax('browser.js', 'document.createElement("canvas");'), [])
        self.assertTrue(checks.check_syntax('broken.js', 'const x = ;'))

    def test_selected_snapshot_ignores_foreign_worktree_file(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'own.md').write_text('own', encoding='utf-8')
            (root / 'foreign.md').write_text('foreign dirty', encoding='utf-8')
            snapshot = checks.SelectedSnapshot(root, ['own.md'])
            with patch.object(snapshot.base, 'read', return_value='committed'):
                self.assertEqual(snapshot.read('own.md'), 'own')
                self.assertEqual(snapshot.read('foreign.md'), 'committed')

    def test_six_history_items_and_invalid_yaml_are_rejected(self):
        entry = '  - thread_id: 01a191e0-8d1f-70f1-ba15-e9a7b61dbe4a\n    date: 2026-11-01\n    change: Test\n'
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / 'doc.md'
            path.write_text('---\nhistory:\n' + entry * 6 + '---\n# Pravidla struktury\n', encoding='utf-8')
            self.assertIn('history must contain 1..5 entries', checks.inspect(checks.Snapshot(root, 'disk'), 'doc.md'))
            path.write_text('---\nhistory: [\n---\n# Pravidla struktury\n', encoding='utf-8')
            self.assertTrue(any('invalid YAML' in error for error in checks.inspect(checks.Snapshot(root, 'disk'), 'doc.md')))


if __name__ == '__main__':
    unittest.main()
