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
import {
  EventSetup,
  eventSetupValidation,
} from "../models/event-setup/event-setup.model";
import { EventSetupDataService } from "../services/event-setup/event-setup-data.service";
import { EventSetupModelService } from "../services/event-setup/event-setup-model.service";
import { FixedIDs } from "src/app/app-shared/models/fixedIDs";

@Component({
  selector: "app-event-setup",
  templateUrl: "./event-setup.component.html",
  providers: [EventSetupDataService, EventSetupModelService],
  standalone: true,
  imports: [SharedModule],
})
export class EventSetupComponent extends BaseComponent implements OnInit {
  @ViewChild(ValidatorDirective) directive;
  public validationMsgObj: any;
  @ViewChild("eventSetupForm", { static: true, read: NgForm })
  eventSetupForm: NgForm;

  gridOption: GridOption;
  spData: any = new QueryData();
  tempEventSetupModel: EventSetup = new EventSetup();
  icons: any;
  constructor(
    public providerSvc: ProviderService,
    public modelSvc: EventSetupModelService,
    private dataSvc: EventSetupDataService
  ) {
    super(providerSvc);
    this.validationMsgObj = eventSetupValidation();
  }

  ngOnInit(): void {
    this.modelSvc.setDefaultEventSetupData();
    this.initGridOption();
    this.loadEventList();
    this.icons = FixedIDs.icons;
  }

  ngAfterViewInit() {
    try {
      this.modelSvc.eventSetupForm = this.eventSetupForm.form;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  initGridOption() {
    try {
      const gridObj = {
        title: this.fieldTitle["eventlist"],
        dataSource: "modelSvc.eventList",
        columns: this.gridColumns(),
        refreshEvent: this.loadEventList,
        isGlobalSearch: true,
        exportOption: {
          exportInPDF: true,
          exportInXL: true,
          title: this.fieldTitle["eventlist"],
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
          field: "event",
          header: this.fieldTitle["event"],
          style: "",
        },
        { field: "code", header: this.fieldTitle["code"], style: "" },
        { field: "icon", header: this.fieldTitle["icon"], style: "" },
        { field: "bgColor", header: this.fieldTitle["colorcode"], style: "" },

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

  loadEventList() {
    try {
      this.dataSvc.GetEventList().subscribe({
        next: (res: any) => {
          let resData = res;
          if (resData.length > 0) {
            this.modelSvc.prepareEventList(resData);
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
  editEvent(item: any, form: NgForm): void {
    try {
      this.modelSvc.eventSetupModel = { ...item };
      this.tempEventSetupModel = { ...item };
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
  deleteEvent(id: number, form: NgForm) {
    try {
      this.utilitySvc
        .showConfirmModal(this.messageCode.confirmDelete)
        .subscribe((isConfirm: boolean) => {
          if (isConfirm) {
            this.spData.pageNo = 0;
            this.dataSvc.DeleteLanguage(id).subscribe({
              next: (res: any) => {
                this.showMsg(this.messageCode.deleteCode);
                this.modelSvc.eventList = this.modelSvc.eventList.filter(
                  (event: any) => event.id !== id
                );
                this.modelSvc.setDefaultEventSetupData();
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
          this.modelSvc.eventList,
          this.modelSvc.eventSetupModel,
          "code"
        ) &&
        !this.utilitySvc.checkDuplicateEntry(
          this.modelSvc.eventList,
          this.modelSvc.eventSetupModel,
          "event"
        )
      ) {
        if (!formGroup.valid) {
          this.directive.validateAllFormFields(
            formGroup.form as UntypedFormGroup
          );
          return;
        }

        this.dataSvc.SaveEvent(this.modelSvc.eventSetupModel).subscribe({
          next: (res: any) => {
            this.showMsg(this.messageCode.saveCode);
            formGroup.form.markAsPristine();
            this.modelSvc.setDefaultEventSetupData();
            this.loadEventList();
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
      if (this.eventSetupForm.dirty) {
        this.utilitySvc
          .showConfirmModal(this.messageCode.dataLoss)
          .subscribe((isConfirm: boolean) => {
            if (isConfirm) {
              if (this.modelSvc.eventSetupModel.id > 0) {
                this.formResetByDefaultValue(
                  this.eventSetupForm.form,
                  this.tempEventSetupModel
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
      this.modelSvc.eventSetupModel = new EventSetup();
      this.formResetByDefaultValue(
        this.eventSetupForm.form,
        this.modelSvc.eventSetupModel
      );
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
