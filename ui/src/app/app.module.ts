// Import all the pieces of the app centrally.

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClarityModule} from 'clarity-angular';

import {AppRoutingModule} from 'app/app-routing.module';
import {AppComponent} from 'app/views/app/component';
import {CohortEditComponent} from 'app/views/cohort-edit/component';
import {HomePageComponent} from 'app/views/home-page/component';
import {SignInService} from 'app/services/sign-in.service';
import {VAADIN_CLIENT} from 'app/vaadin-client';
import {WorkspaceComponent} from 'app/views/workspace/component';
import {WorkspaceEditComponent} from 'app/views/workspace-edit/component';
import {CohortsService, WorkspacesService, Configuration, ConfigurationParameters} from 'generated';
import {environment} from 'environments/environment';
import { CohortBuilderComponent } from 'app/views/cohort-builder/search/cohort-builder/cohort-builder.component';
import { GenderChartComponent } from 'app/views/cohort-builder/search/gender-chart/gender-chart.component';
import { GoogleChartDirective } from 'app/views/cohort-builder/search/google-chart/google-chart.directive';
import { RaceChartComponent } from 'app/views/cohort-builder/search/race-chart/race-chart.component';
import { SearchGroupComponent } from 'app/views/cohort-builder/search/search-group/search-group.component';
import { SearchResultComponent } from 'app/views/cohort-builder/search/search-result/search-result.component';
import { WizardCriteriaGroupComponent } from './views/cohort-builder/search/wizard-criteria-group/wizard-criteria-group.component';
import { WizardModalComponent } from 'app/views/cohort-builder/search/wizard-modal/wizard-modal.component';
import { WizardModifiersComponent } from './views/cohort-builder/search/wizard-modifiers/wizard-modifiers.component';
import { WizardSelectComponent } from 'app/views/cohort-builder/search/wizard-select/wizard-select.component';
import { WizardTotalComponent } from './views/cohort-builder/search/wizard-total/wizard-total.component';
import { WizardTreeChildrenComponent } from './views/cohort-builder/search/wizard-tree-children/wizard-tree-children.component';
import { WizardTreeParentComponent } from './views/cohort-builder/search/wizard-tree-parent/wizard-tree-parent.component';
import { SubjectListComponent } from 'app/views/cohort-builder/review/subject-list/subject-list.component';
import { SubjectDetailComponent } from 'app/views/cohort-builder/review/subject-detail/subject-detail.component';
import { AnnotationsComponent } from 'app/views/cohort-builder/review/annotations/annotations.component';
import { MedicationsComponent } from 'app/views/cohort-builder/review/medications/medications.component';
import { CohortReviewComponent } from 'app/views/cohort-builder/review/cohort-review/cohort-review.component';
import { BroadcastService, SearchService } from './views/cohort-builder/search/service';

export function getVaadin(): VaadinNs {
  // If the Vaadin javascript file fails to load, the "vaadin" symbol doesn't get defined,
  // and referencing it directly results in an error.
  if (typeof vaadin === 'undefined') {
    return undefined;
  } else {
    return vaadin;
  }
}

// "Configuration" means Swagger API Client configuration.
export function getConfiguration(signInService: SignInService): Configuration {
    return new Configuration({
      basePath: environment.allOfUsApiUrl,
      accessToken: () => signInService.currentAccessToken
    });
}

@NgModule({
  imports:      [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot()
  ],
  declarations: [
    AppComponent,
    CohortBuilderComponent,
    SearchGroupComponent,
    SearchResultComponent,
    GoogleChartDirective,
    GenderChartComponent,
    RaceChartComponent,
    CohortReviewComponent,
    SubjectListComponent,
    SubjectDetailComponent,
    AnnotationsComponent,
    MedicationsComponent,
    WizardCriteriaGroupComponent,
    WizardModalComponent,
    WizardModifiersComponent,
    WizardSelectComponent,
    WizardTotalComponent,
    WizardTreeChildrenComponent,
    WizardTreeParentComponent,
    CohortEditComponent,
    HomePageComponent,
    WorkspaceComponent,
    WorkspaceEditComponent
  ],
  entryComponents: [WizardModalComponent],
  providers: [
    SignInService,
    {provide: VAADIN_CLIENT, useFactory: getVaadin},
    {
      provide: Configuration,
      deps: [SignInService],
      useFactory: getConfiguration
    },
    CohortsService,
    WorkspacesService,
    BroadcastService,
    SearchService
  ],

  // This specifies the top-level component, to load first.
  bootstrap: [AppComponent]
})
export class AppModule {}
