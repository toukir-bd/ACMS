import { Component, OnInit, ViewChild } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import {
  AdminService,
  BaseComponent,
  FixedIDs,
  GlobalConstants,
  GlobalMethods,
  GridOption,
  ProviderService,
  QueryData,
  ValidatingObjectFormat,
  ValidatorDirective,
} from "..";
import { NgForm, UntypedFormGroup } from "@angular/forms";
import { PageNotificationComponent } from "../page-notification/page-notification.component";
import { forkJoin } from "rxjs";
@Component({
  selector: "app-sample-page",
  imports: [SharedModule, PageNotificationComponent],
  templateUrl: "./sample-page.component.html",
  standalone: true,
})
export class SamplePageComponent extends BaseComponent implements OnInit {
   @ViewChild(PageNotificationComponent) pageNotificationComponent: PageNotificationComponent;
  @ViewChild("samplePageForm", { static: true, read: NgForm })
  samplePageForm: NgForm;
  @ViewChild(ValidatorDirective) directive;
  validationMsgObj: any;
  samplePage: SamplePage = new SamplePage();
  tempSamplePage:SamplePage = null;
  docSchemaList: any[] = [];
  gridOption: GridOption;
  spData: any = new QueryData();
  sampleList: any[] = [];
  isShowEntry: boolean = false;
  comments: string = null;
  selectedWFSchemaDetailID: number = null;
  eventList: any[] = [];
  selectedTransactionID:number = null;
  isSelectedAll:boolean = false;

  constructor(
    protected providerSvc: ProviderService,
    private dataSvc: AdminService
  ) {
    super(providerSvc);
    this.validationMsgObj = SampleValidation();
  }

