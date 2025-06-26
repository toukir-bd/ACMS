import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import { ApiService, Config } from "src/app/shared";
@Injectable()
export class WorkFlowPolicySetupDataService {
  controllerName = Config.url.adminLocalUrl + "PolicySetup";
  constructor(private apiSvc: ApiService) {}

  DeleteLanguage(id: number): Observable<any> {
    return this.apiSvc
      .executeQuery(`${this.controllerName}/Delete`, {
        id: id,
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  SaveStatus(entity: any): Observable<any> {
    return this.apiSvc.save(`${this.controllerName}/Save`, entity, true);
  }

  GetWorkFlowPolicyList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWorkFlowPolicy", {})
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  GetStatusList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetStatusSetup", {})
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  GetWorkFlowList(spData: any) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWorkFlowList", {
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
  GetEventList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetEventSetup", {})
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
}
