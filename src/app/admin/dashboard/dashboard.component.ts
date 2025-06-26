import { Component, OnInit } from "@angular/core";
import { GlobalConstants } from "src/app/app-shared";
import { MenuService } from "src/app/shared/services/menu.service";
import { DashboardNotificationComponent } from "../dashboard-notification/dashboard-notification.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styles: [],
  standalone: true,
  imports: [DashboardNotificationComponent],
})
export class DashboardComponent implements OnInit {
  constructor(public menuService: MenuService) {
    this.menuService.pageTitle = "Dashboard";
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.menuService.pageMenuItems = this.menuService.menuList.filter(
        (f) => !f.parentID
      );
    }, 1000);
  }
}
