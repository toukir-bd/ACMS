import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UntypedFormGroup } from "@angular/forms";
import { StatusSetup } from "../../models/status-setup/status-setup.model";

import { EventSetup } from "../../models/event-setup/event-setup.model";
import {
  PolicySetupModel,
  WorkFlowPolicy,
} from "../../models/workflow-policy-setup/workflow-policy-setup.model";
@Injectable()
export class WorkFlowPolicySetupModelService {
  workFlowPolicySetupForm: UntypedFormGroup;
  statusSetupModel: StatusSetup;
  policySetupModel: PolicySetupModel;
  statusCategoryList: [];
  statusList: StatusSetup[] = [];
  eventList: EventSetup[] = [];
  workFlowPolicyList: WorkFlowPolicy[] = [];
  workFlowList: [];
  constructor(private utilitySvc: UtilityService) {}

  setDefaultData(data) {
    try {
      if (data) {
        this.policySetupModel = new PolicySetupModel(data);
      } else {
        this.policySetupModel = new PolicySetupModel();
      }
    } catch (error) {
      throw error;
    }
  }

  prepareWorkFlowPolicyList(data) {
    try {
      this.workFlowPolicyList = data;
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
  prepareWorkFlowList(data) {
    try {
      this.workFlowList = data;
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

  setDefaultPolicySetupData() {
    try {
      this.policySetupModel = new PolicySetupModel();
    } catch (error) {}
  }
}
