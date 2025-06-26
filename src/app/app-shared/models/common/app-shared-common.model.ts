import { GlobalConstants } from "../javascriptVariables";

export class DutyValue {
    amount:number = 0;
    vatValue: number = 0;
    vatPercent: number = 0;
    sDValue: number = 0;
    sDPercent: number = 0;
    constructor(defaultData?: Partial<DutyValue>) {
      defaultData = defaultData || {};
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
    }
  }
export class WFDocumentTransaction {
    id: number = 0;
    transactionCode: string | null = null;
    documentID: number = GlobalConstants.pageInfo.id;
    transactionID: number = 0;
    eventDate: Date = new Date();
    documentWFDetailID: number = 0;
    eventUserID: number = GlobalConstants.userInfo.userPKID;;
    isApprove: boolean = false;
    comment: string | null = null;
    projectId: number | null = null;
    orgId: number | null = GlobalConstants.userInfo.rootOrgID;
    companyId: number = GlobalConstants.userInfo.companyID;
    createByID: number = GlobalConstants.userInfo.userPKID;
    createOn: Date = new Date();
    updateByID: number | null = null;
    updateOn: Date | null = null;
    isDeleted: boolean = false;
    deleteByID: number | null = null;
    deleteOn: Date | null = null;
    eventUserIP: string | null = null;
    isActive: boolean = true;
    locationID:number = GlobalConstants.userInfo.locationID;
    constructor(defaultData?: Partial<WFDocumentTransaction>) {
      defaultData = defaultData || {};
      Object.keys(defaultData).forEach((key) => {
        const value = defaultData[key];
        if (this.hasOwnProperty(key)) {
          this[key] = value;
        }
      });
    }
  }
  