import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import {
  ApiService,
  Config,
  FixedIDs,
  GlobalConstants,
  GlobalMethods,
  QueryData,
} from "src/app/shared";
import {
  WFDocumentUserPermission,
  WFDocumentWFDetail,
  WFDocumentWFSchema,
} from "../../models/workflow/workflow-setup.model";
import { TreeNode } from "primeng/api";

@Injectable()
export class WorkFlowDataService {
  controllerName = Config.url.adminLocalUrl + "WorkFlowSetup";
  spData: any = new QueryData();
  constructor(private apiSvc: ApiService) {
    this.spData.pageNo = 0;
  }

  saveWFDocumentWFSchema(entity: WFDocumentWFSchema): Observable<any> {
    return this.apiSvc.save(
      `${this.controllerName}/SaveWFDocumentWFSchema`,
      entity,
      true
    );
  }
  getDocWFSchemaByID(docWFSchemaID: number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetDocWFSchemaByID", {
        docWFSchemaID: docWFSchemaID,
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
  getWFSchema(isActive?: boolean) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFSchema", {
        data: JSON.stringify(this.spData),
        isActive: isActive == null ? "" : isActive,
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1];
        })
      );
  }
  getWFSchemaByID(schemaID: number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFSchemaByID", {
        data: JSON.stringify(this.spData),
        schemaID: schemaID,
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1];
        })
      );
  }
  getWFWorkFlowPolicy() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFWorkFlowPolicy", {
        data: JSON.stringify(this.spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1];
        })
      );
  }

  getAllUsers(locationID: number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetAllUsers", {
        data: JSON.stringify(this.spData),
        locationID: locationID,
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1];
        })
      );
  }
}

