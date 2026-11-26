import { Injectable } from '@angular/core';
import { WorkflowRun, WorkflowStage, WorkflowStep } from './models/workflow.models';

@Injectable({ providedIn: 'root' })
export class WorkflowStateService {
  sidebarCollapsed = false;
  theme = this.loadTheme();
  activePage = 'workflows';
  expanded: Record<string, boolean> = { '01': false, '02': false, '03': false, '04': false, '05': false, '06': false };
  showReferences = false;

  private readonly pageLabels: Record<string, string> = {
    overview: 'Overview', workflows: 'Workflows', sources: 'Sources', activity: 'Activity', history: 'History', team: 'Team', settings: 'Settings', 'new-workflow': 'New workflow', 'current-workflow': 'Current workflow'
  };
  private readonly pageDescriptions: Record<string, string> = {
    overview: 'A clear snapshot of workflow performance across your workspace.',
    sources: 'Browse the documents and systems your workflows can reference.',
    activity: 'See the latest workflow runs, source updates, and team changes.',
    history: 'Review workflow runs, their status, and who started them.',
    'new-workflow': 'Start a workflow run from one of your available templates.',
    'current-workflow': 'Follow each workflow stage and step as it runs.',
    team: 'People and access for your Northstar Studio workspace.',
    settings: 'Set workspace preferences for your team and workflow records.'
  };
  get activePageLabel(): string { return this.pageLabels[this.activePage] ?? 'Workflows'; }
  get activePageDescription(): string { return this.pageDescriptions[this.activePage] ?? ''; }
  selectedTemplate = 'Customer support escalation';
  targetName = 'Case CS-4812 · Northstar Analytics';
  historyNotice = '';
  currentRun: WorkflowRun | null = null;
  lastRunResult: WorkflowRun | null = null;
  currentStepIndex = -1;
  expandedHistoryRunId = '';
  private progressTimer: number | null = null;
  get activeStages(): WorkflowStage[] { return this.currentRun?.stages ?? this.lastRunResult?.stages ?? this.stages; }
  get totalCurrentSteps(): number { return this.activeStages.reduce((total, stage) => total + stage.steps.length, 0); }
  get currentStageIndex(): number {
    let count = 0;
    for (let index = 0; index < this.activeStages.length; index++) {
      count += this.activeStages[index].steps.length;
      if (this.currentStepIndex < count) return index;
    }
    return Math.max(0, this.activeStages.length - 1);
  }
  get currentStep(): WorkflowStep | null {
    let index = this.currentStepIndex;
    for (const stage of this.activeStages) {
      if (index < stage.steps.length) return stage.steps[Math.max(0, index)];
      index -= stage.steps.length;
    }
    return null;
  }
  get progressPercent(): number { return Math.min(100, Math.round(((this.currentStepIndex + 1) / this.totalCurrentSteps) * 100)); }
  historyRuns: WorkflowRun[] = [
    { id: 'WF-2024-00842', name: 'Customer support escalation', subject: 'Case CS-4812 · Northstar Analytics', date: 'Today, 10:42 AM', duration: '2m 18s', status: 'Completed', owner: 'Alex Morgan' },
    { id: 'WF-2024-00841', name: 'Product incident review', subject: 'Search indexing', date: 'Today, 9:16 AM', duration: '1m 04s', status: 'Completed', owner: 'Jordan Lee' },
    { id: 'WF-2024-00840', name: 'Customer support escalation', subject: 'Case CS-4798 · Northstar Analytics', date: 'Yesterday, 4:08 PM', duration: '3m 12s', status: 'Failed', owner: 'Sam Kim', failedAt: 'Quality check' },
    { id: 'WF-2024-00839', name: 'Knowledge base update', subject: 'Account access guide', date: 'Yesterday, 1:32 PM', duration: '2m 41s', status: 'Completed', owner: 'Alex Morgan' }
  ];
  navigate(event: Event, page: string): void { event.preventDefault(); this.navigateTo(page); }
  navigateTo(page: string): void {
    if (page === this.activePage) return;
    this.activePage = page;
    this.showReferences = false;
    document.querySelector('.main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  toggleHistoryRun(id: string): void { this.expandedHistoryRunId = this.expandedHistoryRunId === id ? '' : id; }
  historicalStageState(run: WorkflowRun, stageIndex: number): string {
    if (run.status !== 'Failed' || !run.failedAt) return 'Complete';
    const failedIndex = this.runStages(run).findIndex((stage) => stage.name === run.failedAt);
    return stageIndex < failedIndex ? 'Complete' : stageIndex === failedIndex ? 'Failed' : 'Pending';
  }
  private runStages(run: WorkflowRun): WorkflowStage[] { return run.stages ?? this.stages; }
  historicalStepState(run: WorkflowRun, stageIndex: number, stepIndex: number): string {
    const stageState = this.historicalStageState(run, stageIndex);
    if (stageState === 'Failed') return stepIndex === this.runStages(run)[stageIndex].steps.length - 1 ? 'Failed' : 'Complete';
    return stageState === 'Complete' ? 'Complete' : 'Pending';
  }
  liveStageState(stageIndex: number): string {
    const start = this.activeStages.slice(0, stageIndex).reduce((sum, stage) => sum + stage.steps.length, 0);
    const end = start + this.activeStages[stageIndex].steps.length;
    if (this.currentStepIndex >= end) return 'Complete';
    if (this.currentStepIndex >= start) return 'In progress';
    return 'Waiting';
  }
  liveStepState(stageIndex: number, stepIndex: number): string {
    const absoluteIndex = this.activeStages.slice(0, stageIndex).reduce((sum, stage) => sum + stage.steps.length, 0) + stepIndex;
    if (this.currentStepIndex > absoluteIndex) return 'Complete';
    if (this.currentStepIndex === absoluteIndex) return 'In progress';
    return 'Waiting';
  }
  updateTarget(event: Event): void { this.targetName = (event.target as HTMLInputElement).value; }
  runNewWorkflow(): void {
    if (!this.targetName.trim()) return;
    if (this.progressTimer !== null) window.clearInterval(this.progressTimer);
    const runNumber = 843 + Math.max(0, this.historyRuns.length - 4);
    this.currentRun = {
      id: `WF-2024-${String(runNumber).padStart(5, '0')}`,
      name: this.selectedTemplate,
      subject: this.targetName.trim(),
      date: 'Just now',
      duration: 'In progress',
      status: 'In progress',
      owner: 'Alex Morgan',
      stages: this.createRunStages(this.selectedTemplate, this.targetName.trim())
    };
    this.lastRunResult = null;
    this.currentStepIndex = 0;
    this.historyNotice = '';
    this.navigateTo('current-workflow');
    this.progressTimer = window.setInterval(() => {
      if (!this.currentRun) return;
      const nextIndex = this.currentStepIndex + 1;
      if (nextIndex >= this.totalCurrentSteps) {
        this.completeCurrentRun();
      } else {
        this.currentStepIndex = nextIndex;
      }
    }, 950);
  }
  private completeCurrentRun(): void {
    if (!this.currentRun) return;
    window.clearInterval(this.progressTimer ?? undefined);
    this.progressTimer = null;
    const finished: WorkflowRun = { ...this.currentRun, status: 'Completed', date: 'Today, just now', duration: '16 sec', stages: this.currentRun.stages };
    this.historyRuns = [finished, ...this.historyRuns];
    this.lastRunResult = finished;
    this.currentRun = null;
    this.currentStepIndex = this.totalCurrentSteps;
    this.historyNotice = `${finished.name} completed for ${finished.subject} and was added to history.`;
    this.expandedHistoryRunId = finished.id;
    this.navigateTo('history');
  }
  private createRunStages(template: string, subject: string): WorkflowStage[] {
    if (template === 'Customer support escalation') {
      return this.stages.map((stage) => ({ ...stage, steps: stage.steps.map((step) => ({ ...step, detail: step.detail.replaceAll('Northstar Analytics', subject) })) }));
    }
    const incident = template === 'Product incident review';
    const summaries = incident
      ? ['Incident report and affected area validated', 'User reports and service signals gathered', 'Impact and likely cause assessed', 'Incident summary drafted', 'Facts and response quality checked', 'Incident update delivered']
      : ['Article request and topic validated', 'Existing guidance and source material gathered', 'Information gaps and user needs reviewed', 'Article draft prepared', 'Links and instructions verified', 'Article update published for review'];
    const actions: [string, string][][] = incident ? [
      [['Incident report received', `Product incident review started for ${subject}.`], ['Affected product area confirmed', 'Checked the reported feature, affected users, and time window.']],
      [['User reports gathered', 'Collected related support cases and customer descriptions.'], ['Service signals reviewed', 'Retrieved monitoring notes and the product status timeline.']],
      [['Impact assessed', 'Grouped reports by symptom and confirmed the scope of impact.'], ['Likely cause investigated', 'Compared observed behavior with known issues and recent changes.']],
      [['Incident summary drafted', 'Prepared a clear account of impact, evidence, and next steps.'], ['Customer update prepared', 'Drafted a concise status update based on verified facts.']],
      [['Timeline and evidence checked', 'Verified the event sequence against the status timeline.'], ['Response checked for clarity', 'Confirmed the update avoids unsupported claims and explains next steps.']],
      [['Incident review generated', 'Assembled the final incident review and linked evidence.'], ['Review shared with the team', 'Saved the incident summary for product and support teams.']]
    ] : [
      [['Article update requested', `Knowledge base update started for ${subject}.`], ['Audience and topic confirmed', 'Identified the support audience and the question the article should answer.']],
      [['Existing guidance collected', 'Found related help articles and internal support notes.'], ['Source material reviewed', 'Collected product instructions and current troubleshooting guidance.']],
      [['User questions analyzed', 'Grouped common questions and identified unclear instructions.'], ['Information gaps identified', 'Compared current help content with verified product behavior.']],
      [['Article draft prepared', 'Wrote a step-by-step article with a clear title and summary.'], ['Related guidance linked', 'Added links to the relevant help and troubleshooting pages.']],
      [['Instructions tested for clarity', 'Checked that steps are complete, ordered, and easy to follow.'], ['Links and terminology verified', 'Confirmed referenced pages are available and terms match the product.']],
      [['Article update assembled', 'Prepared the article and review notes for publication.'], ['Draft shared with the support team', 'Saved the article update for editorial review.']]
    ];
    const times = ['10:42:03', '10:42:15', '10:42:28', '10:42:41', '10:42:56', '10:43:08'];
    return this.stages.map((stage, stageIndex) => ({
      ...stage,
      summary: summaries[stageIndex],
      steps: actions[stageIndex].map(([title, detail], stepIndex) => ({ title, detail, time: times[stageIndex], kind: stepIndex === 1 ? 'source' as const : 'done' as const, ...(stepIndex === 1 ? { reference: incident ? 'Product status timeline · Support workspace' : 'Help center draft · Support workspace' } : {}) }))
    }));
  }

  stages: WorkflowStage[] = [
    { number: '01', name: 'Intake & validation', summary: 'Request received and required details verified', status: 'Complete', duration: '12 sec', icon: '⌑', steps: [
      { title: 'Support case received', detail: 'Support escalation initiated by Alex Morgan for the selected customer case.', time: '10:42:03', kind: 'done' },
      { title: 'Case details validated', detail: 'Confirmed case ID, product area, severity, and customer impact.', time: '10:42:08', kind: 'done' },
      { title: 'Escalation playbook matched', detail: 'Applied the product support escalation path for a high-impact customer issue.', time: '10:42:15', reference: 'Support Escalation Playbook.pdf · §2.1', kind: 'source' }
    ]},
    { number: '02', name: 'Collect information', summary: 'Case history, product notes, and support references gathered', status: 'Complete', duration: '34 sec', icon: '▤', steps: [
      { title: 'Support conversation retrieved', detail: 'Loaded the full conversation and matched 24 case events to CS-4812.', time: '10:42:21', reference: 'Support Queue Export.csv · events 4–27', kind: 'source' },
      { title: 'Troubleshooting notes located', detail: 'Found the latest reproduction notes and approved workaround in the support workspace.', time: '10:42:38', reference: 'Support workspace · 2 documents', kind: 'source' },
      { title: 'Product status checked', detail: 'Reviewed the status page and known issues for current service incidents.', time: '10:42:55', reference: 'status.northstar.example', kind: 'source' }
    ]},
    { number: '03', name: 'Analyze the issue', summary: 'Customer impact and likely cause evaluated', status: 'Complete', duration: '51 sec', icon: '⌁', steps: [
      { title: 'Issue pattern identified', detail: 'Grouped case events and confirmed the repeated search timeout symptom.', time: '10:43:02', reference: 'Support Queue Export.csv · events 4–27', kind: 'source' },
      { title: 'Product behavior reviewed', detail: 'Compared reproduction notes with known issues and the current service status.', time: '10:43:19', reference: 'Product status and known issues · p. 2–4', kind: 'source' },
      { title: 'Customer impact assessed', detail: 'Confirmed the issue affects one workspace and identified the available workaround.', time: '10:43:41', kind: 'done' },
      { title: 'Response rationale recorded', detail: 'Prepared a response based on verified evidence and current product guidance.', time: '10:43:53', kind: 'note' }
    ]},
    { number: '04', name: 'Draft response', summary: 'A clear, evidence-based customer response prepared', status: 'Complete', duration: '26 sec', icon: '✎', steps: [
      { title: 'Customer response drafted', detail: 'Explained the issue, its impact, and the available workaround in plain language.', time: '10:44:01', kind: 'done' },
      { title: 'Supporting guidance linked', detail: 'Added the relevant troubleshooting steps and product status reference.', time: '10:44:12', reference: 'Support Escalation Playbook.pdf · §4.3', kind: 'source' }
    ]},
    { number: '05', name: 'Quality check', summary: 'Response clarity and source accuracy checked', status: 'Complete', duration: '9 sec', icon: '◎', steps: [
      { title: 'Support guidance checked', detail: 'Confirmed that the response follows the escalation playbook.', time: '10:44:28', kind: 'done' },
      { title: 'Source links verified', detail: 'All 8 references resolve to an accessible support document or status page.', time: '10:44:33', kind: 'done' },
      { title: 'Response checked for accuracy', detail: 'Confirmed the reply matches the case history and makes no unsupported claims.', time: '10:44:37', kind: 'done' }
    ]},
    { number: '06', name: 'Resolve and deliver', summary: 'Response attached to the case and routed to support', status: 'Complete', duration: '6 sec', icon: '↗', steps: [
      { title: 'Case response prepared', detail: 'Final response assembled with verified guidance and linked evidence.', time: '10:44:41', kind: 'done' },
      { title: 'Response added to the case', detail: 'Saved to Customer Support › Open cases › CS-4812.', time: '10:44:47', reference: 'Support case · CS-4812', kind: 'source' }
    ]}
  ];

  constructor() {
    this.historyRuns = this.historyRuns.map((run) => ({ ...run, stages: this.createRunStages(run.name, run.subject) }));
  }

  get allExpanded(): boolean { return this.stages.every((stage) => this.expanded[stage.number]); }
  private loadTheme(): string {
    try {
      const saved = localStorage.getItem('workflow-trace-theme');
      return saved === 'mint' || saved === 'rose' ? saved : 'glacier';
    } catch { return 'glacier'; }
  }
  setTheme(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    this.theme = selected === 'mint' || selected === 'rose' ? selected : 'glacier';
    try { localStorage.setItem('workflow-trace-theme', this.theme); } catch { /* Theme remains active for this session. */ }
  }
  toggleReferences(): void {
    this.showReferences = !this.showReferences;
    if (this.showReferences) {
      setTimeout(() => document.getElementById('references')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }
  toggleSidebar(): void { this.sidebarCollapsed = !this.sidebarCollapsed; }
  toggleStage(number: string): void { this.expanded[number] = !this.expanded[number]; }
  toggleAll(): void { const next = !this.allExpanded; this.stages.forEach((stage) => this.expanded[stage.number] = next); }
  exportSummary(): void {
    const report = this.stages.map((stage) => `${stage.number}. ${stage.name} — ${stage.status}\n${stage.steps.map((step) => `  • ${step.title}: ${step.detail}${step.reference ? ` [${step.reference}]` : ''}`).join('\n')}`).join('\n\n');
    const blob = new Blob([`Customer support escalation\nWorkflow run WF-2024-00842\n\n${report}`], { type: 'text/plain' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'customer-support-escalation.txt'; link.click(); URL.revokeObjectURL(link.href);
  }
}
