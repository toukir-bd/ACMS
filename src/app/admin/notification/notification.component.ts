import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import {
  AdminService,
  BaseComponent,
  ConfigService,
  GlobalConstants,
  GridOption,
  ProviderService,
  QueryData,
  ValidatorDirective,
} from "..";
import { SharedModule } from "src/app/shared/shared.module";
import { MenuService } from "src/app/shared/services/menu.service";
import { DocumentNotificationComponent } from "../document-notification/document-notification.component";
interface Notification {
  eventDate: any;
  eventTime: any;
  creator: any;
  transactionCode: any;
  statusName: string;
  pageTitle: string;
  notificationType: string;
  title: string;
  lastUser: string;
  comment?: string;
  documentID: number;
  transactionID: number;
  colorCode?: string;
}
@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  providers: [AdminService],
  standalone: true,
  imports: [SharedModule, AccordionModule, DocumentNotificationComponent],
})
export class NotificationComponent extends BaseComponent implements OnInit {
  @ViewChild(ValidatorDirective) directive;
  @Output() countChanged = new EventEmitter<number>();
  @Output() closeDrawer = new EventEmitter<void>();

  activePanelIndex: number = 0; // Track the currently open panel
  isDrawerOpen = true;
  openPanels: string[] = ["0", "1", "2", "3", "4", "5"];

  gridOption: GridOption;
  spData: any = new QueryData();
  notificationList: Notification[];
  searchText: string = "";
  groupedNotificationList: any = {};
  tabData: any = {};
  tabKeys: string[] = [];
  menuList: string[] = [];
  notificationTypesMap: { [tabName: string]: string[] } = {};
  processedTabData: {
    [tabName: string]: {
      notificationType: string;
      notifications: any[];
    }[];
  } = {};
  selectedTab: string = "sb1";

  constructor(public providerSvc: ProviderService) {
    super(providerSvc);
  }
  ngOnInit(): void {
    this.tabKeys = ["Self Service", "Reminder", "Recommended"];
  }

  onTabSelect(tabId: string) {
    this.selectedTab = tabId;
  }

  onNotificationCountChange(count: number) {
    this.countChanged.emit(count);
  }

  onCloseDrawer(): void {
    this.closeDrawer.emit();
  }
}
