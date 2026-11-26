import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  templateUrl: './history.component.html'
})
export class HistoryPageComponent {
  readonly state = inject(WorkflowStateService);
}
