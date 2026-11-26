import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-team-page',
  standalone: true,
  templateUrl: './team.component.html'
})
export class TeamPageComponent {
  readonly state = inject(WorkflowStateService);
}
