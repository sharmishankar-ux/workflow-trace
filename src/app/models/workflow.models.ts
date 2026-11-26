export interface WorkflowStep {
  title: string;
  detail: string;
  time: string;
  reference?: string;
  kind: 'done' | 'note' | 'source';
}

export interface WorkflowStage {
  number: string;
  name: string;
  summary: string;
  status: 'Complete' | 'In progress' | 'Pending';
  duration: string;
  icon: string;
  steps: WorkflowStep[];
}

export interface WorkflowRun {
  id: string;
  name: string;
  subject: string;
  date: string;
  duration: string;
  status: 'Completed' | 'Failed' | 'In progress';
  owner: string;
  failedAt?: string;
  stages?: WorkflowStage[];
}
