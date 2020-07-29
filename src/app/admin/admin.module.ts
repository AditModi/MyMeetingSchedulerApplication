import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdmindashboardComponent } from "./admindashboard/admindashboard.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { UserdataComponent } from "./userdata/userdata.component";

import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { CreateMeetingComponent } from "./create-meeting/create-meeting.component";
import { EditMeetingComponent } from "./edit-meeting/edit-meeting.component";
import { AdminRouteGuardService } from "./admin-route-guard.service";

import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AdmindashboardComponent,
    UserdataComponent,
    CreateMeetingComponent,
    EditMeetingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgxSpinnerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild([
      {
        path: "admindashboard",
        component: AdmindashboardComponent,
        // data: { animation: "isAdminDashboard" },
        canActivate: [AdminRouteGuardService]
      },
      {
        path: "admin/user/:id",
        component: UserdataComponent,
        canActivate: [AdminRouteGuardService]
      },
      {
        path: "admin/user/create/:id",
        component: CreateMeetingComponent,
        canActivate: [AdminRouteGuardService]
      },
      {
        path: "admin/user/:id/meeting/:meetid",
        component: EditMeetingComponent,
        canActivate: [AdminRouteGuardService]
      }
    ]),
    SharedModule
  ],
  providers: [AdminRouteGuardService]
})
export class AdminModule {}
