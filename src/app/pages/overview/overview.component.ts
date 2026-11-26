import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  templateUrl: './overview.component.html'
})
export class OverviewPageComponent {
  readonly state = inject(WorkflowStateService);
}
