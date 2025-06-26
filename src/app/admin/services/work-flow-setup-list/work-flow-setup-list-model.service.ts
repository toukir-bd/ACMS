import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventSetup } from "../../models/event-setup/event-setup.model";
@Injectable()
export class WorkFlowSetupListModelService {
  workFlowSetupList: [];

  constructor(private utilitySvc: UtilityService) {}

  prepareworkFlowSetupList(data) {
    try {
      this.workFlowSetupList = data;
    } catch (error) {
      throw error;
    }
  }
}
