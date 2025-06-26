import { Injectable } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { StatusSetup } from "../../models/status-setup/status-setup.model";
@Injectable()
export class StatusSetupModelService {
  statusSetupForm: UntypedFormGroup;
  statusSetupModel: StatusSetup;
  statusCategoryList: [];
  statusList: StatusSetup[] = [];

  constructor() {}

  setDefaultData(data) {
    try {
      if (data) {
        this.statusSetupModel = new StatusSetup(data);
      } else {
        this.statusSetupModel = new StatusSetup();
      }
    } catch (error) {
      throw error;
    }
  }

  prepareStatusCategoryList(data) {
    try {
      this.statusCategoryList = data;
    } catch (error) {
      throw error;
    }
  }

  prepareStatusList(data) {
    try {
      this.statusList = data;
    } catch (error) {
      throw error;
    }
  }

  setDefaultStatusSetupData() {
    try {
      this.statusSetupModel = new StatusSetup();
    } catch (error) {}
  }
}
