import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AdminService,
  BaseComponent,
  DynamicDialogRef,
  FixedIDs,
  GlobalConstants,
  GlobalMethods,
  ModalConfig,
  ProviderService,
  ValidatorDirective,
  WorkFlowSchemaComponent,
  QueryData,
} from "..";
import { SharedModule } from "src/app/shared/shared.module";
import { OrgService } from "src/app/app-shared/services/org.service";
import { forkJoin, Subject, takeUntil } from "rxjs";
import {
  WFDocumentWFSchema,
  WorkFlowValidation,
} from "../models/workflow/workflow-setup.model";
import {
  WorkFlowDataService,
  WorkFlowModelService,
} from "../services/work-flow/workflow.service";
import { NgForm, UntypedFormGroup, Validators } from "@angular/forms";
import { StatusSetupDataService } from "../services/status-setup/status-setup-data.service";

@Component({
  selector: "app-work-flow-setup",
  imports: [SharedModule],
  templateUrl: "./work-flow-setup.component.html",
  standalone: true,
  providers: [
    WorkFlowModelService,
    WorkFlowDataService,
    StatusSetupDataService,
  ],
})
export class WorkFlowSetupComponent extends BaseComponent implements OnInit {
  @ViewChild("workFlowForm", { static: true, read: NgForm })
  workFlowForm: NgForm;
  @ViewChild(ValidatorDirective) directive;
  private $unsubscribe = new Subject<void>();
  validationMsgObj: any;
  objectState: any = null;
  openPanels: string[] = [
    "forward",
    "backward",
    "cancel",
    "withdraw",
    "reopen",
    "creation",
  ];
  workFlowPolicy: any = {};
  statusList: any[] = [];
  isShowPolicyModal: boolean = false;
  isPolicySelected: boolean = false;
  isDisable: boolean = null;
  ref: DynamicDialogRef;
  spData: any = new QueryData();
  constructor(
    protected providerSvc: ProviderService,
    public modelSvc: WorkFlowModelService,
    private dataSvc: WorkFlowDataService,
    private adminSvc: AdminService,
    private orgSvc: OrgService,
    private statusDataSvc: StatusSetupDataService
  ) {
    super(providerSvc);
    this.validationMsgObj = WorkFlowValidation();
  }

