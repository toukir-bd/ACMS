import {
  GlobalConstants,
  ICharachterLength,
  ValidatingObjectFormat,
} from "../..";

export class EventSetup {
  id: number = 0;
  event: string = null;
  code: string = null;
  bgColor: string = null;
  icon: string = null;
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

export function eventSetupValidation(): any {
  return {
    eventSetupValidationModel: {
      event: {
        required: GlobalConstants.validationMsg.event,
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
