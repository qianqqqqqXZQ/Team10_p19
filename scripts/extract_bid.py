"""Build website content from the preserved English bid; never edits source material."""
from pathlib import Path
import html
import json
import re
import argparse
import hashlib
from datetime import datetime
import shutil

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-root', type=Path, help='Refresh the P19 source snapshots from this bid repository before extraction.')
args = parser.parse_args()
if args.source_root:
    for filename in ('bid_P19.tex', 'bid_P19_zh.tex', 'project_plan_P19.md'):
        source = args.source_root / 'results' / filename
        shutil.copy2(source, ROOT / 'reference-materials/results' / filename)
SOURCE = ROOT / 'reference-materials/results/bid_P19.tex'
text = SOURCE.read_text(encoding='utf-8')
def macro(name):
    return re.search(r'\\newcommand\{\\' + name + r'\}\{([^}]+)\}', text).group(1)
TITLE, TEAM, DATE = macro('BidProjectName'), macro('BidTeam'), macro('BidDate')


def argument(value, start):
    assert value[start] == '{', value[start:start + 40]
    depth, pos = 1, start + 1
    while depth:
        if value[pos] == '{' and value[pos - 1] != '\\':
            depth += 1
        elif value[pos] == '}' and value[pos - 1] != '\\':
            depth -= 1
        pos += 1
    return value[start + 1:pos - 1], pos


def inline(value):
    out, pos = [], 0
    while pos < len(value):
        if value[pos] != '\\':
            out.append(html.escape(value[pos]))
            pos += 1
            continue
        match = re.match(r'\\([a-zA-Z]+|.)', value[pos:])
        command = match.group(1)
        pos += len(match.group())
        if command in ('textbf', 'emph', 'texttt', 'nolinkurl', 'url'):
            arg, pos = argument(value, pos)
            if command == 'url':
                out.append(f'<a href="{html.escape(arg, quote=True)}" target="_blank" rel="noreferrer">{html.escape(arg)}</a>')
            else:
                tag = {'textbf': 'strong', 'emph': 'em', 'texttt': 'code', 'nolinkurl': 'span'}[command]
                out.append(f'<{tag}>{inline(arg)}</{tag}>')
        elif command == 'href':
            url, pos = argument(value, pos)
            label, pos = argument(value, pos)
            attrs = '' if url.startswith('mailto:') else ' target="_blank" rel="noreferrer"'
            out.append(f'<a href="{html.escape(url, quote=True)}"{attrs}>{inline(label)}</a>')
        elif command == 'PersonalInformation':
            student_id, pos = argument(value, pos)
            email, pos = argument(value, pos)
            if '\\' not in email:
                email = r'\href{mailto:' + email + '}{' + email + '}'
            out.append('<span class="personal-info">' + (f'<strong>Student ID:</strong> {student_id}<br/>' if student_id else '') + f'<strong>Email:</strong> {inline(email)}</span>')
        elif command == 'BidProjectName':
            out.append(TITLE)
        elif command == 'rightarrow':
            out.append(' → ')
        elif command in ('&', '%', '_', '#'):
            out.append(html.escape(command))
        elif command == '\\':
            out.append('<br/>')
        else:
            raise ValueError(f'Unsupported content command: {command}')
    return ''.join(out).replace('--', '–').replace('$', '').strip()


