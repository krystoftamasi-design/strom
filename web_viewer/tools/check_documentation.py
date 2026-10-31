"""Read-only documentation checks; staged checks inspect Git's index, not disk."""
import argparse
import datetime
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

try:
    import yaml
except ImportError:
    sys.exit('Documentation check requires PyYAML 6: python -m pip install "PyYAML>=6,<7"')

DOCS = 'web_viewer/dokumentace/'
EVIDENCE = DOCS + 'zmeny.md'
MAIN = ['AGENTS.md'] + [DOCS + name + '.md' for name in (
    'architektura_obsahu', 'moje/okna', 'moje/vzhled_oken', 'moje/texty', 'moje/prvky',
    'moje/elementy', 'system/architektura_oken', 'struktura_projektu', 'zmeny', 'system/kontrola_dokumentace')]


class UniqueLoader(yaml.SafeLoader):
    pass


def unique_mapping(loader, node):
    result = {}
    for key, value in node.value:
        key = loader.construct_object(key)
        if key in result:
            raise yaml.YAMLError('duplicate key: ' + str(key))
        result[key] = loader.construct_object(value)
    return result


UniqueLoader.add_constructor('tag:yaml.org,2002:map', unique_mapping)


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args])


class Snapshot:
    def __init__(self, root, revision):
        self.root, self.revision = Path(root), revision
        self.cache = {}

    def read(self, name):
        if name not in self.cache:
            try:
                if self.revision == 'disk':
                    data = (self.root / name).read_bytes()
                else:
                    spec = ':' + name if self.revision == 'index' else self.revision + ':' + name
                    data = git(self.root, 'show', spec)
                self.cache[name] = data.decode('utf-8-sig')
            except (OSError, UnicodeError, subprocess.CalledProcessError):
                self.cache[name] = None
        return self.cache[name]

    def exists(self, name):
        if self.revision == 'disk':
            return (self.root / name).is_file()
        spec = ':' + name if self.revision == 'index' else self.revision + ':' + name
        return subprocess.run(['git', '-C', str(self.root), 'cat-file', '-e', spec],
                              capture_output=True).returncode == 0


def body(text):
    return re.sub(r'\A---\r?\n.*?\r?\n---\r?\n', '', text, count=1, flags=re.S)


def prose(text):
    # Ignore template code blocks and inline code when inspecting actual links/headings.
    lines, fence = [], None
    for line in body(text).splitlines():
        mark = re.match(r'^\s*(`{3,}|~{3,})', line)
        if mark:
            if fence is None:
                fence = mark[1][0]
            elif mark[1][0] == fence:
                fence = None
            continue
        if fence is None:
            lines.append(re.sub(r'`[^`]*`', '', line))
    return '\n'.join(lines)


def anchors(text):
    found, counts = set(), {}
    for heading in re.findall(r'^ {0,3}#{1,6}\s+(.+?)\s*#*$', prose(text), re.M):
        slug = re.sub(r'[^\w\- ]', '', heading.lower(), flags=re.U).replace(' ', '-')
        number = counts.get(slug, 0)
        counts[slug] = number + 1
        found.add(slug + ('-' + str(number) if number else ''))
    return found


def inspect(snapshot, name):
    text = snapshot.read(name)
    if text is None:
        return {'file cannot be read'}
    errors = set()
    front = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    try:
        data = yaml.load(front[1], Loader=UniqueLoader) if front else None
        history = data.get('history') if isinstance(data, dict) else None
        if not isinstance(history, list) or not 1 <= len(history) <= 5:
            errors.add('history must contain 1..5 entries')
        for item in history if isinstance(history, list) else []:
            if not isinstance(item, dict) or not {'thread_id', 'date', 'change'} <= item.keys():
                errors.add('history entry missing thread_id/date/change')
                continue
            if not re.fullmatch(r'[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}', str(item['thread_id'])):
                errors.add('invalid thread_id format')
            try:
                datetime.date.fromisoformat(str(item['date']))
            except ValueError:
                errors.add('invalid history date')
            if not isinstance(item['change'], str) or not item['change'].strip():
                errors.add('empty history description')
    except yaml.YAMLError as error:
        errors.add('invalid YAML: ' + str(error).splitlines()[0])
    if not re.search(r'^#{1,6} Pravidla struktury\s*$', prose(text), re.M):
        errors.add('missing Pravidla struktury section')
    for target in re.findall(r'!?\[[^\]\n]*\]\((<[^>]+>|[^)\n]+)\)', prose(text)):
        target = target.strip().strip('<>')
        parts = urlsplit(target)
        if parts.scheme or parts.netloc or target.startswith('/'):
            continue
        path = unquote(parts.path)
        resolved = (snapshot.root / name).parent / path if path else snapshot.root / name
        try:
            relative = resolved.resolve().relative_to(snapshot.root.resolve()).as_posix()
        except ValueError:
            errors.add('link outside repository: ' + target)
            continue
        if not snapshot.exists(relative):
            errors.add('missing link target: ' + target)
        elif parts.fragment and relative.endswith('.md'):
            linked = snapshot.read(relative)
            if linked is not None and unquote(parts.fragment) not in anchors(linked):
                errors.add('missing heading anchor: ' + target)
    if name == EVIDENCE:
        records = re.split(r'^#### (Z\d+)\s+[^\n]+\n', prose(text), flags=re.M)
        ids = records[1::2]
        if len(ids) != len(set(ids)):
            errors.add('duplicate change ID')
        for change_id, content in zip(ids, records[2::2]):
            for label in ('Zadání', 'Stav', 'Ověření'):
                if not re.search(r'^- ' + label + r':\s*\S', content, re.M):
                    errors.add(change_id + ': missing ' + label)
    return errors


