import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  TemplateRef
} from "@angular/core";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import { parseISO, format } from "date-fns";
import { Subject } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from "angular-calendar";
import { SocketService } from "src/app/socket.service";
import { NgxSpinnerService } from "ngx-spinner";

// const colors: any = {
//   red: {
//     primary: "#ad2121",
//     secondary: "#FAE3E3"
//   },
//   blue: {
//     primary: "#1e90ff",
//     secondary: "#D1E8FF"
//   },
//   yellow: {
//     primary: "#e3bc08",
//     secondary: "#FDF1BA"
//   }
//};

interface MyEvent extends CalendarEvent {
  meetingId: string;
  location: string;
  createdBy: string;
  userId: string;
}

@Component({
  selector: "app-userdata",
  templateUrl: "./userdata.component.html",
  styleUrls: ["./userdata.component.css"]
})
export class UserdataComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  @ViewChild("confirmForDelete", { static: true })
  confirmForDelete: TemplateRef<any>;
  modalReference: NgbModalRef;
  public wizardRef: TemplateRef<any>;
  public name: any = "Admin dashboard";
  public startDate: any;
  public endDate: any = "";
  meetingDetails: any = "";
  data: any = "";
  public obj: any = "";
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  eventTimesChanged:any;
  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  // };
  modalData : any;
  refresh: Subject<any> = new Subject();
  events: MyEvent[] = [];
  activeDayIsOpen: boolean = false;

  public showTemplate: boolean = true;
  public userId = this._route.snapshot.paramMap.get("id");

  public meetingToDelete: string;
  localStorage: any;
  public currentUser: string = "";
  public admin_name: string;
  purpose: string;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.localStorage = this.appService.getUserInfoFromLocalStorage();
    this.admin_name = this.localStorage.userName;

    this.getAllMeetings();
    if (this.userId == "undefined") {
      this.toastr.error("Please select a user to view the planner");
      this.showTemplate = false;
      setTimeout(() => {
        this.router.navigate(["/admindashboard"]);
      }, 2000);
    }
    // console.log(this.currentUser);
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent("Edited", event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Deleted", event);
        // this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        this.view = CalendarView.Day;
      } else {
        this.view = CalendarView.Day;
        this.toastr.info(`View changed to: ${this.view}`);
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.purpose = event["title"];
    if (action == "Clicked") {
      this.modalData = event;
      this.modalReference = this.modal.open(this.modalContent, {
        centered: true
      });
    } else if (action == "Edited") {
      this.modalData = event;
      let id = this._route.snapshot.paramMap.get("id");
      this.router.navigate([
        `admin/user/${id}/meeting/${this.modalData["meetingId"]}`
      ]);
    } else {
      this.meetingToDelete = event["meetingId"];
      this.modalReference = this.modal.open(this.confirmForDelete, {
        centered: true
      });
    }
  }

  public editMeet(e) {
    this.modalReference.close();
    let id = this._route.snapshot.paramMap.get("id");
    this.router.navigate([`admin/user/${id}/meeting/${e}`]);
  }
  public deleteMeet(e) {
    this.modalReference.close();
    this.meetingToDelete = e;
    this.modalReference = this.modal.open(this.confirmForDelete, {
      centered: true
    });
  }

  public deleteEvent(e) {
    if (e.target.childNodes[0].data) {
      this.deleteMeeting(this.meetingToDelete);
    }
  }

  public deleteMeeting = meetingId => {
    this.appService.deleteMeeting(this.userId, meetingId).subscribe(
      apiResponse => {
        this.modalReference.close();
        this.toastr.success(apiResponse.message);
        const message = `A meeting on ${this.purpose} is deleted by ${this.admin_name}`;
        let messageObj = {
          userId: this.userId,
          message: message
        };
        this.socketService.informServer(messageObj);
        this.events = this.events.filter(
          iEvent => iEvent.meetingId !== meetingId
        );
        //Go back to the route by using skip location method
        this.router
          .navigateByUrl("/admindashboard", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([`/admin/user/${this.userId}`]);
            this.view = CalendarView.Day;
          });
      },
      err => {
        console.log(err);
      }
    );
  };

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public createMeeting = () => {
    let id = this._route.snapshot.paramMap.get("id");
    console.log("create meeting called", id);
    this.router.navigate(["admin/user/create/", id]);
  };

  public currentSelectedUser = () => {
    let id = this._route.snapshot.paramMap.get("id");
    this.appService.getSingleUser(id).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.currentUser = apiResponse.data.firstName;
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        console.log(err.message);
      }
    );
  };

  public getAllMeetings() {
    this.spinner.show();
    this.appService.getAllMeetings(this.userId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.spinner.hide();
          apiResponse.data.map(meeting => {
            this.events.push({
              start: addHours(subDays(parseISO(meeting.startDate), 0), 0),
              end: addHours(parseISO(meeting.endDate), 0),
              title: meeting.purpose,
              color: meeting.color,
              actions: this.actions,
              location: meeting.location,
              meetingId: meeting.meetingId,
              createdBy: meeting.createdBy,
              userId: meeting.userId
            });
            this.refresh.next();
          });
        } else if (apiResponse.status == 204) {
          this.spinner.hide();
          // this.toastr.info(apiResponse.message);
          console.log(apiResponse.message);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        console.log(err.message);
      }
    );
    this.currentSelectedUser();
  }

  public logout: any = (name: any) => {
    this.toastr.success(`${name}`);
  };
}
