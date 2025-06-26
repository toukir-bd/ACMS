import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import {
  AdminService,
  BaseComponent,
  ConfigService,
  DynamicDialogRef,
  GlobalConstants,
  ModalConfig,
  ProviderService,
  QueryData,
  WFDocumentTransactionComponent,
} from "..";
import { SharedModule } from "src/app/shared/shared.module";
import { MenuService } from "src/app/shared/services/menu.service";
import { NotificationModel } from "../models/notification/notification.model";
@Component({
  selector: "app-document-notification",
  imports: [SharedModule, AccordionModule],
  providers: [AdminService],
  templateUrl: "./document-notification.component.html",
})
export class DocumentNotificationComponent
  extends BaseComponent
  implements OnInit
{
  @Output() itemClicked = new EventEmitter<any>();
  spData: any = new QueryData();
  notificationList: NotificationModel[];
  tabData: any = {};
  searchText: string = "";
  @Input() tabKeys: string[] = [];
  @Output() countChangedChild = new EventEmitter<number>();
  notificationTypesMap: { [tabName: string]: string[] } = {};
  processedTabData: {
    [tabName: string]: {
      notificationType: string;
      notifications: any[];
    }[];
  } = {};
  ref: DynamicDialogRef;
  constructor(
    public providerSvc: ProviderService,
    private menuService: MenuService,
    private dataSvc: AdminService,
    private configSvc: ConfigService
  ) {
    super(providerSvc);
  }
  ngOnInit(): void {
    this.loadWorkFlowNotificationist();
    this.getDataFromSingnalR();
  }

  getDataFromSingnalR() {
    try {
      GlobalConstants.signalRConnection.on("ReceiveMessage", (res) => {
        this.loadWorkFlowNotificationist();
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  loadWorkFlowNotificationist() {
    try {
      this.spData.pageNo = 0;
      this.dataSvc.getWFDocTransactionByUserID().subscribe({
        next: (res: any) => {
          let resData = res;
          this.configSvc.setLocalStorage("pageNotifications", resData);
          if (resData) {
            this.prepareNotificationData(resData);
          } else {
            this.notificationList = [];
            this.tabKeys = ["Self Service"];
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

  private prepareNotificationData(resData: any): void {
    this.notificationList = resData;
    this.tabKeys = ["Self Service"];
    this.tabData = {
      "Self Service": {},
    };
    this.notificationTypesMap = {
      "Self Service": [],
    };
    this.countChangedChild.emit(this.notificationList.length);
    this.notificationList.forEach((item) => {
      const tab = "Self Service";
      const type = item.pageTitle;
      if (!this.tabData[tab][type]) {
        this.tabData[tab][type] = [];
      }
      const notification = new NotificationModel();
      this.tabData[tab][type].push({ ...notification, ...item });
    });
    this.processedTabData = {};
    for (const tabName of this.tabKeys) {
      const types = Object.keys(this.tabData[tabName]);
      this.notificationTypesMap[tabName] = types;

      this.processedTabData[tabName] = types.map((type) => ({
        notificationType: type,
        notifications: this.tabData[tabName][type],
      }));
    }
  }
  navigationHandler = (data: NotificationModel): void => {
    try {
      this.menuService.setpageInfoByID(data.documentID);
      GlobalConstants.pageInfo.breadcrumbs.forEach((item: any) => {
        if (item.id === data.documentID) {
          if (item.routerLink) {
            this.dataTransferSvc.broadcast("transactionID", data.transactionID);
            this.menuService.setpageInfoByUrl(item.routerLink);
            this.router.navigateByUrl(item.routerLink).then(() => {
              this.itemClicked.emit();
            });
          } else {
            this.router.navigate(["/ADMIN-PAGE/dashboard"]).then(() => {
              this.itemClicked.emit();
            });
          }
        }
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  };
  searchNotifications(): void {
    try {
      this.processedTabData = {};

      for (const tabName of this.tabKeys) {
        const types = Object.keys(this.tabData[tabName]);
        this.notificationTypesMap[tabName] = [];

        const filteredTypes = types
          .map((type) => {
            const filteredNotifications = this.tabData[tabName][type].filter(
              (item) =>
                this.searchText
                  ? item.transactionCode
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.pageTitle
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.creator
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.lastUser
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.statusName
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.notificationType
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase()) ||
                    item.comments
                      ?.toLowerCase()
                      .includes(this.searchText.toLowerCase())
                  : true
            );

            if (filteredNotifications.length > 0) {
              this.notificationTypesMap[tabName].push(type);
              return {
                notificationType: type,
                notifications: filteredNotifications,
              };
            }

            return null;
          })
          .filter((x) => x !== null);

        this.processedTabData[tabName] = filteredTypes;
      }
    } catch (error) {
      this.showErrorMsg(error);
    }
  }

  showDocTransaction(item: any) {
    try {
      const modalConfig = new ModalConfig();
      modalConfig.data = {
        documentID: item.documentID,
        transactionID: item.transactionID,
      };
      this.ref = this.dialogSvc.open(
        WFDocumentTransactionComponent,
        modalConfig
      );
      this.itemClicked.emit();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
