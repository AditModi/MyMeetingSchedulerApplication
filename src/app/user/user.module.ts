import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserdashboardComponent } from "./userdashboard/userdashboard.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { UserRouteGuardService } from "./user-route-guard.service";

@NgModule({
  declarations: [UserdashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild([
      {
        path: "userdashboard/:id",
        component: UserdashboardComponent,
        // data: { animation: "isUserDashboard" },

        canActivate: [UserRouteGuardService]
      }
    ]),
    SharedModule
  ],
  providers: [UserRouteGuardService]
})
export class UserModule {}