def run_checks(root, staged):
    snapshot = Snapshot(root, 'index' if staged else 'disk')
    baseline = Snapshot(root, 'HEAD')
    changed = git(root, 'diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z').decode('utf-8').split('\0')
    names = [n for n in changed if n.endswith('.md') and (n == 'AGENTS.md' or n.startswith(DOCS))] if staged else MAIN
    # Recheck inbound links even when only the destination's heading changed.
    if staged and git(root, 'diff', '--cached', '--name-only').strip():
        names = list(set(names + [n for n in MAIN if snapshot.exists(n)]))
    failures = []
    for name in sorted(set(names)):
        current = inspect(snapshot, name)
        old = inspect(baseline, name) if staged and baseline.exists(name) else set()
        for error in sorted(current - old):
            failures.append(name + ': ' + error)
        if staged:
            for error in sorted(current & old):
                print('EXISTING: ' + name + ': ' + error)
        if staged and name in changed and baseline.exists(name):
            old_front = baseline.read(name).split('---', 2)[1] if baseline.read(name).startswith('---') else ''
            new_text = snapshot.read(name)
            if new_text is None:
                continue
            new_front = new_text.split('---', 2)[1] if new_text.startswith('---') else ''
            if body(baseline.read(name)) != body(snapshot.read(name)) and old_front == new_front:
                failures.append(name + ': changed document requires updated YAML history')
    web_code = [n for n in changed if n.startswith('web_viewer/') and n.endswith(('.js', '.css', '.html'))
                and not any('/' + part + '/' in n for part in ('web_assets', 'old', 'testy', 'tools'))]
    if staged and web_code and (EVIDENCE not in changed or snapshot.read(EVIDENCE) == baseline.read(EVIDENCE)):
        failures.append('web code changes require staged ' + EVIDENCE)
    for failure in failures:
        print('ERROR: ' + failure)
    print(f'Documentation check: {len(failures)} error(s); mode=' + ('staged' if staged else 'full'))
    return 1 if failures else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--staged', action='store_true')
    parser.add_argument('--review-status', action='store_true')
    parser.add_argument('--review-complete', metavar='HEAD_SHA')
    args = parser.parse_args()
    root = Path(subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode().strip())
    state = root / 'web_viewer/old/documentation_review_state.json'
    if args.review_status or args.review_complete:
        head = git(root, 'rev-parse', 'HEAD').decode().strip()
        if args.review_complete:
            if args.review_complete != head:
                parser.error('HEAD changed during review; do not mark unreviewed commits complete')
            state.parent.mkdir(parents=True, exist_ok=True)
            temporary = state.with_suffix('.tmp')
            temporary.write_text(json.dumps({'last_reviewed_commit': head}, indent=2) + '\n', encoding='utf-8')
            temporary.replace(state)
            return 0
        previous = json.loads(state.read_text(encoding='utf-8'))['last_reviewed_commit'] if state.exists() else None
        valid = previous and subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', previous, head], capture_output=True).returncode == 0
        count = int(git(root, 'rev-list', '--count', previous + '..' + head)) if valid else None
        print(json.dumps({'head': head, 'last_reviewed_commit': previous, 'new_commits': count,
                          'review_due': count is None or count >= 10, 'baseline_changed': not bool(valid)}))
        return 0
    return run_checks(root, args.staged)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    sys.exit(main())
