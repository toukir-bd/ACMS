import { GlobalConstants } from "src/app/app-shared/models/javascriptVariables";
import { ValidatingObjectFormat } from "../..";
import { IRange } from "src/app/shared/models/common.model";

export class WFDocumentWFSchema {
  id: number = 0;
  wFRefNo: string = null;
  wFSchemaID: number = null;
  documentID: number = null;
  projectID: number = null;
  orgID: number = null;
  companyID: number = GlobalConstants.companyInfo.companyID;
  schemaName: string = null;
  isActive: boolean = true;

  locationID: number = GlobalConstants.userInfo.locationID;
  documentName: string = null;
  // orgName:string = null;
  // wfSchemaName:string = null;
  // projectName:string = null;
  wfNewSchemaName: string = null;
  isEditWorkFlow: boolean = false;
  isWFSchemaUseGlobally: boolean = false;

  wFDocumentWFDetailDTOList: WFDocumentWFDetail[] = [];

  constructor(defaultData?: Partial<WFDocumentWFSchema>) {
    (defaultData = defaultData || {}),
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
  }
}

export class WFDocumentWFDetail {
  id: number = 0;
  docWFSchemaID: number = 0;
  workFlowID: number = null;
  sequence: number = null;
  tag: number = 0;

  policyCode: string = null;
  statusName: string = null;
  fromStatusID: number = null;
  toStatusID: number = null;
  userIDs: string = null;
  fromCTGCode: string = null;
  toCTGCode: string = null;
  fromStatusName: string = null;
  event: string = null;
  toStatusName: string = null;
  colorCode: string = null;
  wFDocumentUserPermissionList: WFDocumentUserPermission[] = [];
  isCheckUserValidation:boolean = false;

  constructor(defaultData?: Partial<WFDocumentWFDetail>) {
    (defaultData = defaultData || {}),
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
  }
}

export class WFDocumentUserPermission {
  id: number = 0;
  docWFDetailID: number = 0;
  userId: number = null;
  tag: number = 0;
  constructor(defaultData?: Partial<WFDocumentUserPermission>) {
    (defaultData = defaultData || {}),
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
  }
}

export function WorkFlowValidation(): any {
  return {
    WorkFlowValidation: {
      documentID: {
        required: GlobalConstants.validationMsg.document,
      },
      wfNewSchemaName: {
        required: GlobalConstants.validationMsg.schemaname,
      },
    } as ValidatingObjectFormat,
    WorkFlowDetailValidation: {
      workFlowID: {
        required: GlobalConstants.validationMsg.workflow,
      },
      userIDs: {
        required: GlobalConstants.validationMsg.userids,
      },
      sequence: {
        required: GlobalConstants.validationMsg.sequence,
        range: {
          message: "Value range 1 to 99.",
          startValue: 1,
          endValue: 99,
        } as IRange,
      },
    } as ValidatingObjectFormat,
  };
}
