import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-current-workflow-page',
  standalone: true,
  templateUrl: './current-workflow.component.html'
})
export class CurrentWorkflowPageComponent {
  readonly state = inject(WorkflowStateService);
}