  ngOnInit(): void {
    try {
      this.initGridOption();
      this.getDefaultData();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onSelectTransaction(transactionID:number){
    try {
      this.getSampleByID(transactionID);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  getDefaultData(){
    try {
        forkJoin([
          this.dataSvc.getWFDocumentWFSchema(GlobalConstants.pageInfo.id, null, GlobalConstants.userInfo.rootOrgID),
          this.dataSvc.getSampleList()
        ]).subscribe({
          next: (results: any) => {
            this.docSchemaList = results[0];
            this.sampleList = results[1];
            this.prepareEdit();
          },
          error: (res: any) => {},
        });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }


    prepareEdit() {
      try {
        this.dataTransferSvc
          .on("transactionID")
          .subscribe((response) => {
            if (response) {
              setTimeout(() => {
                 this.getSampleByID(Number(response));
                 this.dataTransferSvc.remove("transactionID");
              }, 500);
             }
          });
      } catch (e) {
        this.showErrorMsg(e);
      }
    }


  initGridOption() {
    try {
      const gridObj = {
        dataSource: "sampleList",
        refreshEvent: this.getSampleList,
        isGlobalSearch: true,
        globalFilterFields:['code', 'sample', 'statusName', 'comment', 'eventDate', 'eventUserIP', 'userName'],
        isDynamicHeader:false,
        exportOption: {
          exportInPDF: true,
          exportInXL: true,
          title: "Sample Page",
        },
      } as GridOption;
      this.gridOption = new GridOption(this, gridObj);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  getSampleByID(id: number) {
    try {
      let sample =  this.sampleList.find(a => a.id == id);
      this.edit(sample);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onClickNew(){
    try {
      this.samplePage = new SamplePage();
      this.isShowEntry = !this.isShowEntry;
      this.reset();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onClickDeleteAll(){
    try {
      let selectedIDs = this.sampleList.filter(f => f.isSelected == true).map(m => m.id).join(',');
      if(selectedIDs)
      {
        this.utilitySvc
              .showConfirmModal(this.messageCode.confirmDelete)
              .subscribe((isConfirm: boolean) => {
                if (isConfirm) {
                   this.dataSvc.deleteSampleByIDs(selectedIDs).subscribe({
                    next: (res: any) => {
                      this.showMsg(this.messageCode.deleteCode);
                      this.getSampleList();
                    },
                    error: (res: any) => {
                      this.showErrorMsg(res);
                    },
                  });
                }
              });
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  reset() {
    try {
      if(this.samplePage.id > 0)
      { 
        this.samplePage = new SamplePage(this.tempSamplePage);
      }
      else{
        this.samplePage = new SamplePage();
      }
      this.formResetByDefaultValue(this.samplePageForm.form, this.samplePage);
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

      let messageCode = this.samplePage.id
        ? this.messageCode.editCode
        : this.messageCode.saveCode;
      this.dataSvc.saveSamplePage(this.samplePage).subscribe({
        next: (res: any) => {
          this.showMsg(messageCode);
          this.samplePage = new SamplePage();
          this.isShowEntry = false;
          if (this.samplePage.id == 0 && this.docSchemaList.length > 0) {
            this.manageDocTransaction(res.body.id, res.body.code);
          }
          else{
            this.getSampleList();
          }
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  manageDocTransaction(transactionID: number, transactionCode: string) {
    try {
      let wfSchema = this.docSchemaList.find(a => a.userID == GlobalConstants.userInfo.userPKID && a.fromStatusID == null && a.isActive == true);
      if(wfSchema == null)
      {
        wfSchema = this.docSchemaList.find(a => a.orgID > 0 && a.userID == GlobalConstants.userInfo.userPKID && a.isActive == true && a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy);
      }
      if(wfSchema == null)
      {
        wfSchema = this.docSchemaList.find(a => a.orgID > 0 && a.isActive == true && a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy);
      }
      if(wfSchema == null)
      {
        wfSchema = this.docSchemaList
              .sort((a, b) => a.sequence - b.sequence)
              .reverse()
              .find(
                (a) =>
                  a.userID == GlobalConstants.userInfo.userPKID
              );
      }
      if (wfSchema == null) {
        wfSchema = this.docSchemaList.filter(a => a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy)
        .sort((a, b) => a.sequence - b.sequence)
        .reverse()
        .find(
          (a) =>  a.isActive == true
        );
      }
      if (wfSchema != null) {
        this.dataSvc
          .saveDocTransaction(
            wfSchema.documentWFDetailID,
            transactionID,
            transactionCode
          )
          .subscribe({
            next: (res: any) => {
              GlobalConstants.signalRConnection.invoke("SendMessage", GlobalConstants.userInfo.userUniqueNo, null).catch(function (err) {});
              this.getSampleList();
              this.getDocSchema();
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

  getDocSchema(transactionID?:number) {
    try {
      this.dataSvc.getWFDocumentWFSchema(GlobalConstants.pageInfo.id, transactionID, GlobalConstants.userInfo.rootOrgID).subscribe({
        next: (res: any) => {
          this.docSchemaList = res;
          if(transactionID > 0)
          {
            this.prepareEvent(transactionID);
          }
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  getSampleList() {
    try {
      this.dataSvc.getSampleList().subscribe({
        next: (res: any) => {
          this.sampleList = res;
          this.isSelectedAll = false;
        },
        error: (res: any) => {
          this.showErrorMsg(res);
        },
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  edit(entity: any) {
    try {
      this.eventList = [];
      this.selectedWFSchemaDetailID = null;
      this.comments = null;
      this.isShowEntry = true;
      this.samplePage = new SamplePage(entity);
      this.tempSamplePage = GlobalMethods.jsonDeepCopy(this.samplePage);
      this.getDocSchema(this.samplePage.id);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

    prepareEvent(transactionID:number){
      try {
        let activeEvent = this.docSchemaList.find(f => f.transactionID == transactionID);
        if(activeEvent)
        {
          let userForwardEvent = this.docSchemaList.find(f => f.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy && f.userID == GlobalConstants.userInfo.userPKID && f.docWFSchemaID == activeEvent.docWFSchemaID);
          let commonEventList = this.docSchemaList.filter(f => f.fromStatusID == activeEvent.toStatusID && f.wFDocumentTransactionID == null && f.docWFSchemaID == activeEvent.docWFSchemaID);
          let userReOpenEvent = this.docSchemaList.find(f => f.policyCode == FixedIDs.workFlowPolicy.ReOpenPolicy && f.userID == GlobalConstants.userInfo.userPKID && f.docWFSchemaID == activeEvent.docWFSchemaID);  

          for (let index = 0; index < commonEventList.length; index++) {
            const event = commonEventList[index];
            if(userForwardEvent)
            {
              if((event.policyCode == FixedIDs.workFlowPolicy.BackwardPolicy || event.policyCode == FixedIDs.workFlowPolicy.CancellationPolicy) && activeEvent.toStatusID == userForwardEvent.fromStatusID)
              {
                this.eventList.push(event);
              }
              else if(event.policyCode == FixedIDs.workFlowPolicy.CancellationPolicy && activeEvent.fromStatusID == null && activeEvent.toStatusID == userForwardEvent.toStatusID)
              {
                this.eventList.push(event);
              }
              else if((event.policyCode == FixedIDs.workFlowPolicy.WithdrawPolicy) && activeEvent.toStatusID == userForwardEvent.toStatusID)
              {
                this.eventList.push(event);
              }
              else if(event.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy)
              {
                this.eventList.push(event);
              }
            }

            if(userReOpenEvent)
            {
              if(activeEvent.toCTGCode == FixedIDs.workFlowStatusCategory.Close && event.policyCode == FixedIDs.workFlowPolicy.ReOpenPolicy)
              {
                this.eventList.push(event);
              }
            }
          }
        }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  delete(entity: any) {
    try {
      this.utilitySvc
      .showConfirmModal(this.messageCode.confirmDelete)
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.dataSvc.deleteSampleByID(entity.id).subscribe({
            next: (res: any) => {
              this.showMsg(this.messageCode.deleteCode);
              this.utilitySvc.deleteCollection(this.sampleList, entity);
            },
            error: (res: any) => {
              this.showErrorMsg(res);
            },
          });
        }
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onClickEvent(wFSchemaDetailID:number) {
    try {
      this.selectedWFSchemaDetailID = wFSchemaDetailID;
      let wfSchemaDetail = this.eventList.find(
        (a) => a.documentWFDetailID == this.selectedWFSchemaDetailID
      );
      this.dataSvc
        .saveDocTransaction(
          wfSchemaDetail.documentWFDetailID,
          this.samplePage.id,
          null,
          this.comments
        )
        .subscribe({
          next: (res: any) => {
            this.showMsg(wfSchemaDetail.toStatusName);
            this.pageNotificationComponent.removeNotification(this.samplePage.id);
            this.isShowEntry = false;
            this.getSampleList();
            this.getDocSchema();
            GlobalConstants.signalRConnection.invoke("SendMessage", GlobalConstants.userInfo.userUniqueNo, null).catch(function (err) {});
          },
          error: (res: any) => {
            this.showErrorMsg(res);
          },
        });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onChangeIsSelectedAll(){
    try {
      this.sampleList.forEach(element => {
        element.isSelected = this.isSelectedAll;
      });
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  onChangeSelected(entity:any){
    try {
      let isSelectedAll = true;
      this.sampleList.forEach(element => {
        if(!element.isSelected)
        {
          isSelectedAll = false;
        }
      });
      this.isSelectedAll = isSelectedAll;
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

}

export class SamplePage {
  id: number = 0;
  code: string = null;
  sample: string = null;
  isApproved:boolean = false;
  isDraft:boolean = false;
  approvalStatusID:number = null;
  statusName: string = null;
  constructor(defaultData?: Partial<SamplePage>) {
    (defaultData = defaultData || {}),
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
  }
}

export function SampleValidation(): any {
  return {
    SampleValidation: {
      sample: {
        required: GlobalConstants.validationMsg.sample,
      },
    } as ValidatingObjectFormat,
  };
}