def render(value):
    value = re.sub(r'%[^\n]*', '', value)
    value = re.sub(r'\\Needspace\{[^}]*\}', '', value)
    value = re.sub(r'\\(?:newpage|clearpage|noindent|medskip)\b', '', value)
    value = re.sub(r'\\par\b', '\n\n', value)
    # The nine date ranges below replace the source's visual monthly table.
    value = re.sub(r'\\begin\{figure\}.*?\\end\{figure\}', '', value, flags=re.S)
    token = r'(\\(?:section|subsection)\*?\{[^}]*\}|\\begin\{(?:itemize|enumerate)\}|\\end\{(?:itemize|enumerate)\}|\\item\b)'
    pieces = re.split(token, value)
    result, stack = [], []
    for part in pieces:
        if part.startswith('\\section') or part.startswith('\\subsection'):
            heading = re.search(r'\{(.*)\}', part).group(1)
            tag = 'h2' if part.startswith('\\section') else ('h4' if '*' in part else 'h3')
            result.append(f'<{tag}>{inline(heading)}</{tag}>')
        elif part.startswith('\\begin'):
            tag = 'ul' if 'itemize' in part else 'ol'
            stack.append([tag, False])
            result.append(f'<{tag}>')
        elif part.startswith('\\end'):
            tag, opened = stack.pop()
            result.append(('</li>' if opened else '') + f'</{tag}>')
        elif part.startswith('\\item'):
            if stack[-1][1]:
                result.append('</li>')
            result.append('<li>')
            stack[-1][1] = True
        else:
            for paragraph in re.split(r'\n\s*\n', part):
                clean = re.sub(r'\s+', ' ', paragraph).strip()
                if clean:
                    result.append('<p>' + inline(clean) + '</p>')
    assert not stack
    return '\n'.join(result)


body = text.split('\\section{Introduction}', 1)[1].split('\\end{document}', 1)[0]
body = '\\section{Introduction}' + body
names = ['Ziqian XIONG', 'Yun Xin NG', 'Jinyao LU', 'Oswald Yiwen CHONG', 'Ziqian ZHANG', 'Yue WU', 'Xinyun HU']
focus = [
    'System design & model evaluation', 'Data preparation & forecasting',
    'Student requirements & communication', 'Application integration & delivery',
    'Annotation & data quality', 'Scoring & occupation relationships',
    'Profiles & recommendation interfaces',
]
tags = [['Python', 'PyTorch', 'React'], ['Data engineering', 'Machine learning'], ['Research', 'Technical writing'], ['CI/CD', 'GitHub', 'Applications'], ['Labelme', 'JSON', 'Data preparation'], ['Python', 'SQLite', 'Algorithms'], ['Web technologies', 'SQL', 'Java']]
backgrounds = [
    'Computer Science undergraduate; medical image segmentation research, Pony.ai internship, and Flask/React projects.',
    'Second-year Computer Science exchange student; YTL AI Labs data extraction and model selection, alongside machine learning projects.',
    'Computer Science and AI undergraduate; LLM research, software-workflow internships, and AI hackathon organisation.',
    'Computer Science with AI student; blockchain-based bouldering application, GitHub collaboration, and CI/CD skills.',
    'Third-year Computer Science student; research image annotation and data preparation using Labelme and JSON.',
    'Computer Science student; programming coursework, database foundations, and CCN research writing.',
    'Third-year Computer Science student; programming, SQL, and web foundations, alongside an AI-enabled Connect Four project.',
]
evidence = [
    ['Pony.ai algorithm internship: feasibility validation and engineering integration', '4DGS-Edit-and-Compare: Python/Flask and interactive 3D software', 'MomoFocus: React/TypeScript application and desktop packaging'],
    ['YTL AI Labs: web/PDF extraction and benchmark-based model selection', 'Machine learning project: training/test splits and model training', 'Internship Management System: HTML, CSS, Java and MySQL'],
    ['Software-workflow and information-platform internships', 'First-author LLM/autonomous-driving paper accepted by an international journal', 'Douyin AI hackathon: campus organising team and event coordination'],
    ['Blockchain-based bouldering social application', 'GitHub version control and team collaboration', 'CI/CD pipeline skills for reliable software delivery'],
    ['AI-driven magnet-performance research: image annotation and data preparation', 'Labelme and JSON annotation/data management'],
    ['Programming coursework and algorithmic problem solving', 'CCN research: literature review, technical analysis and writing', 'Python, MySQL and SQLite foundations'],
    ['AI-enabled Connect Four project', 'Programming, SQL and database foundations', 'HTML/CSS, Git and web-development tools'],
]
distribution = text.split('\\subsection{Work Distribution}', 1)[1]
members = []
for i, name in enumerate(names):
    section = body.split('\\subsection{' + name + '}', 1)[1]
    section = re.split(r'\\subsection\{', section, maxsplit=1)[0]
    bio = section.split('\\subsection*{Introduction}', 1)[1].split('\\subsection*{', 1)[0].strip()
    role = re.search(r'\\item \\textbf\{' + re.escape(name) + r':\} (.*)', distribution).group(1)
    members.append(dict(name=name, initials=''.join(n[0] for n in name.split()), role='Leader' if i == 0 else 'Member', focus=focus[i], tags=tags[i], background=backgrounds[i], evidence=evidence[i], bio=render(bio), html=render(section), responsibility=role))

