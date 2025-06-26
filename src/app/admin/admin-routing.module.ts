import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
  LanguageTranslationsComponent,
  LanguagesComponent,
  ManageCodeGenerationComponent,
  MenuPageRearrangeComponent,
  MenuSetUpComponent,
  PageSetUpComponent,
  UserProfileEntryComponent,
  ManageUserProfileComponent,
  ManageRoleComponent,
  MapUserWithUserRoleComponent,
  RoleWiseUserInfoComponent,
  MenuPagePermissionComponent,
  EditPagePermissionComponent,
  ReportLayoutComponent,
  templatePageReportComponent,
  TemplatepagesComponent,
  BannerTemplateComponent,
  DashboardComponent,
  StatusSetupComponent,
  ErrorLogComponent,
  WorkFlowSetupComponent,
  EventSetupComponent,
  WorkFlowPolicySetupComponent,
  WorkFlowSetupListComponent,
  SamplePageComponent,
} from "./index";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  //{ path: 'general-settings', component: MenuComponent},
  { path: "banner-template", component: BannerTemplateComponent },
  //{ path: 'ADMIN', component: MenuComponent},
  { path: "error-log", component: ErrorLogComponent },
  { path: "languages", component: LanguagesComponent },
  { path: "translations", component: LanguageTranslationsComponent },
  { path: "workflow-status-setup", component: StatusSetupComponent },

  { path: "menu-set-up", component: MenuSetUpComponent },
  { path: "page-set-up", component: PageSetUpComponent },
  { path: "user-profile-entry", component: UserProfileEntryComponent },
  { path: "rearrange-menu-page", component: MenuPageRearrangeComponent },
  { path: "code-generation", component: ManageCodeGenerationComponent },
  { path: "manage-user-profile", component: ManageUserProfileComponent },
  { path: "manage-role", component: ManageRoleComponent },
  { path: "map-user-with-user-role", component: MapUserWithUserRoleComponent },
  { path: "role-wise-user-info", component: RoleWiseUserInfoComponent },
  { path: "menu-page-permission", component: MenuPagePermissionComponent },
  { path: "edit-page-permission", component: EditPagePermissionComponent },
  { path: "report-layout", component: ReportLayoutComponent },
  { path: "template-pages", component: TemplatepagesComponent },
  { path: "template-pages-report", component: templatePageReportComponent },
  { path: "workflow-setup", component: WorkFlowSetupComponent },
  { path: "event-setup", component: EventSetupComponent },
  { path: "workflow-policy-setup", component: WorkFlowPolicySetupComponent },
  { path: "workflow-setup-list", component: WorkFlowSetupListComponent },
  { path: "workflow-setup-list", component: WorkFlowSetupListComponent },
  { path: "sample-page", component: SamplePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
