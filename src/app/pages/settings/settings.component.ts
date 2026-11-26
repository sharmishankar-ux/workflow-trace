import { Component, inject } from '@angular/core';
import { WorkflowStateService } from '../../workflow-state.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings.component.html'
})
export class SettingsPageComponent {
  readonly state = inject(WorkflowStateService);
}
