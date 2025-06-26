import { Component, OnInit, ViewChild } from "@angular/core";
import {
  BaseComponent,
  ColumnType,
  GridOption,
  ProviderService,
  QueryData,
  ValidatorDirective,
  ModalConfig,
  DynamicDialogRef,
  WorkFlowSchemaComponent,
  FixedIDs,
} from "..";
import { SharedModule } from "src/app/shared/shared.module";
import { WorkFlowSetupListDataService } from "../services/work-flow-setup-list/work-flow-setup-list-data.service";
import { WorkFlowSetupListModelService } from "../services/work-flow-setup-list/work-flow-setup-list-model.service";
import { MenuService } from "src/app/shared/services/menu.service";
import { StatusSetupDataService } from "../services/status-setup/status-setup-data.service";
import { WorkFlowModelService } from "../services/work-flow/workflow.service";

@Component({
  selector: "app-work-flow-setup-list",
  templateUrl: "./work-flow-setup-list.component.html",
  providers: [
    WorkFlowSetupListDataService,
    WorkFlowSetupListModelService,
    StatusSetupDataService,
    WorkFlowModelService,
  ],
  standalone: true,
  imports: [SharedModule],
})
export class WorkFlowSetupListComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild(ValidatorDirective) directive;

  gridOption: GridOption;
  spData: any = new QueryData();
  statusList: any[] = [];
  ref: DynamicDialogRef;
  constructor(
    public providerSvc: ProviderService,
    public modelSvc: WorkFlowSetupListModelService,
    private dataSvc: WorkFlowSetupListDataService,
    private menuService: MenuService,
    private statusDataSvc: StatusSetupDataService,
    public modelWorkFlowSvc: WorkFlowModelService
  ) {
    super(providerSvc);
  }

  ngOnInit(): void {
    this.initGridOption();
    this.loadWorkFlowSetupList();
    this.loadStatusList();
  }

  initGridOption() {
    try {
      const gridObj = {
        title: " ",
        dataSource: "modelSvc.workFlowSetupList",
        columns: this.gridColumns(),
        refreshEvent: this.loadWorkFlowSetupList,
        isGlobalSearch: true,
        exportOption: {
          exportInPDF: true,
          exportInXL: true,
          title: this.fieldTitle["workflowlist"],
        },
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
          field: "workflowNo",
          header: this.fieldTitle["workflowno"],
          style: "",
        },
        {
          field: "docName",
          header: this.fieldTitle["docname"],
          style: "",
        },
        {
          field: "projectName",
          header: this.fieldTitle["project"],
          style: "",
        },
        {
          field: "organization",
          header: this.fieldTitle["organization"],
          style: "",
        },
        {
          field: "wFSchema",
          header: this.fieldTitle["wfschema"],
          style: "",
        },

        {
          field: "isActive",
          header: this.fieldTitle["active"],
          style: "",
          isBoolean: true,
        },
        {
          header: this.fieldTitle["action"],
          style: "",
          styleClass: "d-center",
        },
      ];
    } catch (error) {
      this.showErrorMsg(error);
    }
  }

  loadWorkFlowSetupList() {
    try {
      this.spData.pageNo = 0;
      this.dataSvc.GetWorkFlowSetupList(this.spData).subscribe({
        next: (res: any) => {
          let resData = res[res.length - 1];

          if (resData.length > 0) {
            this.modelSvc.prepareworkFlowSetupList(resData);
          } else {
            this.modelSvc.workFlowSetupList = [];
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
  editEvent(item: any): void {
    try {
      this.dataTransferSvc.broadcast("docWFSchemaID", item.id);
      let navigateUrl = "/ADMIN-PAGE/workflow-setup";
      this.menuService.setpageInfoByUrl(navigateUrl);
      this.router.navigateByUrl(navigateUrl);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  deleteWorkFlowSetup(id: number) {
    try {
      this.utilitySvc
        .showConfirmModal(this.messageCode.confirmDelete)
        .subscribe((isConfirm: boolean) => {
          if (isConfirm) {
            this.spData.pageNo = 0;
            this.dataSvc.DeleteWorkFlowSetup(id).subscribe({
              next: (res: any) => {
                this.showMsg(this.messageCode.deleteCode);
                this.loadWorkFlowSetupList();
              },
              error: (res: any) => {
                this.showErrorMsg(res);
              },
            });
          }
        });
    } catch (error) {
      this.showErrorMsg(error);
    }
  }
  loadStatusList() {
    try {
      this.spData.pageNo = 0;
      this.statusDataSvc.GetStatusList(this.spData).subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData.length > 0) {
            this.statusList = resData;
          } else {
            this.statusList = [];
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
  getDocWFSchemaByID(docWFSchemaID: number) {
    try {
      this.dataSvc.getDocWFSchemaByID(docWFSchemaID).subscribe({
        next: (res: any) => {
          this.modelWorkFlowSvc.workFlow = res.wFDocumentWFDetailDTOList;
          this.showWorkFlowSchema();
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  showWorkFlowSchema() {
    try {
      const modalConfig = new ModalConfig();
      modalConfig.data = {
        eventData: Array.isArray(this.modelWorkFlowSvc.workFlow)
          ? this.modelWorkFlowSvc.workFlow.filter(
              (f) => f.tag != FixedIDs.objectState.deleted
            )
          : [],
        statusList: this.statusList,
      };
      this.ref = this.dialogSvc.open(WorkFlowSchemaComponent, modalConfig);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
