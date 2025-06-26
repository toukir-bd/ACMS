import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UntypedFormGroup } from "@angular/forms";
import { EventSetup } from "../../models/event-setup/event-setup.model";
@Injectable()
export class EventSetupModelService {
  eventSetupForm: UntypedFormGroup;
  eventSetupModel: EventSetup;
  eventCategoryList: [];
  eventList: EventSetup[] = [];

  constructor(private utilitySvc: UtilityService) {}

  setDefaultData(data) {
    try {
      if (data) {
        this.eventSetupModel = new EventSetup(data);
      } else {
        this.eventSetupModel = new EventSetup();
      }
    } catch (error) {
      throw error;
    }
  }

  prepareEventCategoryList(data) {
    try {
      this.eventCategoryList = data;
    } catch (error) {
      throw error;
    }
  }

  prepareEventList(data) {
    try {
      this.eventList = data;
    } catch (error) {
      throw error;
    }
  }

  setDefaultEventSetupData() {
    try {
      this.eventSetupModel = new EventSetup();
    } catch (error) {}
  }
}