phase_meta = [
    ('Requirements & data audit', '2026-10-21', '2026-11-03', 'active'),
    ('Cleaning & matching baseline', '2026-11-04', '2026-11-24', 'active'),
    ('First workflow & pilot comparisons', '2026-11-25', '2026-12-15', 'active'),
    ('Document review & earlier tasks', '2026-12-16', '2027-01-05', 'review'),
    ('Low-workload review & documentation', '2027-01-06', '2027-02-28', 'light'),
    ('Web & feedback integration', '2027-03-01', '2027-03-09', 'active'),
    ('Evaluation & student trials', '2027-03-10', '2027-03-16', 'active'),
    ('Release, report & demonstration', '2027-03-17', '2027-03-30', 'active'),
    ('Submission checks', '2027-03-31', '2027-04-01', 'active'),
]
timeline = body.split('\\end{figure}', 1)[1].split('\\subsection{Work Distribution}', 1)[0]
phase_matches = re.findall(r'\\item \\textbf\{([^}]+)\}\s*\\begin\{itemize\}(.*?)\\end\{itemize\}', timeline, re.S)
assert len(phase_matches) == 9
phases = []
for i, ((label, tasks), (title, start, end, kind)) in enumerate(zip(phase_matches, phase_meta)):
    task_list = [inline(re.sub(r'\s+', ' ', x).strip()) for x in tasks.split('\\item')[1:]]
    phases.append(dict(id=i, title=title, date=inline(label), start=start, end=end, kind=kind, tasks=task_list))

sections = []
for i, match in enumerate(re.finditer(r'\\section\{([^}]+)\}(.*?)(?=\\section\{|\Z)', body, re.S)):
    title, content = match.groups()
    chapter_html = render(content)
    if title == 'Timeline \\& Workflow and Work Distribution':
        table = '<div class="reader-table-wrap"><table class="reader-schedule"><caption>Project timetable — tentative planning windows</caption><thead><tr><th>Dates</th><th>Planned phase</th></tr></thead><tbody>'
        for phase in phases:
            table += f'<tr data-kind="{phase["kind"]}"><td>{phase["date"]}</td><td>{html.escape(phase["title"])}</td></tr>'
        table += '</tbody></table></div>'
        chapter_html = chapter_html.replace('<h3>Timeline &amp; Workflow</h3>', '<h3>Timeline &amp; Workflow</h3>' + table)
    sections.append(dict(id=f'chapter-{i + 1}', title=html.unescape(inline(title)), html=chapter_html))
assert len(sections) == 5
data = dict(title=TITLE, date=DATE, team=TEAM, source=dict(file='reference-materials/results/bid_P19.tex', modified=datetime.fromtimestamp(SOURCE.stat().st_mtime).isoformat(timespec='seconds'), sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest()), members=members, phases=phases, sections=sections)
(ROOT / 'src/bid-content.json').write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Extracted {len(members)} members, {len(phases)} date ranges and {len(sections)} complete chapters.')
