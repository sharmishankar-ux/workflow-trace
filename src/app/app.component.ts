import { Component, inject, ViewEncapsulation } from '@angular/core';
import { WorkflowStateService } from './workflow-state.service';
import { OverviewPageComponent } from './pages/overview/overview.component';
import { WorkflowDetailsPageComponent } from './pages/workflow-details/workflow-details.component';
import { SourcesPageComponent } from './pages/sources/sources.component';
import { ActivityPageComponent } from './pages/activity/activity.component';
import { HistoryPageComponent } from './pages/history/history.component';
import { CurrentWorkflowPageComponent } from './pages/current-workflow/current-workflow.component';
import { NewWorkflowPageComponent } from './pages/new-workflow/new-workflow.component';
import { TeamPageComponent } from './pages/team/team.component';
import { SettingsPageComponent } from './pages/settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OverviewPageComponent,
    WorkflowDetailsPageComponent,
    SourcesPageComponent,
    ActivityPageComponent,
    HistoryPageComponent,
    CurrentWorkflowPageComponent,
    NewWorkflowPageComponent,
    TeamPageComponent,
    SettingsPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  readonly state = inject(WorkflowStateService);
}
