import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import {
  AdminService,
  BaseComponent,
  GlobalConstants,
  ProviderService,
  QueryData,
} from "..";
import { SharedModule } from "src/app/shared/shared.module";
import { MenuService } from "src/app/shared/services/menu.service";
import { DocumentNotificationComponent } from "../document-notification/document-notification.component";
interface Notification {
  documentID: number;
}
@Component({
  selector: "app-dashboard-notification",
  imports: [
    CardModule,
    CommonModule,
    SharedModule,
    AccordionModule,
    DocumentNotificationComponent,
  ],
  providers: [AdminService],
  templateUrl: "./dashboard-notification.component.html",
})
export class DashboardNotificationComponent
  extends BaseComponent
  implements OnInit
{
  shortcuts = [];
  spData: any = new QueryData();
  notificationList: Notification[];

  constructor(
    public providerSvc: ProviderService,
    private dataSvc: AdminService,
    private menuService: MenuService
  ) {
    super(providerSvc);
  }
  ngOnInit(): void {
    this.loadWorkFlowNotificationist();
  }

  loadWorkFlowNotificationist() {
    try {
      this.spData.pageNo = 0;
      this.dataSvc.getWFDocumentWFSchema().subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData) {
            this.shortcuts = this.countPageTitleOccurrences(resData);
          }
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (error) {
      this.showErrorMsg(error);
    }
  }
  onNotificationCountChange(count: number) {
    count = 0;
  }
  countPageTitleOccurrences(
    notificationList: any[]
  ): { label: string; count: number; documentID: number }[] {
    const counts: { [key: string]: { count: number; documentID: number } } = {};

    notificationList.forEach((item) => {
      if (item.pageTitle) {
        if (!counts[item.pageTitle]) {
          counts[item.pageTitle] = {
            count: 1,
            documentID: item.documentID,
          };
        } else {
          counts[item.pageTitle].count += 1;
        }
      }
    });

    return Object.entries(counts).map(([label, data]) => ({
      label,
      count: data.count,
      documentID: data.documentID,
    }));
  }

  navigation(data: any): void {
    try {
      this.menuService.setpageInfoByID(data.documentID);
      GlobalConstants.pageInfo.breadcrumbs.forEach((item: any) => {
        if (item.id === data.documentID) {
          if (item.routerLink) {
            this.menuService.setpageInfoByUrl(item.routerLink);
            this.router.navigateByUrl(item.routerLink).then(() => {});
          } else {
            this.router.navigate(["/ADMIN-PAGE/dashboard"]).then(() => {});
          }
        }
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
