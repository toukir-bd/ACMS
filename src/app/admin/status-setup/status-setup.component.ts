import { Component, OnInit, ViewChild } from "@angular/core";
import {
  BaseComponent,
  ColumnType,
  GridOption,
  ProviderService,
  QueryData,
  UtilityService,
  ValidatorDirective,
} from "..";
import { NgForm, UntypedFormGroup } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { StatusSetupModelService } from "../services/status-setup/status-setup-model.service";
import {
  StatusSetup,
  statusSetupValidation,
} from "../models/status-setup/status-setup.model";
import { StatusSetupDataService } from "../services/status-setup/status-setup-data.service";
@Component({
  selector: "app-status-setup",
  templateUrl: "./status-setup.component.html",
  providers: [StatusSetupDataService, StatusSetupModelService],
  standalone: true,
  imports: [SharedModule],
})
export class StatusSetupComponent extends BaseComponent implements OnInit {
  @ViewChild(ValidatorDirective) directive;
  public validationMsgObj: any;
  @ViewChild("statusSetupForm", { static: true, read: NgForm })
  statusSetupForm: NgForm;
  gridOption: GridOption;
  spData: any = new QueryData();
  tempStatusSetupModel: StatusSetup = new StatusSetup();
  constructor(
    public providerSvc: ProviderService,
    public modelSvc: StatusSetupModelService,
    private dataSvc: StatusSetupDataService
  ) {
    super(providerSvc);
    this.validationMsgObj = statusSetupValidation();
  }

  ngOnInit(): void {
    this.modelSvc.setDefaultStatusSetupData();
    this.initGridOption();
    this.loadStatusList();
    this.loadStatusCategoryList();
  }

  ngAfterViewInit() {
    try {
      this.modelSvc.statusSetupForm = this.statusSetupForm.form;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  loadStatusCategoryList() {
    try {
      this.dataSvc.GetStatusCategoryList().subscribe({
        next: (res: any) => {
          let resData = res;

          if (resData.length > 0) {
            this.modelSvc.prepareStatusCategoryList(resData);
          } else {
            this.modelSvc.statusCategoryList = [];
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

  initGridOption() {
    try {
      const gridObj = {
        title: this.fieldTitle["statussetuplist"],
        dataSource: "modelSvc.statusList",
        columns: this.gridColumns(),
        refreshEvent: this.loadStatusList,
        isGlobalSearch: true,
        exportOption: {
          exportInPDF: true,
          exportInXL: true,
          title: this.fieldTitle["statussetuplist"],
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
          field: "statusCategory",
          header: this.fieldTitle["statuscategory"],
          style: "",
        },
        {
          field: "statusName",
          header: this.fieldTitle["status"],
          style: "",
        },
        { field: "code", header: this.fieldTitle["code"], style: "" },

        { field: "colorCode", header: this.fieldTitle["colorcode"], style: "" },
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

  loadStatusList() {
    try {
      this.spData.pageNo = 0;
      this.dataSvc.GetStatusList(this.spData).subscribe({
        next: (res: any) => {
          let resData = res[res.length - 1];
          if (resData.length > 0) {
            this.modelSvc.prepareStatusList(resData);
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
  editStatus(item: any, form: NgForm): void {
    try {
      this.modelSvc.statusSetupModel = { ...item };
      this.tempStatusSetupModel = { ...item };

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
                this.modelSvc.setDefaultStatusSetupData();
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

  save(formGroup: NgForm) {
    try {
      if (
        !this.utilitySvc.checkDuplicateEntry(
          this.modelSvc.statusList,
          this.modelSvc.statusSetupModel,
          "code"
        ) &&
        !this.utilitySvc.checkDuplicateEntry(
          this.modelSvc.statusList,
          this.modelSvc.statusSetupModel,
          "statusName"
        )
      ) {
        if (!formGroup.valid) {
          this.directive.validateAllFormFields(
            formGroup.form as UntypedFormGroup
          );
          return;
        }

        this.dataSvc.SaveStatus(this.modelSvc.statusSetupModel).subscribe({
          next: (res: any) => {
            this.showMsg(this.messageCode.saveCode);
            formGroup.form.markAsPristine();
            this.modelSvc.setDefaultStatusSetupData();
            this.loadStatusList();
          },
          error: (res: any) => {
            this.showErrorMsg(res);
          },
          complete: () => {},
        });
      } else {
        this.showMsg(this.messageCode.duplicateCheck);
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  reset() {
    try {
      if (this.statusSetupForm.dirty) {
        this.utilitySvc
          .showConfirmModal(this.messageCode.dataLoss)
          .subscribe((isConfirm: boolean) => {
            if (isConfirm) {
              if (this.modelSvc.statusSetupModel.id > 0) {
                this.formResetByDefaultValue(
                  this.statusSetupForm.form,
                  this.tempStatusSetupModel
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
      this.modelSvc.statusSetupModel = new StatusSetup();
      this.formResetByDefaultValue(
        this.statusSetupForm.form,
        this.modelSvc.statusSetupModel
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
