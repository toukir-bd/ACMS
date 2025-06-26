import {
  FileUploadOption,
  ImageFile,
} from "src/app/shared/models/common.model";
import { GlobalConstants, ValidatingObjectFormat } from "../..";

export class StatusSetup {
  id: number = 0;
  cTGCode: string = null;
  statusName: string = null;
  code: string = null;
  isActive: boolean = true;
  isDefault: boolean = false;

  constructor(defaultData?: Partial<StatusSetup>) {
    defaultData = defaultData || {};
    Object.keys(defaultData).forEach((key) => {
      const value = defaultData[key];
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    });
  }
}
export class EventSetup {
  id: number = 0;
  event: string = null;
  code: string = null;
  isActive: boolean = true;

  constructor(defaultData?: Partial<EventSetup>) {
    defaultData = defaultData || {};
    Object.keys(defaultData).forEach((key) => {
      const value = defaultData[key];
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    });
  }
}

export class PolicySetupModel {
  id: number = 0;
  eventID: number = 0;
  policyCode: number = 0;
  fromStatusID: number = null;
  toStatusID: string = null;
  isActive: boolean = true;

  constructor(defaultData?: Partial<PolicySetupModel>) {
    defaultData = defaultData || {};
    Object.keys(defaultData).forEach((key) => {
      const value = defaultData[key];
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    });
  }
}

export class WorkFlowPolicy {
  policyCode: string = null;
  PolicyTitle: string = null;
  isActive: boolean = true;

  constructor(defaultData?: Partial<WorkFlowPolicy>) {
    defaultData = defaultData || {};
    Object.keys(defaultData).forEach((key) => {
      const value = defaultData[key];
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    });
  }
}
export function workFlowPolicySetupValidation(): any {
  return {
    workFlowPolicySetupValidationModel: {
      policyCode: {
        required: GlobalConstants.validationMsg.policyCode,
      },
      eventID: {
        required: GlobalConstants.validationMsg.eventID,
      },
      fromStatusID: {
        required: GlobalConstants.validationMsg.fromStatusID,
      },
      toStatusID: {
        required: GlobalConstants.validationMsg.toStatusID,
      },
    } as ValidatingObjectFormat,
  };
}