@Injectable()
export class WorkFlowModelService {
  constructor() {}
  fieldTitle: any;
  workFlow: WFDocumentWFSchema = new WFDocumentWFSchema();
  tempWorkFlow: WFDocumentWFSchema = null;
  schemaDetailList: any[] = [];
  documentList: any[] = [];
  orgList: any[] = [];
  projectList: any[] = [];
  schemalList: any[] = [];
  workFlowPolicyList: any[] = [];
  userList: any[] = [];
  forwardPolicyStatusDDL: any[] = [];
  policyList: any[] = [];
  selectedPolicyCode: string = null;
  policyModalTitle: string = null;
  selectedNode: any = null;
  mapObjectProps(data: any[]) {
    try {
      return data.map((x) => {
        return {
          label: x.name,
          key: x.id.toString(),
          parentID: x.parentOrgID,
          id: x.id,
        } as TreeNode;
      });
    } catch (error) {
      throw error;
    }
  }
  prepareTreeData(arr, parentID) {
    try {
      const master: any[] = [];
      let level = 1;
      for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        val.expandLevel = level;
        val.label = val.label;
        if (val.parentID == parentID) {
          const children = this.prepareTreeData(arr, val.key);
          if (children.length) {
            val.children = children;
          }
          level++;
          master.push(val);
        }
      }
      return master;
    } catch (error) {
      throw error;
    }
  }
  prepareWorkFlowFromSchema() {
    try {
      this.schemaDetailList.forEach((element) => {
        var workFlowDetail = new WFDocumentWFDetail(element);
        workFlowDetail.id = 0;
        workFlowDetail.workFlowID = element.wFID;
        workFlowDetail.sequence = element.sequenceNo;
        workFlowDetail.statusName =
          element.fromStatusName +
          " => " +
          element.event +
          " => " +
          element.toStatusName;
        workFlowDetail.resetTag();
        this.workFlow.wFDocumentWFDetailDTOList.entityPush(workFlowDetail);
      });
    } catch (e) {
      throw e;
    }
  }
  prepareDataForPolicyModal() {
    try {
      let wfPolicy = GlobalMethods.jsonDeepCopy(
        this.workFlowPolicyList.filter(
          (f) => f.policyCode == this.selectedPolicyCode
        )
      );
      let validPolicy = [];
      switch (this.selectedPolicyCode) {
        case FixedIDs.workFlowPolicy.ForwardPolicy:
          this.policyModalTitle = this.fieldTitle["forwardpolicy"];
          wfPolicy.forEach((element) => {
            let validWfPolicy = this.prepareValidPolicy(element);
            if (validWfPolicy) {
              validPolicy.push(validWfPolicy);
            }
          });
          return validPolicy;
        case FixedIDs.workFlowPolicy.BackwardPolicy:
          this.policyModalTitle = this.fieldTitle["backwardpolicy"];
          wfPolicy.forEach((element) => {
            let existPolicy = this.workFlow.wFDocumentWFDetailDTOList.find(
              (a) =>
                a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
                a.toStatusID == element.fromStatusID &&
                a.fromStatusID == element.toStatusID
            );
            if (existPolicy) {
              let validWfPolicy = this.prepareValidPolicy(element);
              if (validWfPolicy) {
                validPolicy.push(validWfPolicy);
              }
            }
          });
          return validPolicy;
        case FixedIDs.workFlowPolicy.CancellationPolicy:
          this.policyModalTitle = this.fieldTitle["cancellationpolicy"];
          wfPolicy.forEach((element) => {
            var existPolicy = this.workFlow.wFDocumentWFDetailDTOList.find(
              (a) =>
                a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
                a.toStatusID == element.fromStatusID
            );
            if (existPolicy) {
              let validWfPolicy = this.prepareValidPolicy(element);
              if (validWfPolicy) {
                validPolicy.push(validWfPolicy);
              }
            }
          });
          return validPolicy;
        case FixedIDs.workFlowPolicy.WithdrawPolicy:
          this.policyModalTitle = this.fieldTitle["withdrawmode"];
          wfPolicy.forEach((element) => {
            var existPolicy = this.workFlow.wFDocumentWFDetailDTOList.find(
              (a) =>
                a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
                a.toStatusID == element.fromStatusID &&
                a.fromStatusID == element.toStatusID
            );
            if (existPolicy) {
              let validWfPolicy = this.prepareValidPolicy(element);
              if (validWfPolicy) {
                validPolicy.push(validWfPolicy);
              }
            }
          });
          return validPolicy;
        case FixedIDs.workFlowPolicy.ReOpenPolicy:
          this.policyModalTitle = this.fieldTitle["re-openpolicy"];
          wfPolicy.forEach((element) => {
            var existPolicy = this.workFlow.wFDocumentWFDetailDTOList.find(
              (a) =>
                a.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
                a.toStatusID == element.fromStatusID
            );
            if (
              existPolicy ||
              element.fromCTGCode == FixedIDs.workFlowStatusCategory.Close
            ) {
              let validWfPolicy = this.prepareValidPolicy(element);
              if (validWfPolicy) {
                validPolicy.push(validWfPolicy);
              }
            }
          });
          return validPolicy;
        case FixedIDs.workFlowPolicy.CreationPolicy:
          this.policyModalTitle = this.fieldTitle["creationpolicy"];
          wfPolicy.forEach((element) => {
            let validWfPolicy = this.prepareValidPolicy(element);
            if (validWfPolicy) {
              validPolicy.push(validWfPolicy);
            }
          });
          return validPolicy;
        default:
          return [];
      }
    } catch (e) {
      throw e;
    }
  }

  prepareValidPolicy(wfPoliy: any) {
    try {
      let selectedPolicy = this.workFlow.wFDocumentWFDetailDTOList.find(
        (f) => f.workFlowID == wfPoliy.id
      );
      if (!selectedPolicy) {
        return wfPoliy;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  prepareSelectedPolicy() {
    try {
      this.policyList.forEach((element) => {
        if (element.isSelected) {
          var workFlowDetail = new WFDocumentWFDetail(element);
          workFlowDetail.id = 0;
          workFlowDetail.workFlowID = element.id;
          workFlowDetail.statusName =
            element.fromStatusName +
            " => " +
            element.event +
            " => " +
            element.toStatusName;
          workFlowDetail.isCheckUserValidation = workFlowDetail.fromStatusID == null ? false : true;
          workFlowDetail.resetTag();
          this.workFlow.wFDocumentWFDetailDTOList.entityPush(workFlowDetail);
        }
      });
    } catch (e) {
      throw e;
    }
  }
  prepareDataToSave() {
    try {
      this.workFlow.wFDocumentWFDetailDTOList.forEach((element) => {
        element.wFDocumentUserPermissionList = [];
        if (element.userIDs) {
          let userIDList = element.userIDs.split(",");
          for (let i = 0; i < userIDList.length; i++) {
            let id = userIDList[i];
            let userPermission = new WFDocumentUserPermission();
            userPermission.userId = Number(id);
            element.wFDocumentUserPermissionList.entityPush(userPermission);
          }
        }
      });
    } catch (e) {
      throw e;
    }
  }

  prepareDocWFSchemaForEdit(docWFSchema: any) {
    try {
      this.workFlow = new WFDocumentWFSchema(docWFSchema);
      this.workFlow.locationID = GlobalConstants.userInfo.locationID;
      this.workFlow.wFDocumentWFDetailDTOList = [];
      docWFSchema.wFDocumentWFDetailDTOList.forEach((element) => {
        var docWFDetail = new WFDocumentWFDetail(element);
        this.workFlow.wFDocumentWFDetailDTOList.push(docWFDetail);
        debugger
      });
      if (this.workFlow.orgID) {
        this.selectedNode = GlobalMethods.findNodeByKey(
          this.orgList,
          this.workFlow.orgID.toString()
        );
      }

      var document = this.documentList.find(
        (f) => f.id == this.workFlow.documentID
      );
      this.workFlow.documentName = document.pageTitle;
      this.tempWorkFlow = GlobalMethods.jsonDeepCopy(this.workFlow);
    } catch (e) {
      throw e;
    }
  }

  checkValidPolicy() {
    try {
      let forwordPolicyList = this.workFlow.wFDocumentWFDetailDTOList.filter(
        (f) =>
          f.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
          f.tag != FixedIDs.objectState.deleted
      );
      if (forwordPolicyList.length == 0) {
        return "2090";
      }
      return this.validateAndGenerateSequences(forwordPolicyList);
    } catch (e) {
      throw e;
    }
  }

  validateAndGenerateSequences(wfDocDetailList: WFDocumentWFDetail[]) {
    try {
      // Rule 1: Must have exactly one initial state (fromStatusID === null)
      const initialStates = wfDocDetailList.filter(
        (item) => item.fromStatusID === null
      );
      if (initialStates.length !== 1) {
        return "2090";
      }

      // Rule 2: Must have one end state (toCTGCode === 'CL')
      const endStates = wfDocDetailList.filter(
        (item) => item.toCTGCode === "CL"
      );
      if (endStates.length == 0) {
        return "2091";
      }

      // Build map from fromStatusID to list of next items (supporting branching)
      const graph = new Map<number, WFDocumentWFDetail[]>();
      const nodeMap = new Map<number, WFDocumentWFDetail>(); // to lookup by toStatusID

      for (const item of wfDocDetailList) {
        nodeMap.set(item.toStatusID, item);
        if (item.fromStatusID !== null) {
          if (!graph.has(item.fromStatusID)) {
            graph.set(item.fromStatusID, []);
          }
          graph.get(item.fromStatusID)!.push(item);
        }
      }

      const resultPaths: WFDocumentWFDetail[][] = [];

      function dfs(current: WFDocumentWFDetail, path: WFDocumentWFDetail[]) {
        path.push(current);

        // If this is an endpoint (no outgoing edges), save the path
        const nextItems = graph.get(current.toStatusID);
        if (!nextItems || nextItems.length === 0) {
          if (current.toCTGCode == "CL") {
            resultPaths.push([...path]);
            return;
          } else {
            throw new Error(
              "This state " + current.statusName + " is not valid."
            );
          }
        }

        // Traverse all next items (branching support)
        for (const next of nextItems) {
          if (path.includes(next)) {
            throw new Error("This state " + next.statusName + " is not valid.");
          }
          dfs(next, [...path]);
        }
      }

      try {
        dfs(initialStates[0], []);
      } catch (e: any) {
        return e.message;
      }

      // Assign sequence numbers per path
      let globalSequence = 0;
      for (const path of resultPaths) {
        globalSequence = 1;
        for (const item of path) {
          item.sequence = globalSequence++;
        }
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  checkActorInForwardPolicy() {
    try {
      let userIDList = [];
      this.workFlow.wFDocumentWFDetailDTOList
        .filter(
          (f) =>
            f.policyCode == FixedIDs.workFlowPolicy.ForwardPolicy &&
            f.tag != FixedIDs.objectState.deleted
        )
        .forEach((element) => {
          if (element.userIDs) {
            for (const userID of element.userIDs.split(",")) {
              userIDList.push({
                toStatusID: element.toStatusID,
                userID: Number(userID),
              });
            }
          }
        });
      const userID = this.getUsersWithMultipleStatuses(userIDList);
      if (userID > 0) {
        let user = this.userList.find((f) => f.id == userID);
        return (
          user.name +
          " is assigned to multiple states. Please select a single state for him to proceed."
        );
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  getUsersWithMultipleStatuses(data) {
    try {
      const userMap = new Map<number, Set<number>>();

      for (const item of data) {
        if (!userMap.has(item.userID)) {
          userMap.set(item.userID, new Set());
        }
        userMap.get(item.userID)?.add(item.toStatusID);
      }

      for (const [userID, statusSet] of userMap.entries()) {
        if (statusSet.size > 1) {
          return userID; // Return first matching userID
        }
      }

      return null; // No such user found
    } catch (e) {
      throw e;
    }
  }

  //  validateAndGenerateSequence(workflowList: WFDocumentWFDetail[]) {
  //   // Rule 1: Must have exactly one initial state (fromStatusID === null)
  //   const initialStates = workflowList.filter(item => item.fromStatusID === null);
  //   if (initialStates.length !== 1) {
  //     return "2090";
  //   }

  //   // Rule 2: Must have exactly one end state (toCTGCode === 'CL')
  //   const endStates = workflowList.filter(item => item.toCTGCode === 'CL');
  //   if (endStates.length !== 1) {
  //     return "2091";
  //   }

  //   // Build map of all items by fromStatusID for easy lookup
  //   const mapByFromStatusID = new Map<number | null, WFDocumentWFDetail>();
  //   const mapByToStatusID = new Map<number, WFDocumentWFDetail>();

  //   for (const item of workflowList) {
  //     mapByToStatusID.set(item.toStatusID, item);
  //     mapByFromStatusID.set(item.fromStatusID, item);
  //   }

  //   // Start from initial state
  //   let current: WFDocumentWFDetail | undefined = initialStates[0];
  //   const result: WFDocumentWFDetail[] = [];
  //   let sequence = 1;

  //   while (current) {
  //     // Assign sequence
  //     current.sequence = sequence++;
  //     result.push(current);

  //     // Move to next item if exists
  //     const nextItem = mapByFromStatusID.get(current.toStatusID!);
  //     if (!nextItem) break;

  //     // Prevent cycles or re-visiting
  //     if (result.includes(nextItem)) {
  //       throw new Error('Invalid workflow: Cycle detected in transitions.');
  //     }

  //     current = nextItem;
  //   }

  //   // Ensure we ended at the correct final state
  //   const lastItem = result[result.length - 1];
  //   if (lastItem.toCTGCode !== 'CL') {
  //     throw new Error('Invalid workflow: Final state does not end at toCTGCode = CL');
  //   }

  //   // Ensure all items are used? Or only necessary if full coverage required
  //   // If needed, compare result length vs workflowList.length

  //   return result;
  // }

  // isWorkflowValid(transitions: WFDocumentWFDetail[]): boolean {
  //   try {
  //     const sortedSteps = [...transitions].sort((a, b) =>
  //       parseInt(a.sequence.toString()) - parseInt(b.sequence.toString())
  //     );

  //     const knownStatuses = new Set<number>();
  //     for (let i = 0; i < sortedSteps.length; i++) {
  //       const step = sortedSteps[i];
  //        if (i === 0) {
  //         // First step should have sequence == 1
  //         if (parseInt(step.sequence.toString()) !== 1) {
  //           return false;
  //         }

  //         if (step.fromStatusID !== null) {
  //           return false;
  //         }
  //       }

  //       if (step.fromStatusID !== null && !knownStatuses.has(step.fromStatusID)) {
  //           return false;
  //         }
  //       knownStatuses.add(step.toStatusID);
  //     }

  //     // Rule 1: Duplicate sequences are allowed only if fromStatusID is the same
  //     const sequenceGroups = new Map<number, WFDocumentWFDetail[]>();

  //     for (const step of sortedSteps) {
  //       const seq = step.sequence;
  //       if (!sequenceGroups.has(seq)) {
  //         sequenceGroups.set(seq, []);
  //       }
  //       sequenceGroups.get(seq)?.push(step);
  //     }

  //     for (const [seq, group] of sequenceGroups.entries()) {
  //       const fromStatusIDs = group.map(s => s.fromStatusID);
  //       const uniqueFromStatusIDs = new Set(fromStatusIDs);

  //       if (uniqueFromStatusIDs.size > 1) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  prepareUserList(data) {
    try {
      let list = [];
      data.forEach((element) => {
        if (element.empID) {
          list.push({
            id: element.userPKID,
            name: element.employeeName.trim() + " - " + element.empID,
          });
        }
      });
      return list;
    } catch (e) {
      throw e;
    }
  }

  getActorValidity(){
    try {
      return true;
    } catch (e) {
     throw e;
    }
  }
}
