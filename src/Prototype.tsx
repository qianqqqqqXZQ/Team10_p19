import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, CheckCheck, Compass, GraduationCap, MapPin, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles, Target, TrendingUp } from 'lucide-react';

const qualityDimensions = [
  { key: 'salary', label: 'Salary', icon: TrendingUp },
  { key: 'growth', label: 'Growth', icon: Sparkles },
  { key: 'stability', label: 'Stability', icon: ShieldCheck },
  { key: 'skillFit', label: 'Skill Fit', icon: Target },
] as const;

type Dimension = typeof qualityDimensions[number]['key'];
type Scores = Record<Dimension, number>;
type ExampleJob = {
  id: string;
  title: string;
  company: string;
  initials: string;
  city: string;
  salary: string;
  scores: Scores;
  matchedSkills: string[];
  skillGaps: string[];
};

const defaultPriorities: Scores = { salary: 25, growth: 25, stability: 25, skillFit: 25 };
const growthPriorities: Scores = { salary: 20, growth: 40, stability: 15, skillFit: 25 };
const exampleJobs: ExampleJob[] = [
  { id: 'software', title: 'Graduate Software Engineer', company: 'Cedarbyte Studio', initials: 'CS', city: 'Hangzhou', salary: '12,000–18,000', scores: { salary: 92, growth: 70, stability: 65, skillFit: 80 }, matchedSkills: ['Python', 'SQL'], skillGaps: ['Git', 'REST APIs'] },
  { id: 'data', title: 'Junior Data Analyst', company: 'Lumenfield Analytics', initials: 'LA', city: 'Ningbo', salary: '10,000–16,000', scores: { salary: 72, growth: 95, stability: 60, skillFit: 90 }, matchedSkills: ['Python', 'SQL', 'pandas'], skillGaps: ['Data visualisation'] },
  { id: 'support', title: 'IT Support Associate', company: 'Harborleaf Systems', initials: 'HS', city: 'Jiaxing', salary: '8,000–12,000', scores: { salary: 65, growth: 60, stability: 95, skillFit: 75 }, matchedSkills: ['Python', 'SQL'], skillGaps: ['Networking', 'Troubleshooting'] },
];

function normalise(priorities: Scores): Scores {
  const total = Object.values(priorities).reduce((sum, value) => sum + value, 0);
  if (total === 0) return { salary: .25, growth: .25, stability: .25, skillFit: .25 };
  return { salary: priorities.salary / total, growth: priorities.growth / total, stability: priorities.stability / total, skillFit: priorities.skillFit / total };
}

function rankJobs(weights: Scores) {
  return exampleJobs.map((job, order) => ({ ...job, order, score: qualityDimensions.reduce((sum, { key }) => sum + job.scores[key] * weights[key], 0) }))
    .sort((a, b) => b.score - a.score || a.order - b.order);
}

function percentage(value: number) {
  return `${Number((value * 100).toFixed(1))}%`;
}

