import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService, Config } from "src/app/shared";

@Injectable()
export class StatusSetupDataService {
  controllerName = Config.url.adminLocalUrl + "StatusSetup";
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

  GetStatusCategoryList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetStatusCategory", {})
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  GetStatusList(spData: any) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetStatusSetup", {
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
}
