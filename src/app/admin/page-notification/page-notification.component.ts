import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import {
  BaseComponent,
  ConfigService,
  GlobalConstants,
  ProviderService,
  ModalConfig,
  WFDocumentTransactionComponent,
  DynamicDialogRef,
} from "..";
@Component({
  selector: "app-page-notification",
  imports: [SharedModule],
  templateUrl: "./page-notification.component.html",
})
export class PageNotificationComponent extends BaseComponent implements OnInit {
  notificationList: any[] = [];
  pageNotifications: any[] = [];
  ref: DynamicDialogRef;
  @Output() childDataChange = new EventEmitter<number>();
  @Output() isRefreshList = new EventEmitter<null>();
  constructor(
    protected providerSvc: ProviderService,
    private configSvc: ConfigService
  ) {
    super(providerSvc);
  }
  ngOnInit(): void {
    try {
      this.loadWorkFlowNotificationist();
      this.getDataFromSingnalR();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  getDataFromSingnalR() {
    try {
      GlobalConstants.signalRConnection.on("ReceiveMessage", (res) => {
        this.loadWorkFlowNotificationist();
        this.isRefreshList.emit();
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  loadWorkFlowNotificationist() {
    try {
      setTimeout(() => {
        this.pageNotifications =
          this.configSvc.getLocalStorage("pageNotifications");
        if (this.pageNotifications != null) {
          this.notificationList = this.pageNotifications.filter(
            (f) => f.documentID == GlobalConstants.pageInfo.id
          );
        }
      }, 500);
    } catch (error) {
      this.showErrorMsg(error);
    }
  }
  onClickTransaction(transactionID: number) {
    try {
      this.childDataChange.emit(transactionID);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  removeNotification(transactionID: number) {
    try {
      this.notificationList = this.notificationList.filter(
        (f) => f.transactionID != transactionID
      );
      this.pageNotifications = this.pageNotifications.filter(
        (f) =>
          f.documentID != GlobalConstants.pageInfo.id &&
          f.transactionID != transactionID
      );
      this.configSvc.setLocalStorage(
        "pageNotifications",
        this.pageNotifications
      );
    } catch (e) {
      this.showErrorMsg(e);
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
      this.isRefreshList.emit();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
