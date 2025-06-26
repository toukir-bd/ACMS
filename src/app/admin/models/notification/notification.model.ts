export class NotificationModel {
  notificationType: string = null;
  eventDate: Date = null;
  eventTime: string = null;
  description: string = null;
  status: string = null;
  refNo: string = null;
  lastUser: string = null;
  comments?: string = null;
  documentID: number = 0;
  transactionID: number = 0;
  pageTitle: string = null;
  transactionCode: string = null;
  creator: string = null;
  statusName: string = null;
  colorCode?: string = null;
  constructor(defaultData?: Partial<NotificationModel>) {
    defaultData = defaultData || {};
    Object.keys(defaultData).forEach((key) => {
      const value = defaultData[key];
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    });
  }
}
