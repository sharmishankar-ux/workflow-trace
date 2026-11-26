import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-workflow-details-page',
  standalone: true,
  templateUrl: './workflow-details.component.html'
})
export class WorkflowDetailsPageComponent {
  readonly state = inject(WorkflowStateService);
}
