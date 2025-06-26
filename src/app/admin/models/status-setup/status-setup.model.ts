import {
  GlobalConstants,
  ICharachterLength,
  ValidatingObjectFormat,
} from "../..";

export class StatusSetup {
  id: number = 0;
  cTGCode: string = null;
  statusName: string = null;
  code: string = null;
  isActive: boolean = true;
  isDefault: boolean = false;
  colorCode: string = null;
  statusCategory: string = null;
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

export function statusSetupValidation(): any {
  return {
    statusSetupValidationModel: {
      cTGCode: {
        required: GlobalConstants.validationMsg.cTGCode,
      },
      statusName: {
        required: GlobalConstants.validationMsg.statusName,
        maxlength: {
          message: "Value max length 20!",
          length: 20,
        } as ICharachterLength,
      },
      code: {
        required: GlobalConstants.validationMsg.code,
        maxlength: {
          message: "Value max length 20!",
          length: 20,
        } as ICharachterLength,
      },
    } as ValidatingObjectFormat,
  };
}