  ngOnInit(): void {
    try {
      this.modelSvc.fieldTitle = this.fieldTitle;
      this.workFlowPolicy = FixedIDs.workFlowPolicy;
      this.objectState = FixedIDs.objectState;
      this.getDefaultData();
      this.loadStatusList();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  getDefaultData() {
    try {
      forkJoin([
        this.adminSvc.getActionMenuList(),
        this.orgSvc.getOrgStructure(),
        this.orgSvc.getOrgProject(),
        this.dataSvc.getWFSchema(),
        this.dataSvc.getWFWorkFlowPolicy(),
        this.dataSvc.getAllUsers(GlobalConstants.userInfo.locationID),
      ]).subscribe({
        next: (results: any) => {
          this.modelSvc.documentList = results[0];
          let mapOrgData = this.modelSvc.mapObjectProps(results[1]);
          this.modelSvc.orgList = this.modelSvc.prepareTreeData(
            mapOrgData,
            null
          );
          this.modelSvc.projectList = results[2];
          this.modelSvc.schemalList = results[3];
          this.modelSvc.workFlowPolicyList = results[4];
          this.modelSvc.userList = this.modelSvc.prepareUserList(results[5]);

          this.prepareEdit();
        },
        error: (res: any) => {},
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  get sortedList() {
  return [...(this.modelSvc.workFlow.wFDocumentWFDetailDTOList || [])].sort((a, b) =>
    a.sequence > b.sequence ? 1 : -1
    );
  }

  prepareEdit() {
    try {
      this.dataTransferSvc
        .on("docWFSchemaID")
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((response) => {
          if (response) {
            this.isDisable = true;
            this.getDocWFSchemaByID(Number(response));
            this.dataTransferSvc.remove("docWFSchemaID");
          }
          this.dataTransferSvc.unsubscribe(this.$unsubscribe);
        });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  private getDocWFSchemaByID(docWFSchemaID: number) {
    try {
      this.dataSvc.getDocWFSchemaByID(docWFSchemaID).subscribe({
        next: (res: any) => {
          this.modelSvc.prepareDocWFSchemaForEdit(res);
          this.removeUserValidationForNonePolicy();
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onNodeClick(node: any) {
    try {
      this.modelSvc.workFlow.orgID = node.id;
    } catch (error) {
      this.showErrorMsg(error);
    }
  }

  onClickSchema() {
    try {
      this.isDisable = false;
      this.modelSvc.workFlow.wFDocumentWFDetailDTOList = [];
      if (this.modelSvc.workFlow.wFSchemaID > 0) {
        this.isDisable = true;
        this.dataSvc
          .getWFSchemaByID(this.modelSvc.workFlow.wFSchemaID)
          .subscribe({
            next: (res: any) => {
              this.modelSvc.schemaDetailList = res;
              this.modelSvc.prepareWorkFlowFromSchema();
              this.removeUserValidationForNonePolicy();
            },
            error: (res: any) => {
              this.showErrorMsg(res);
            },
          });
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  showPolicyModal(policyCode: string) {
    try {
      this.isShowPolicyModal = true;
      this.isPolicySelected = false;
      this.modelSvc.selectedPolicyCode = policyCode;
      this.modelSvc.policyList = this.modelSvc.prepareDataForPolicyModal();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  deletePolicy(item) {
    try {
      this.modelSvc.workFlow.wFDocumentWFDetailDTOList.entityPop(item);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  okPolicy() {
    try {
      this.isShowPolicyModal = false;
      this.modelSvc.prepareSelectedPolicy();
      this.removeUserValidationForNonePolicy();
      this.workFlowForm.form.markAsDirty();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  removeUserValidationForNonePolicy(){
    try {
      let startPolicy = this.modelSvc.workFlow.wFDocumentWFDetailDTOList.find(f => f.fromStatusID == null && f.tag != FixedIDs.objectState.deleted);
      if(startPolicy)
      {
        setTimeout(() => {
          let formGrp = this.workFlowForm.form.controls['forwardPolicy_' + startPolicy.id] as UntypedFormGroup;
          let ctrl = formGrp.controls["userIDs"];
          ctrl.removeValidators(Validators.required);
          ctrl.updateValueAndValidity();
        }, 50);
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  resetPolicy() {
    try {
      this.modelSvc.policyList.forEach((element) => {
        element.isSelected = false;
      });
      this.isPolicySelected = false;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  checkIsPolicySelected() {
    try {
      this.isPolicySelected = false;
      var selectedExist = this.modelSvc.policyList.find(
        (f) => f.isSelected == true
      );
      if (selectedExist) this.isPolicySelected = true;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  saveWorkFlow(formGroup: NgForm) {
    try {
      if (!formGroup.valid) {
        this.directive.validateAllFormFields(
          formGroup.form as UntypedFormGroup
        );
        return;
      }
      let errorMsg = this.modelSvc.checkValidPolicy();
      if(errorMsg)
      {
         this.showMsg(errorMsg);
         return;
      }
      errorMsg = this.modelSvc.checkActorInForwardPolicy();
      if(errorMsg)
      {
         this.showMsg(errorMsg);
         return;
      }
      this.modelSvc.prepareDataToSave();
      this.save(this.modelSvc.workFlow);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  private save(workFlow: WFDocumentWFSchema) {
    try {
      let messageCode = workFlow.id
        ? this.messageCode.editCode
        : this.messageCode.saveCode;
      this.dataSvc.saveWFDocumentWFSchema(workFlow).subscribe({
        next: (res: any) => {
          this.showMsg(messageCode);
          this.setNew();
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  resetWorkFlow() {
    try {
      if (this.modelSvc.workFlow.id > 0) {
        this.modelSvc.workFlow = GlobalMethods.jsonDeepCopy(
          this.modelSvc.tempWorkFlow
        );
        this.isDisable = true;
        this.formResetByDefaultValue(
          this.workFlowForm.form,
          this.modelSvc.workFlow
        );
      } else {
        this.setNew();
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onChangeIsGlobal() {
    try {
      if (this.modelSvc.workFlow.isWFSchemaUseGlobally) {
        setTimeout(() => {
          let ctrl = this.workFlowForm.form.controls[
            "wfNewSchemaName"
          ] as UntypedFormGroup;
          ctrl.setValidators(Validators.required);
          ctrl.updateValueAndValidity();
        });
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  setNew() {
    try {
      this.modelSvc.workFlow = new WFDocumentWFSchema();
      this.modelSvc.selectedNode = null;
      this.isDisable = false;
      this.formResetByDefaultValue(
        this.workFlowForm.form,
        this.modelSvc.workFlow
      );
    } catch (e) {
      this.showErrorMsg(e);
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
  showWorkFlowSchema() {
    try {
      const modalConfig = new ModalConfig();
      modalConfig.data = {
        eventData: this.modelSvc.workFlow.wFDocumentWFDetailDTOList.filter(
          (f) => f.tag != FixedIDs.objectState.deleted
        ),
        statusList: this.statusList,
      };
      this.ref = this.dialogSvc.open(WorkFlowSchemaComponent, modalConfig);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onClickIsEditWorkFlow() {
    try {
      this.isDisable = !this.isDisable;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  

}
