import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import { ApiService, Config } from "src/app/shared";

@Injectable()
export class EventSetupDataService {
  controllerName = Config.url.adminLocalUrl + "EventSetup";
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

  SaveEvent(entity: any): Observable<any> {
    return this.apiSvc.save(`${this.controllerName}/Save`, entity, true);
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
