import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import {
  AdminService,
  BaseComponent,
  ColumnType,
  GridOption,
  ModalService,
  ProviderService,
} from "..";

@Component({
  selector: "app-wfdocument-transaction",
  templateUrl: "./wfdocument-transaction.component.html",
  providers: [ModalService],
  standalone: true,
  imports: [SharedModule],
})
export class WFDocumentTransactionComponent
  extends BaseComponent
  implements OnInit
{
  gridOption: GridOption;
  trnsactionList: any[] = [];
  documentID: number = null;
  transactionID: number = null;

  constructor(
    public providerSvc: ProviderService,
    private dataSvc: AdminService,
    private modalSvc: ModalService
  ) {
    super(providerSvc);
  }

  ngOnInit(): void {
    try {
      this.modalSvc.setHeader(this.fieldTitle["documentworkflowhistory"]);
      this.modalSvc.setWidth("1000px");
      this.documentID = this.modalSvc.modalData?.documentID;
      this.transactionID = this.modalSvc.modalData?.transactionID;
      this.initGridOption();
      this.getDocumentTransaction();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  initGridOption() {
    try {
      const gridObj = {
        title: this.fieldTitle["documenttransaction"],
        dataSource: "trnsactionList",
        columns: this.gridColumns(),
        refreshEvent: this.getDocumentTransaction,
        paginator: false,
      } as GridOption;
      this.gridOption = new GridOption(this, gridObj);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  gridColumns(): ColumnType[] {
    try {
      return [
        {
          field: "eventUserName",
          header: this.fieldTitle["username"],
        },
        {
          field: "event",
          header: this.fieldTitle["event"],
        },
        {
          field: "statusName",
          header: this.fieldTitle["status"],
        },
        {
          field: "comment",
          header: this.fieldTitle["comments"],
        },
        {
          field: "eventDate",
          header: this.fieldTitle["eventdateandtime"],
        },
        // {
        //   field: "eventTime",
        //   header: this.fieldTitle["eventtime"],
        // },
      ];
    } catch (error) {
      this.showErrorMsg(error);
    }
  }

  getDocumentTransaction() {
    try {
      this.dataSvc
        .getWFDocumentTransaction(this.documentID, this.transactionID)
        .subscribe({
          next: (res: any) => {
            this.trnsactionList = res;
          },
          error: (res: any) => {
            this.showErrorMsg(res);
          },
        });
    } catch (error) {
      this.showErrorMsg(error);
    }
  }
}
