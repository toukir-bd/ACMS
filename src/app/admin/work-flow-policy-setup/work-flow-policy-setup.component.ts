import { Component, OnInit, ViewChild } from "@angular/core";
import {
  BaseComponent,
  ColumnType,
  GridOption,
  ProviderService,
  QueryData,
  ValidatorDirective,
} from "..";
import { NgForm, UntypedFormGroup } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { WorkFlowPolicySetupDataService } from "../services/work-flow-policy-setup/work-flow-policy-setup-data.service";
import { WorkFlowPolicySetupModelService } from "../services/work-flow-policy-setup/work-flow-policy-setup-model.service";
import {
  PolicySetupModel,
  WorkFlowPolicy,
  workFlowPolicySetupValidation,
} from "../models/workflow-policy-setup/workflow-policy-setup.model";
@Component({
  selector: "app-work-flow-policy-setup",
  imports: [SharedModule],
  providers: [WorkFlowPolicySetupDataService, WorkFlowPolicySetupModelService],
  templateUrl: "./work-flow-policy-setup.component.html",
})
export class WorkFlowPolicySetupComponent
  extends BaseComponent
  implements OnInit
{
  ref: any;
  @ViewChild(ValidatorDirective) directive;
  public validationMsgObj: any;
  @ViewChild("workFlowPolicySetupForm", { static: true, read: NgForm })
  workFlowPolicySetupForm: NgForm;

  gridOption: GridOption;
  spData: any = new QueryData();
  fromStatusList = [];
  toStatusList = [];
  eventList = [];
  tempWorkFlowPolicySetupModel: WorkFlowPolicy = new WorkFlowPolicy();
  constructor(
    public providerSvc: ProviderService,
    public modelSvc: WorkFlowPolicySetupModelService,
    private dataSvc: WorkFlowPolicySetupDataService
  ) {
    super(providerSvc);

    this.validationMsgObj = workFlowPolicySetupValidation();
  }

  ngOnInit(): void {
    this.modelSvc.setDefaultPolicySetupData();
    this.initGridOption();
    this.loadWorkFlowPolicyList();
    this.loadStatusList();
    this.loadEventList();
    this.loadGetWorkFlowList();
  }

  ngAfterViewInit() {
    try {
      this.modelSvc.workFlowPolicySetupForm = this.workFlowPolicySetupForm.form;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  initGridOption() {
    try {
      const gridObj = {
        title: this.fieldTitle["workflowpolicylist"],
        dataSource: "modelSvc.workFlowList",
        columns: this.gridColumns(),
        refreshEvent: this.loadGetWorkFlowList,
        isGlobalSearch: true,
        groupBy: "0,1",
        exportOption: {
          exportInPDF: true,
          exportInXL: true,
          title: this.fieldTitle["workflowpolicylist"],
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
          field: "policyTitle",
          header: this.fieldTitle["policy"],
          style: "",
        },
        {
          field: "fromStatusName",
          header: this.fieldTitle["fromstatus"],
          style: "",
        },

        { field: "event", header: this.fieldTitle["event"], style: "" },
        {
          field: "toStatusName",
          header: this.fieldTitle["tostatus"],
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

  loadWorkFlowPolicyList() {
    try {
      this.dataSvc.GetWorkFlowPolicyList().subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData.length > 0) {
            this.modelSvc.prepareWorkFlowPolicyList(resData);
          } else {
            this.modelSvc.workFlowPolicyList = [];
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
  loadStatusList() {
    try {
      this.dataSvc.GetStatusList().subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData.length > 0) {
            const activeStatus = resData.filter(
              (event: any) => event.isActive === true
            );
            this.modelSvc.prepareStatusList(activeStatus);
            this.fromStatusList = [
              { id: 0, statusName: "None" },
              ...this.modelSvc.statusList,
            ];
            this.toStatusList = [...this.modelSvc.statusList];
          } else {
            this.modelSvc.statusList = [];
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
  loadEventList() {
    try {
      this.dataSvc.GetEventList().subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData.length > 0) {
            const activeEvents = resData.filter(
              (event: any) => event.isActive === true
            );
            this.modelSvc.prepareEventList(activeEvents);
            this.eventList = [...this.modelSvc.eventList];
          } else {
            this.modelSvc.eventList = [];
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
  loadGetWorkFlowList() {
    try {
      this.spData.pageNo = 0;
      this.dataSvc.GetWorkFlowList(this.spData).subscribe({
        next: (res: any) => {
          let resData = res[res.length - 1] || [];
          if (resData.length > 0) {
            this.modelSvc.prepareWorkFlowList(resData);
            this.dropdownDataLoad();
          } else {
            this.modelSvc.workFlowList = [];
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

  editStatus(item: any, form: NgForm): void {
    try {
      this.onPolicyChange(item.policyCode, true);
      this.modelSvc.policySetupModel = { ...item };
      this.tempWorkFlowPolicySetupModel = { ...item };
      setTimeout(() => {
        Object.keys(form.controls).forEach((key) => {
          form.controls[key].markAsPristine();
          form.controls[key].markAsUntouched();
        });
      });
    } catch (error) {
      this.showErrorMsg(error);
    }
  }
  deleteStatus(id: number, form: NgForm) {
    try {
      this.utilitySvc
        .showConfirmModal(this.messageCode.confirmDelete)
        .subscribe((isConfirm: boolean) => {
          if (isConfirm) {
            this.spData.pageNo = 0;
            this.dataSvc.DeleteLanguage(id).subscribe({
              next: (res: any) => {
                this.showMsg(this.messageCode.deleteCode);
                this.modelSvc.statusList = this.modelSvc.statusList.filter(
                  (status: any) => status.id !== id
                );
                this.modelSvc.setDefaultPolicySetupData();
                this.loadGetWorkFlowList();
                form.form.markAsPristine();
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
  onPolicyChange(event: any, isEdit: boolean = false) {
    try {
      let value;
      if (isEdit == true) {
        value = event;
      } else {
        value = event.value;
      }

      this.dropdownDataLoad();

      if (value === "WP") {
        this.dropdownChange();
        this.withDrawPolicy();
      } else if (value == "RP") {
        this.dropdownChange();

        this.reOpenPolicy();
      } else if (value == "BP") {
        this.dropdownChange();
        this.backwardPolicy();
      } else if (value == "CCP") {
        this.dropdownChange();
        this.cancellationPolicy();
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  dropdownDataLoad() {
    try {
      this.fromStatusList = [
        { id: 0, statusName: "None" },
        ...this.modelSvc.statusList,
      ];
      this.toStatusList = [...this.modelSvc.statusList];
      this.eventList = [...this.modelSvc.eventList];
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  cancellationPolicy() {
    try {
      this.fromStatusList = this.fromStatusList.filter(
        (item: any) =>
          item.code !== "APV" && item.code !== "CLD" && item.isActive === true
      );
      this.toStatusList = this.toStatusList.filter(
        (item: any) => item.code === "CLD" && item.isActive === true
      );
      this.eventList = this.modelSvc.eventList.filter(
        (item: any) => item.code === "CA" && item.isActive === true
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  backwardPolicy() {
    try {
      this.fromStatusList = this.fromStatusList.filter(
        (item: any) =>
          item.code !== "CRD" &&
          item.code !== "APV" &&
          item.code !== "CLD" &&
          item.isActive === true
      );
      this.toStatusList = this.toStatusList.filter(
        (item: any) =>
          item.code !== "APV" && item.code !== "CLD" && item.isActive === true
      );
      this.eventList = this.modelSvc.eventList.filter(
        (item: any) => item.code === "DC" && item.isActive === true
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  reOpenPolicy() {
    try {
      this.fromStatusList = this.fromStatusList.filter(
        (item: any) => item.cTGCode === "CL" && item.isActive === true
      );
      this.toStatusList = this.toStatusList.filter(
        (item: any) => item.cTGCode !== "CL" && item.isActive === true
      );
      this.eventList = this.modelSvc.eventList.filter(
        (item: any) => item.code === "RO" && item.isActive === true
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  withDrawPolicy() {
    try {
      this.fromStatusList = this.fromStatusList.filter(
        (item: any) => item.cTGCode === "IP" && item.isActive === true
      );
      this.toStatusList = this.toStatusList.filter(
        (item: any) => item.cTGCode !== "CL" && item.isActive === true
      );
      this.eventList = this.modelSvc.eventList.filter(
        (item: any) => item.code === "WD" && item.isActive === true
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  dropdownChange() {
    try {
      this.modelSvc.policySetupModel.fromStatusID = null;
      this.modelSvc.policySetupModel.toStatusID = null;
      this.modelSvc.policySetupModel.eventID = null;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  save(formGroup: NgForm) {
    try {
      if (!formGroup.valid) {
        this.directive.validateAllFormFields(
          formGroup.form as UntypedFormGroup
        );
        return;
      }
      if (
        !this.utilitySvc.checkDuplicateEntry(
          this.modelSvc.workFlowList,
          this.modelSvc.policySetupModel,
          "policyCode,fromStatusID,toStatusID,eventID"
        )
      ) {
        if (this.modelSvc.policySetupModel.fromStatusID == 0) {
          this.modelSvc.policySetupModel.fromStatusID = null;
        }
        this.dataSvc.SaveStatus(this.modelSvc.policySetupModel).subscribe({
          next: (res: any) => {
            this.showMsg(this.messageCode.saveCode);
            formGroup.form.markAsPristine();
            this.modelSvc.setDefaultPolicySetupData();
            this.loadGetWorkFlowList();
          },
          error: (res: any) => {
            this.showErrorMsg(res);
          },
          complete: () => {},
        });
      } else {
        if (this.modelSvc.policySetupModel.fromStatusID == null) {
          this.modelSvc.policySetupModel.fromStatusID = 0;
        }
        this.showMsg(this.messageCode.duplicateCheck);
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  reset() {
    try {
      if (this.workFlowPolicySetupForm.dirty) {
        this.utilitySvc
          .showConfirmModal(this.messageCode.dataLoss)
          .subscribe((isConfirm: boolean) => {
            if (isConfirm) {
              if (this.modelSvc.policySetupModel.id > 0) {
                this.formResetByDefaultValue(
                  this.workFlowPolicySetupForm.form,
                  this.tempWorkFlowPolicySetupModel
                );
              } else {
                this.setNew();
              }
            }
          });
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  setNew() {
    try {
      this.modelSvc.policySetupModel = new PolicySetupModel();
      this.dropdownDataLoad();
      this.formResetByDefaultValue(
        this.workFlowPolicySetupForm.form,
        this.modelSvc.policySetupModel
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
