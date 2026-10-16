import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createApp } from 'vue';
import { ArrowUpRight, ArrowRight, ChevronRight, BookOpen, Users, CalendarDays, Layers3, Database, Sparkles, GraduationCap, GitBranch, SlidersHorizontal, TrendingUp, ShieldCheck, Target, X, Menu, Check, Code2, ArrowUpRight as CircleArrowUpRight, Network, Waypoints } from 'lucide-react';
import Timeline from './Timeline.vue';
import { bid, type Member } from './content';

const navItems = [['Team', 'team'], ['Architecture', 'project'], ['Timeline', 'timeline'], ['Why us', 'why-us']];
const dimensions = [
  { title: 'Salary', icon: TrendingUp, description: 'Comparable salary percentiles', detail: 'We will normalise salary periods and ranges, then compare salary percentiles for similar roles in the same period and region. Missing or ambiguous salaries will remain visible.' },
  { title: 'Growth', icon: Sparkles, description: 'Demand & skill trends', detail: 'Occupation demand and monthly or quarterly skill shares will provide a proxy for growth. Seasonal-naive forecasts will be compared with lag-feature regression using chronological splits.' },
  { title: 'Stability', icon: ShieldCheck, description: 'Demand persistence & variation', detail: 'Historical demand persistence and variation will provide a proxy for stability. This measures patterns in recruitment records; it cannot establish an individual job’s security.' },
  { title: 'Skill Fit', icon: Target, description: 'Student–job skill matching', detail: 'Skill dictionaries and synonym rules will match student skills to job requirements and expose gaps. Semantic matching will be considered when pilot evidence supports an improvement; hybrid ranking will avoid counting skill fit twice.' },
];

function Mark({ className = '' }: { className?: string }) {
  return <svg className={`brand-mark ${className}`} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">{[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cx="24" cy="13.5" rx="6.3" ry="11" transform={`rotate(${angle} 24 24)`} />)}<circle cx="24" cy="24" r="7" /></svg>;
}

function Pill({ children, icon }: { children: ReactNode; icon?: ReactNode }) { return <span className="section-pill">{icon}{children}</span>; }

function TimelineBridge() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const app = createApp(Timeline, { phases: bid.phases });
    app.mount(mount.current!);
    return () => app.unmount();
  }, []);
  return <div ref={mount} />;
}

