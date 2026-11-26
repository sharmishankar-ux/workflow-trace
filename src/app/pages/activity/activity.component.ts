import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-activity-page',
  standalone: true,
  templateUrl: './activity.component.html'
})
export class ActivityPageComponent {
  readonly state = inject(WorkflowStateService);
}
