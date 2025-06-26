import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import { ApiService, Config } from "src/app/shared";

@Injectable()
export class WorkFlowSetupListDataService {
  controllerName = Config.url.adminLocalUrl + "WorkFlowSetup";
  constructor(private apiSvc: ApiService) {}

  DeleteWorkFlowSetup(id: number): Observable<any> {
    return this.apiSvc
      .executeQuery(`${this.controllerName}/DeleteWorkFlowSetup`, {
        id: id,
      })
      .pipe(
        map((response: any) => {
          return response;
        })
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
  GetWorkFlowSetupList(spData: any) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWorkFlowSetupList", {
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
}
