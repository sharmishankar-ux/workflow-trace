import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-sources-page',
  standalone: true,
  templateUrl: './sources.component.html'
})
export class SourcesPageComponent {
  readonly state = inject(WorkflowStateService);
}
