import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-new-workflow-page',
  standalone: true,
  templateUrl: './new-workflow.component.html'
})
export class NewWorkflowPageComponent {
  readonly state = inject(WorkflowStateService);
}