export default function Prototype() {
  const [priorities, setPriorities] = useState<Scores>({ ...defaultPriorities });
  const weights = normalise(priorities);
  const rankedJobs = rankJobs(weights);
  const [selectedId, setSelectedId] = useState(() => rankJobs(normalise(defaultPriorities))[0].id);
  const [suggestion, setSuggestion] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const feedbackButton = useRef<HTMLButtonElement>(null);
  const selectedJob = rankedJobs.find(job => job.id === selectedId)!;
  const selectedRank = rankedJobs.findIndex(job => job.id === selectedId) + 1;
  const leadingDimension = [...qualityDimensions].sort((a, b) => selectedJob.scores[b.key] * weights[b.key] - selectedJob.scores[a.key] * weights[a.key])[0];
  const allZero = Object.values(priorities).every(value => value === 0);
  const rankingSummary = `Top recommendation: ${rankedJobs[0].title}, ${rankedJobs[0].score.toFixed(1)} out of 100. Selected: ${selectedJob.title}, rank ${selectedRank}, ${selectedJob.score.toFixed(1)} out of 100.`;

  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(rankingSummary), 300);
    return () => window.clearTimeout(timer);
  }, [rankingSummary]);

  function resolveSuggestion(apply: boolean) {
    if (apply) setPriorities({ ...growthPriorities });
    setSuggestion(false);
    setFeedbackStatus(apply ? 'Growth preferences applied. Your recommendations have been refreshed.' : 'Suggestion cancelled. Your priorities are unchanged.');
    feedbackButton.current?.focus({ preventScroll: true });
  }

  return <section id="prototype" className="section prototype-section" aria-labelledby="prototype-heading">
    <div className="container">
      <div className="section-heading">
        <span className="section-pill"><Compass size={14} /> The product, imagined</span>
        <h2 id="prototype-heading">A first look at SmartCareer.</h2>
        <p>Your skills. Your priorities. A clearer next step.<br />Adjust the priorities and explore what makes each role a fit.</p>
      </div>

      <div className="prototype-workspace">
        <div className="prototype-window-bar"><span className="prototype-window-dots" aria-hidden="true"><i /><i /><i /></span><span>SMARTCAREER / STUDENT WORKSPACE</span><span className="prototype-concept-label"><span />Interactive concept · Sample data</span></div>
        <div className="prototype-app-header">
          <div className="prototype-app-brand"><span className="prototype-brand-icon"><Compass size={23} /></span><div><strong>SmartCareer</strong><span>A little direction. A world of possibility.</span></div></div>
          <span className="prototype-student-badge"><GraduationCap size={16} />Graduate opportunities</span>
        </div>

        <div className="prototype-columns">
          <aside className="prototype-profile" aria-labelledby="prototype-profile-heading">
            <div className="prototype-panel-heading"><span className="prototype-step">01</span><h3 id="prototype-profile-heading">Student profile</h3></div>
            <div className="prototype-profile-card">
              <span className="prototype-avatar"><GraduationCap size={26} /></span>
              <strong>Your next chapter</strong><span>Example graduate profile</span>
              <dl><div><dt>Major</dt><dd>Computer Science</dd></div><div><dt>Qualification</dt><dd>Bachelor’s degree</dd></div><div><dt>Preferred region</dt><dd><MapPin size={12} />Zhejiang, China</dd></div></dl>
              <div className="prototype-chips" aria-label="Student skills">{['Python', 'SQL', 'pandas'].map(skill => <span key={skill}>{skill}</span>)}</div>
            </div>
            <div className="prototype-priorities">
              <h4><SlidersHorizontal size={15} />What matters to you?</h4>
              <p>Move a slider to change its relative importance.</p>
              {qualityDimensions.map(({ key, label, icon: Icon }) => <div className="prototype-priority" key={key}>
                <div><label htmlFor={`prototype-weight-${key}`}><Icon size={14} />{label}</label><output htmlFor={`prototype-weight-${key}`}>{percentage(weights[key])}</output></div>
                <input id={`prototype-weight-${key}`} type="range" min="0" max="100" step="1" value={priorities[key]} aria-valuetext={`${priorities[key]} relative importance; ${percentage(weights[key])} of total weight`} aria-describedby="prototype-weight-help" style={{ backgroundSize: `${priorities[key]}% 100%` }} onChange={event => { setPriorities(previous => ({ ...previous, [key]: Number(event.target.value) })); setFeedbackStatus(''); }} />
              </div>)}
              <p id="prototype-weight-help" className="prototype-weight-help" role="status">{allZero ? 'All priorities are zero. Using equal weights of 25% each.' : 'Shown as a share of your total priorities.'}</p>
              <button type="button" className="prototype-reset" onClick={() => { setPriorities({ ...defaultPriorities }); setSuggestion(false); setFeedbackStatus('Equal priorities restored.'); }}><RotateCcw size={13} />Reset priorities</button>
            </div>
          </aside>

          <div className="prototype-recommendations" aria-labelledby="prototype-recommendations-heading">
            <div className="prototype-panel-heading"><span className="prototype-step">02</span><h3 id="prototype-recommendations-heading">Recommended for you</h3></div>
            <div className="prototype-results-caption"><span>3 example opportunities</span><span><SlidersHorizontal size={12} />Ranked by your priorities</span></div>
            <ol className="prototype-job-list" aria-label="Ranked example jobs">{rankedJobs.map((job, index) => <li key={job.id}>
              <button type="button" className={`prototype-job ${job.id === selectedId ? 'prototype-job-selected' : ''}`} aria-pressed={job.id === selectedId} aria-controls="prototype-job-detail" onClick={() => setSelectedId(job.id)}>
                <span className="prototype-job-top"><span className={`prototype-company-icon prototype-company-${job.id}`}>{job.initials}</span><span className="prototype-company-name">{job.company}<span><MapPin size={11} />{job.city}, Zhejiang</span></span><span className="prototype-rank">#{index + 1}</span></span>
                <span className="prototype-job-title">{job.title}</span>
                <span className="prototype-job-pay">¥{job.salary}<small> / month</small></span>
                <span className="prototype-chips prototype-job-skills">{job.matchedSkills.map(skill => <span key={skill}><Check size={11} />{skill}</span>)}</span>
                <span className="prototype-job-bottom"><span><strong>{job.score.toFixed(1)}</strong><span> / 100 fit score</span></span><span className="prototype-job-open">{job.id === selectedId ? 'Viewing details' : 'Explore fit'}<ArrowUpRight size={14} /></span></span>
              </button>
            </li>)}</ol>
            <p className="prototype-results-note"><CheckCheck size={15} />Your priorities shape the ranking. Your skills explain the fit.</p>
          </div>

          <div id="prototype-job-detail" className="prototype-detail" aria-labelledby="prototype-detail-heading">
            <div className="prototype-panel-heading"><span className="prototype-step">03</span><h3 id="prototype-detail-heading">Why this role fits</h3></div>
            <div className="prototype-detail-intro"><span className="prototype-eyebrow">YOUR SELECTED OPPORTUNITY</span><h4>{selectedJob.title}</h4><span>{selectedJob.company} · {selectedJob.city}</span></div>
            <div className="prototype-total-score"><div><strong>{selectedJob.score.toFixed(1)}</strong><span>/ 100</span></div><span>Personalised fit score<small>#{selectedRank} of 3 opportunities</small></span></div>
            <div className="prototype-score-breakdown"><h4>Four dimensions. One clear picture.</h4>{qualityDimensions.map(({ key, label, icon: Icon }) => <div className="prototype-dimension" key={key}>
              <div><span><Icon size={13} />{label}</span><span><small>{percentage(weights[key])} weight</small><strong>{selectedJob.scores[key]}</strong></span></div>
              <div className={`prototype-score-track prototype-score-${key}`} role="meter" aria-label={`${label} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={selectedJob.scores[key]}><span style={{ width: `${selectedJob.scores[key]}%` }} /></div>
            </div>)}</div>
            <div className="prototype-explanation"><Sparkles size={15} /><p><strong>{leadingDimension.label} contributes most</strong> to this score: {selectedJob.scores[leadingDimension.key]}/100 with {percentage(weights[leadingDimension.key])} of your priorities. Your {selectedJob.matchedSkills.join(', ')} skills align with this example role.</p></div>
            <div className="prototype-skill-detail"><div><h4><Check size={13} />Skills you bring</h4><div className="prototype-chips">{selectedJob.matchedSkills.map(skill => <span key={skill}>{skill}</span>)}</div></div><div><h4><ArrowUpRight size={13} />Room to grow</h4><div className="prototype-chips prototype-gap-chips">{selectedJob.skillGaps.map(skill => <span key={skill}>{skill}</span>)}</div></div></div>
            <div className="prototype-feedback">
              <button ref={feedbackButton} type="button" className="prototype-feedback-trigger" aria-expanded={suggestion} aria-controls="prototype-feedback-suggestion" onClick={() => { setSuggestion(true); setFeedbackStatus(''); }}><TrendingUp size={14} />Prefer more growth<ArrowDown size={13} /></button>
              {suggestion && <div id="prototype-feedback-suggestion" className="prototype-feedback-suggestion"><strong>Give growth more room?</strong><p>Suggested priorities: Salary 20% · Growth 40% · Stability 15% · Skill Fit 25%.</p><p>Only applied when you confirm.</p><div><button type="button" className="prototype-apply" onClick={() => resolveSuggestion(true)}>Apply<Check size={13} /></button><button type="button" className="prototype-cancel" onClick={() => resolveSuggestion(false)}>Cancel</button></div></div>}
              <p className="prototype-feedback-status" role="status">{feedbackStatus}</p>
            </div>
          </div>
        </div>
        <div className="prototype-workspace-footer"><span><ShieldCheck size={13} />A transparent score, with you in control.</span><span>Profile → Priorities → Recommendations → Understanding</span></div>
      </div>
      <p className="prototype-disclaimer">An interactive concept using a fictional profile, employers, salaries and illustrative scores. Growth and stability are proxy indicators. Changes last only while this page is open.</p>
      <p className="prototype-sr-only" role="status" aria-atomic="true">{announcement}</p>
    </div>
  </section>;
}
