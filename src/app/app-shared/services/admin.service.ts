import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Config, GlobalConstants } from "../index";
import { QueryData } from "src/app/shared/models/common.model";
import { ApiService } from "src/app/shared/services/api.service";
import { Observable } from "rxjs";
import { WFDocumentTransaction } from "../models/common/app-shared-common.model";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  spData: any = new QueryData();
  controllerName = Config.url.adminLocalUrl + "Admin";
  constructor(private apiSvc: ApiService) {
    this.spData.pageNo = 0;
  }

  // getLanguageList() {
  //   return this.apiSvc
  //     .get(`${this.controllerName}/GetLanguageList/`)
  //     .pipe(
  //       map((response: any) => {
  //       return response.body;
  //       })
  //     );
  // }

  getLanguageList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetLanguageList", {
        data: JSON.stringify(this.spData),
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  UpdateUserLanguageByUserID(lgCode: string, userID: number) {
    var obj = {
      data: JSON.stringify(this.spData),
      lgCode: lgCode,
      userID: userID,
    };
    return this.apiSvc
      .executeQuery(`${this.controllerName}/UpdateUserLanguageByUserID`, obj)
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  UpdateLanguageDefaultByCode(lgCode: string) {
    var obj = {
      data: JSON.stringify(this.spData),
      lgCode: lgCode,
    };
    return this.apiSvc
      .executeQuery(`${this.controllerName}/UpdateLanguageDefaultByCode`, obj)
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getEcomMenus(locationID: number, userId: number) {
    var obj = {
      data: JSON.stringify(this.spData),
      locationID: locationID,
      userId: userId,
    };
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetEComMenus`, obj)
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
  getModuleWiseMenus(locationID: number, userId: number, moduleName: string) {
    var obj = {
      data: JSON.stringify(this.spData),
      locationID: locationID,
      userId: userId,
      moduleName: moduleName,
    };
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetModuleWiseMenus`, obj)
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getModuleWisePageConfig(module: string, pageCd: number): Observable<any> {
    let spData = new QueryData({ pageNo: 0 });
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetModuleWisePageConfig`, {
        module: module,
        pageCd: pageCd,
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1];
        })
      );
  }

  getOrderTypeByOrderCategoryCd(orderCategoryCd): Observable<any> {
    let spData = new QueryData({ pageNo: 0 });
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetOrderTypeByOrderCategoryCd`, {
        orderCategoryCd: orderCategoryCd,
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  getDutyConfig() {
    return this.apiSvc.get(this.controllerName + "/GetDutyConfig").pipe(
      map((res: any) => {
        return res.body;
      })
    );
  }

  getBaseCurrency() {
    return this.apiSvc.get(this.controllerName + "/GetBaseCurrency").pipe(
      map((res: any) => {
        return res.body;
      })
    );
  }

  getDutyProperties() {
    return this.apiSvc.get(this.controllerName + "/GetDutyProperties").pipe(
      map((res: any) => {
        return res.body;
      })
    );
  }

  getGoogleApiKey() {
    let spData = new QueryData({ pageNo: 0 });
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetGoogleApiKey`, {
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1][0] || [];
        })
      );
  }
  getUserMultipleORGsUsers(orgIds: string): Observable<any> {
    let spData = new QueryData({ pageNo: 0 });
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetUserMultipleORGsUsers`, {
        orgIds: orgIds,
        data: JSON.stringify(spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }
  getFileHyperLink(ids: string, folderName: string) {
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetFileHyperLink`, {
        ids: ids,
        folderName: folderName,
      })
      .pipe(
        map((response: any) => {
          return response.body || [];
        })
      );
  }

  getReportLayoutName(reportCode: number) {
    let spData = new QueryData({ pageNo: 0 });
    return this.apiSvc
      .executeQuery(`${this.controllerName}/GetReportLayoutName`, {
        data: JSON.stringify(spData),
        reportCode: reportCode,
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }

  getBizConfigInfo() {
    return this.apiSvc.get(this.controllerName + "/GetBizConfigInfo").pipe(
      map((res: any) => {
        return res.body;
      })
    );
  }

  getActionMenuList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetActionMenuList", {
        data: JSON.stringify(this.spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }
  GetNotificationList(spData: any, userId?: number) {
    debugger;
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetNotificationList", {
        data: JSON.stringify(spData),
        userId: userId,
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  
  getWFDocumentWFSchema(documentID?:number, transactionID?:number, orgID?:number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFDocumentWFSchemaByUserID", {
        data: JSON.stringify(this.spData),
        userID: GlobalConstants.userInfo.userPKID,
        documentID: documentID == null ? '' : documentID,
        transactionID: transactionID == null ? '' : transactionID,
        orgID: orgID == null ? '' : orgID
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }
  getWFDocTransactionByUserID() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFDocTransactionByUserID", {
        data: JSON.stringify(this.spData),
        userID: GlobalConstants.userInfo.userPKID,
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }

  getWFDocumentTransaction(documentID:number, transactionID:number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetWFDocumentTransaction", {
        data: JSON.stringify(this.spData),
        documentID: documentID,
        transactionID: transactionID
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }

  saveSamplePage(entity): Observable<any> {
    return this.apiSvc.save(
      `${this.controllerName}/SaveSamplePage`,
      entity,
      true
    );
  }
  getSampleList() {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetSampleList", {
        data: JSON.stringify(this.spData),
      })
      .pipe(
        map((response: any) => {
          return response.body[response.body.length - 1] || [];
        })
      );
  }

  deleteSampleByIDs(ids: string) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/DeleteSampleByIDs", {
        ids: ids,
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  deleteSampleByID(id: number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/DeleteSampleByID", {
        id: id,
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }

  


  saveDocTransaction(
    documentWFDetailID: number,
    transactionID: number,
    transactionCode?: string,
    comment?: string
  ): Observable<any> {
    try {
      let docTransaction = new WFDocumentTransaction();
      docTransaction.transactionID = transactionID;
      docTransaction.transactionCode = transactionCode;
      docTransaction.documentWFDetailID = documentWFDetailID;
      docTransaction.comment = comment;
      return this.apiSvc.save( `${this.controllerName}/SaveDocumentTransation`, docTransaction,true);
    } catch (e) {
      throw e;
    }
  }
  getSampleByID(id: number) {
    return this.apiSvc
      .executeQuery(this.controllerName + "/GetSampleByID", {
        id: id,
      })
      .pipe(
        map((response: any) => {
          return response.body;
        })
      );
  }
}

interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
}