function ProposalOverview() {
  return <div className="proposal-overview">
    <div className="proposal-overview-heading"><span className="eyebrow">Our proposed approach</span><span className="proposal-label">P19 · Project bid</span></div>
    <div className="proposal-chain">{[
      { icon: Database, number: '01', title: 'Make the data usable', text: 'Start with the authorised Zhejiang graduate subset. Clean salary fields, extract skills and preserve provenance.' },
      { icon: SlidersHorizontal, number: '02', title: 'Make the ranking transparent', text: 'Combine student–job matching with salary, growth, stability and skill-fit scores under adjustable priorities.' },
      { icon: GraduationCap, number: '03', title: 'Make the next step clear', text: 'Explain the actual scores, reveal skill gaps and explore related occupations through a skill graph.' },
    ].map(({ icon: Icon, number, title, text }) => <article key={number}><div><Icon size={24} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="proposal-overview-footer"><span><GitBranch size={15} /> Explicit feedback → user-approved preference updates</span><a href="#project">Explore the system architecture <ArrowRight size={15} /></a></div>
  </div>;
}

function DataIllustration() {
  return <div className="data-concept" aria-label="Proposed offline data preparation">
    <span className="eyebrow">Offline data pipeline</span>
    <div><Database size={23} /><strong>Authorised recruitment records</strong><span>Zhejiang graduate subset</span></div>
    <ArrowDown />
    <p>Batch cleaning · salary normalisation<br />Deduplication · skill dictionaries</p>
    <ArrowDown />
    <div><Layers3 size={23} /><strong>Versioned features</strong><span>Parquet storage · DuckDB queries</span></div>
  </div>;
}

function SystemArchitecture() {
  const layers = [
    { n: '01', title: 'Prepare trusted data', stack: 'Python · pandas', text: 'Clean recruitment records in batches; normalise salary periods and ranges; remove cross-platform duplicates. Preserve original values, sources and transformation records.', output: 'Output: checked records, a data dictionary and quality statistics.' },
    { n: '02', title: 'Build reusable features', stack: 'Parquet · DuckDB · NetworkX', text: 'Store offline job features and query them separately from live requests. Build occupation–skill relationships and dated trend features; manually review candidate emerging occupations.', output: 'Output: versioned job features, skill dictionary, trends and graph.' },
    { n: '03', title: 'Match, score & explain', stack: 'scikit-learn · FastAPI', text: 'Filter by region and qualifications, retrieve candidates, and combine matching with four quality dimensions. Explanations use the computed scores and matched skills, with visible data dates and coverage.', output: 'Output: ranked jobs, dimension scores, matched skills, gaps and graph evidence.' },
    { n: '04', title: 'Connect the student experience', stack: 'React · TypeScript ↔ FastAPI', text: 'Profile, search, recommendation, explanation, graph and feedback endpoints will use documented JSON contracts. The web application will support priorities, filters, career pathways and guidance for empty results.', output: 'Input: major, skills, qualifications, location and career priorities.' },
    { n: '05', title: 'Keep feedback under user control', stack: 'SQLite · versioned configurations', text: 'Store student profiles, preferences and explicit feedback. Show suggested weight changes for users to accept, keep updates reversible, and record the configuration behind a recommendation.', output: 'Feedback loop: explicit relevance feedback → approved preferences → refreshed ranking.' },
  ];
  return <div className="architecture-section">
    <div className="architecture-heading"><div><span className="eyebrow">System architecture</span><h3>One system. Clear connections.</h3></div><p>Offline preparation produces reusable features. Online services connect those features with each student’s profile and priorities.</p></div>
    <div className="architecture-layers">{layers.map(layer => <article key={layer.n}><span className="architecture-number">{layer.n}</span><div className="architecture-layer-title"><h4>{layer.title}</h4><span>{layer.stack}</span></div><div className="architecture-layer-copy"><p>{layer.text}</p><small>{layer.output}</small></div></article>)}</div>
    <div className="engineering-strip"><ShieldCheck size={22} /><p><strong>Shared definitions, repeatable delivery.</strong> GitHub reviews and automated checks will cover cleaning, scoring, ranking and API integration. Docker will package the application; data, dictionaries, scoring configurations and evaluation splits will be versioned.</p></div>
  </div>;
}

function QualityIllustration() {
  return <div className="quality-illustration" aria-label="Four-dimensional quality model: salary, growth, stability, and skill fit">
    <div className="orbit orbit-outer" /><div className="orbit orbit-inner" />
    <svg viewBox="0 0 440 300" className="quality-lines" aria-hidden="true"><path d="M220 63L342 150 220 237 98 150Z" fill="#0670ff0b" stroke="#a9cfff" strokeWidth="1" /><path d="M220 63V237M98 150H342" stroke="#a9cfff" strokeDasharray="4 4" /></svg>
    <div className="quality-center"><Mark /><span>Job quality</span><small>Transparent & adjustable</small></div>
    {dimensions.map(({ title, icon: Icon }, i) => <div className={`quality-node qn-${i}`} key={title}><Icon size={15} /><span>{title}</span></div>)}
    <span className="quality-footnote">Student-defined priorities</span>
  </div>;
}

function Modal({ title, subtitle, children, onClose, wide = false }: { title: string; subtitle: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previous; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'modal-wide' : ''}`} aria-labelledby="modal-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}>
    <div className="modal-top"><div><span className="eyebrow">{subtitle}</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" aria-label="Close dialog" autoFocus onClick={onClose}><X size={21} /></button></div>{children}
  </dialog>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [reader, setReader] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [activeDimension, setActiveDimension] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); }, { rootMargin: '-18% 0px -55% 0px' });
    navItems.forEach(([, id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><div className="nav-wrap"><a href="#" className="brand" aria-label="SmartCareer home"><span>SmartCareer</span></a><nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} className={activeSection === id ? 'nav-active' : ''}>{label}</a>)}</nav><div className="nav-actions"><span className="team-nav">UNNC GRP Team202610</span><button className="button button-small" onClick={() => setReader(true)}>Read the bid <ArrowUpRight size={14} /></button><button className="menu-button icon-button" aria-expanded={menu} aria-controls="mobile-navigation" aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></div>{menu && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={16} /></a>)}<button onClick={() => { setMenu(false); setReader(true); }}>Read the complete bid <BookOpen size={17} /></button></nav>}</header>
    <main id="main">
      <section className="hero container">
        <Pill icon={<span className="status-dot" />}>P19 <span className="pill-divider" /> UNNC GRP Team202610</Pill>
        <h1>SmartCareer<span className="title-period">.</span></h1>
        <p className="hero-subtitle">A Personalized Employment Recommendation System<br className="desktop-break" /> with a Multi-Dimensional Job Quality Evaluation Model</p>
        <p className="hero-description">We bring data preparation, model evaluation and application development together<br className="desktop-break" /> to help students understand why a job fits — and what they can learn next.</p>
        <div className="hero-buttons"><button className="button" onClick={() => setReader(true)}>Read our bid <ChevronRight size={17} /></button><a href="#project" className="text-button">Explore the proposal <ArrowDown /></a></div>
        <div className="hero-meta"><span>7 members · complementary experience</span><i /><span>21 Oct 2026 — 1 Apr 2027</span></div>
        <ProposalOverview />
      </section>

      <section id="team" className="section team-section"><div className="container">
        <div className="section-heading"><Pill icon={<Users size={13} />}>The people behind the proposal</Pill><h2>Meet the team.</h2><p>Seven members. Complementary experience in data,<br className="desktop-break" /> algorithms, applications, and delivery.</p></div>
        <article className="leader-card"><div className="leader-identity"><div className="avatar avatar-leader"><span>ZX</span><Mark /></div><div><span className="member-role">Team leader</span><h3>{bid.members[0].name}</h3><p>System design & model evaluation</p><div className="skill-tags">{bid.members[0].tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></div><div className="leader-detail"><p>{bid.members[0].background}</p><div className="leader-experience"><span>Pony.ai internship</span><span>4DGS-Edit-and-Compare</span><span>MomoFocus</span></div><div className="member-contribution"><span className="eyebrow">Planned contribution</span><p>{bid.members[0].responsibility}</p></div><a className="profile-website" href="https://qqqqqprofile.vercel.app/" target="_blank" rel="noreferrer">Personal website <ArrowUpRight size={14} /></a><button className="text-button" onClick={() => setMember(bid.members[0])}>View profile & experience <ArrowUpRight size={16} /></button></div></article>
        <div className="member-grid">{bid.members.slice(1).map((m, i) => <article className="member-card" key={m.name}><div className="member-card-top"><div className={`avatar avatar-${i}`}><span>{m.initials}</span></div><span className="member-role">Member</span></div><h3>{m.name}</h3><p className="member-focus">{m.focus}</p><div className="member-evidence"><span className="eyebrow">Experience & preparation</span><ul>{m.evidence.map(item => <li key={item}>{item}</li>)}</ul></div><div className="member-contribution"><span className="eyebrow">Planned contribution</span><p>{m.responsibility}</p></div><div className="skill-tags">{m.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="member-card-bottom"><span>Full profile & experience</span><button className="icon-button" aria-label={`View ${m.name}'s profile`} onClick={() => setMember(m)}><ArrowUpRight size={19} /></button></div></article>)}</div>
        <div className="team-workflow"><GitBranch size={17} /><p>We will work across data, algorithms and application delivery, learn unfamiliar methods together, and adjust responsibilities through progress discussions and supervisor feedback.</p></div>
      </div></section>

      <section id="project" className="section container">
        <div className="section-heading"><Pill icon={<Layers3 size={13} />}>The project plan</Pill><h2>From data to a clear decision.</h2><p>Our proposed architecture connects recruitment data, student profiles,<br className="desktop-break" /> transparent scoring and recommendations with evidence.</p></div>
        <SystemArchitecture /><div className="feature-grid"><article className="feature-card"><DataIllustration /><div className="feature-copy"><span className="eyebrow">01 / Data preparation</span><h3>Data quality before recommendation complexity.</h3><p>We will begin with the Zhejiang graduate subset, clean recruitment records, normalise salary fields, and build a documented skill dictionary.</p><div className="subtle-tags"><span>Batch processing</span><span>Source records</span><span>Quality checks</span></div></div></article><article className="feature-card"><QualityIllustration /><div className="feature-copy"><span className="eyebrow">02 / Job quality evaluation</span><h3>A multi-dimensional job quality model.</h3><p>Students will adjust the importance of salary, growth, stability, and skill fit, and see the scores and evidence behind their recommendations.</p><div className="subtle-tags"><span>Adjustable weights</span><span>Clear explanations</span></div></div></article></div>
        <div className="dimension-selector"><div className="dimension-tabs" role="tablist" aria-label="Quality model dimensions">{dimensions.map(({ title, icon: Icon }, i) => <button key={title} id={`dimension-tab-${i}`} role="tab" aria-selected={activeDimension === i} aria-controls="dimension-description" tabIndex={activeDimension === i ? 0 : -1} className={activeDimension === i ? 'active' : ''} onClick={() => setActiveDimension(i)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (i + (event.key === 'ArrowRight' ? 1 : 3)) % 4; setActiveDimension(next); document.getElementById(`dimension-tab-${next}`)?.focus(); } }}><Icon size={16} />{title}</button>)}</div><p id="dimension-description" role="tabpanel" aria-labelledby={`dimension-tab-${activeDimension}`}>{dimensions[activeDimension].detail}</p><span className="model-note">Non-negative weights will sum to one. Missing dimensions will use explicit coverage rules; hybrid ranking will avoid counting skill fit twice. Growth and stability are proxy measures. Historical records will be dated and distinguished from current vacancies.</span></div>
        <div className="application-feature"><div className="application-copy"><Pill icon={<GraduationCap size={13} />}>The student experience</Pill><h3>From a profile to an explained recommendation.</h3><p>Students will enter their major, skills, qualifications, location, and career priorities. Ranked jobs will show matched skills, skill gaps, and related career pathways.</p><ul className="check-list"><li><Check />Profile-based matching and qualification filters</li><li><Check />Occupation–skill relationships and score breakdowns</li><li><Check />Visible, reversible preference updates</li></ul><button className="text-button" onClick={() => setReader(true)}>Read the system design <ArrowUpRight size={16} /></button></div><div className="journey-visual"><span className="eyebrow">Student journey</span>{[{ n: '01', title: 'Build a student profile', desc: 'Major · Skills · Qualifications · Location', icon: Users }, { n: '02', title: 'Set career priorities', desc: 'Salary · Growth · Stability · Skill fit', icon: SlidersHorizontal }, { n: '03', title: 'Explore & understand', desc: 'Ranked jobs · Explanations · Skill gaps', icon: Network }, { n: '04', title: 'Give explicit feedback', desc: 'User-approved preference updates', icon: GitBranch }].map(({ n, title, desc, icon: Icon }) => <div className="journey-step" key={n}><span className="journey-step-icon"><Icon size={20} /></span><div><strong>{title}</strong><small>{desc}</small></div><span className="journey-number">{n}</span></div>)}</div></div>
        
        <div className="flow-section"><div className="flow-heading"><h3>The proposed data flow.</h3><span>Authorised data · Traceable decisions</span></div><div className="data-flow">{[
          ['Recruitment data', 'Authorised Zhejiang graduate subset'],
          ['Clean & extract', 'Salary normalisation, deduplication, skills'],
          ['Feature storage', 'Parquet features and DuckDB queries'],
          ['Trends & relationships', 'Forecast baselines and occupation–skill graph'],
          ['Match & score', 'Student profiles and four quality dimensions'],
          ['Rank & explain', 'Actual scores, matched skills, and gaps'],
          ['User feedback', 'Explicit, reversible preference updates'],
        ].map(([title, detail], i) => <div className="flow-node" key={title}><span>0{i + 1}</span><h4>{title}</h4><p>{detail}</p></div>)}</div></div>
        <div className="deliverables"><h3>Core deliverables.</h3><p>A clean queryable dataset; a skill dictionary and new-occupation graph; a documented quality model; an evaluated recommendation module; a working web application; and the final report, source code, and demonstration.</p></div>
<div className="stack-strip"><span>Proposed technology</span><div>{['Python', 'pandas', 'Parquet', 'DuckDB', 'SQLite', 'FastAPI', 'scikit-learn', 'NetworkX', 'React / TypeScript', 'Docker'].map(tech => <span key={tech}>{tech}</span>)}</div></div>
        <div className="evaluation-grid"><article><Code2 size={22} /><h3>Compare before adding complexity.</h3><p>We will compare keyword, skill-only and hybrid ranking with HR@k, NDCG and MRR. Chronological splits will test forecasts; saved configurations and labels will keep comparisons reproducible.</p></article><article><Users size={22} /><h3>Check the student experience.</h3><p>Approved student trials will assess explanations, skill gaps, empty results and preference changes. Latency and resource checks will test the working application. Participant work will start after the required approval.</p></article></div>
      </section>

      <section id="timeline" className="section container"><div className="section-heading"><Pill icon={<CalendarDays size={13} />}>The delivery plan</Pill><h2>Timeline & workflow.</h2><p>A reproducible baseline first. Integration and evaluation next.<br className="desktop-break" /> Clear milestones through to final submission.</p></div><div className="timeline-summary"><div><span>Project start</span><strong>21 Oct 2026</strong></div><span className="timeline-summary-line" /><div><span>First working demonstration</span><strong>15 Dec 2026</strong></div><span className="timeline-summary-line" /><div><span>Final submission</span><strong>1 Apr 2027</strong></div></div><TimelineBridge /><div className="timeline-footnote"><CalendarDays size={14} /><p>Dates follow the supplied tentative course schedule and remain subject to formal notices. Select a phase to read its planned tasks.</p></div></section>

      <section id="why-us" className="section why-section"><div className="container"><div className="section-heading"><Pill icon={<Target size={13} />}>Why our team fits this project</Pill><h2>Relevant experience. <span className="muted-heading">A practical delivery plan.</span></h2><p>Our bid connects existing experience with the specific<br className="desktop-break" /> challenges of SmartCareer.</p></div><div className="why-grid"><article><span className="why-icon"><Database size={23} /></span><span className="eyebrow">01 / Data</span><h3>Data quality before recommendation complexity.</h3><p>Yun Xin NG’s data-engineering and machine-learning experience, together with Ziqian ZHANG’s research annotation background, support documented pipelines and checked samples.</p><div className="why-footer">Data preparation → Reliable evaluation</div></article><article><span className="why-icon"><Waypoints size={23} /></span><span className="eyebrow">02 / Implementation</span><h3>From a transparent baseline to a usable service.</h3><p>Ziqian XIONG and Yue WU will connect model evaluation and scoring; Xinyun HU will build profile-to-result pages. Oswald Yiwen CHONG will support services and deployment; Jinyao LU will organise requirements, approved trials, and demonstrations.</p><div className="why-footer">Baseline → Integration → Student trials</div></article><article><span className="why-icon"><Users size={23} /></span><span className="eyebrow">03 / Leadership & initiative</span><h3>Shared learning. Consistent follow-through.</h3><p>Ziqian XIONG will guide shared learning, break down unfamiliar tasks and coordinate dependencies. Members will investigate methods, raise blockers early and act on feedback. Weekly progress reviews, paired discussions and early demonstrations will turn that initiative into visible progress; the low-workload period will use asynchronous check-ins.</p><div className="why-footer">Shared interfaces → Consistent follow-through</div></article></div><div className="final-bid"><div className="final-bid-art" aria-hidden="true"><Mark /><span>P19</span></div><span className="eyebrow">UNNC GRP Team202610 · P19 proposal</span><h2>Explore our full proposal.</h2><p>SmartCareer needs a team that can connect real recruitment data, transparent evaluation, and a usable student application. We will demonstrate a reproducible baseline first, then use ranking metrics and student trials to justify improvements.</p><button className="button" onClick={() => setReader(true)}>Read the complete bid <ArrowUpRight size={17} /></button><span className="bid-date">Bid dated {bid.date} · Content verified 16 October 2026</span></div></div></section>
    </main>
    <footer className="site-footer container"><div className="footer-main"><a href="#" className="brand"><Mark /><span>SmartCareer</span></a><p>P19 · Personalized employment recommendations<br />University of Nottingham Ningbo China</p><a className="back-top" href="#">Back to top <CircleArrowUpRight size={19} /></a></div><div className="footer-bottom"><span>UNNC GRP Team202610</span><span>Project bid · 2026–2027</span><button onClick={() => setReader(true)}>Read the bid <ArrowUpRight size={12} /></button></div></footer>

    {member && <Modal title={member.name} subtitle={`${member.role} · ${bid.team}`} onClose={() => setMember(null)}><div className="member-modal-body"><div className="proposed-role"><span className="eyebrow">Planned contribution to P19</span><p>{member.responsibility}</p></div><div className="prose" dangerouslySetInnerHTML={{ __html: member.html }} /></div></Modal>}
    {reader && <Modal title="Bid for P19" subtitle={`${bid.team} · ${bid.date}`} onClose={() => setReader(false)} wide><div className="reader-layout"><nav className="reader-toc" aria-label="Bid chapters"><span className="eyebrow">In this proposal</span>{bid.sections.map((s, i) => <a href={`#${s.id}`} key={s.id} onClick={event => { event.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.getElementById(s.id)?.focus({ preventScroll: true }); }}><span>0{i + 1}</span>{s.title}</a>)}</nav><article className="reader-content prose"><div className="report-cover"><span className="eyebrow">P19 · SMARTCAREER</span><h2>{bid.title}</h2><p>{bid.team}<br />{bid.date}</p></div>{bid.sections.map((s, i) => <section id={s.id} key={s.id} tabIndex={-1}><span className="eyebrow">Chapter 0{i + 1}</span><h2>{s.title}</h2><div dangerouslySetInnerHTML={{ __html: s.html }} /></section>)}</article></div></Modal>}
  </>;
}

function ArrowDown() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v12m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export default App;
