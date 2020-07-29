import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  TemplateRef,
} from "@angular/core";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";

import { ImageUploadService } from "src/app/image-upload.service";

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
import { Subject } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from "angular-calendar";
import { parseISO, format } from "date-fns";

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
// };

interface MyEvent extends CalendarEvent {
  meetingId: string;
  location: string;
  createdBy: string;
  userId: string;
}

@Component({
  selector: "app-userdashboard",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./userdashboard.component.html",
  styleUrls: ["./userdashboard.component.css"]
  // providers: [SocketService]
})
export class UserdashboardComponent implements OnInit {
  public name: any = "User dashboard";
  public localStorage: any = "";
  public authToken: string;
  eventTimesChanged:any

  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  @ViewChild("confirmTemplate", { static: true }) confirmTemplate: TemplateRef<
    any
  >;
  @ViewChild("reminderModal", { static: true }) reminderModal: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  modalData1 : any;
  modalData2 = "";

  refresh: Subject<any> = new Subject();
  events: MyEvent[] = [];
  modalReference: NgbModalRef;

  activeDayIsOpen: boolean = false;

  public userId = this._route.snapshot.paramMap.get("id");

  imageObj: File;
  imageUrl: string;

  public imagePath;
  imgURL: any = "";
  public message: string;
  url: string | ArrayBuffer;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit() {
    this.localStorage = this.appService.getUserInfoFromLocalStorage();
    this.authToken = this.appService.getAuthToken();
    this.checkStatus();
    this.getAllMeetings();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAdmin();
  }

  public checkStatus: any = () => {
    if (this._route.snapshot.paramMap.get("id") == this.localStorage.userId) {
      this.router.navigate([
        `/userdashboard/${this._route.snapshot.paramMap.get("id")}`
      ]);
      return true;
    } else {
      this.appService.logout(this.localStorage.userId).subscribe(
        apiResponse => {
          // console.log("apiResponse", apiResponse);
          this.toastr.success(
            "You are logged out as you tried to access invalid user id"
          );
          console.log("logout sucessfull");
          if (apiResponse.status == 200) {
            this.appService.removeUserInfoFromLocalStorage();
            this.appService.removeAuthTokenFromLocalStorage();
            this.socketService.disconnectedSocket();
            console.log("disconnected socket from socket service is called");

            this.router.navigate(["/"]);
          } else {
            console.log(apiResponse.message);
          }
        },
        err => {
          console.log(err.error);
          console.log("some error occured");
        }
      );
      return false;
    }
  }; //end checkStatus

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(data => {
      // console.log("verifyUserConfirmation", data);
      this.socketService.setUser(this.authToken);
    });
  };

  public getOnlineUserList: any = () => {
    this.socketService.onlineUsersList().subscribe(userList => {
      // console.log("getOnlineUserList", userList);
    });
  };

  protected getMessageFromAdmin: any = () => {
    this.socketService.meetingNotification(this.userId).subscribe(data => {
      // console.log(data.userId);
      if (data.userId === this.userId) {
        // console.log(
        //   "data.userId",
        //   data.userId,
        //   "this.userId",
        //   this.userId,
        //   data.message
        // );
        if (data.isReminder) {
          this.modalData2 = data.message;
          this.modalReference = this.modal.open(this.reminderModal, {
            centered: true
          });
          this.playAudio();
        } else
          this.toastr.info(data.message, null, {
            disableTimeOut: true,
            tapToDismiss: true,
            closeButton: true
          });
      }
    }); //end of subscribe
  }; //end get message from a user

  callTheReminderAgain() {
    this.modalReference.close();
    // console.log("showAgain called");

    setTimeout(() => {
      this.modalReference = this.modal.open(this.reminderModal, {
        centered: true
      });
      this.playAudio();
    }, 5000);
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/alert-sound.mp3";
    audio.load();
    audio.play();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // console.log("day clicked");
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.view = CalendarView.Day;
      } else {
        this.view = CalendarView.Day;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData1 = event;
    this.modal.open(this.modalContent, { centered: true });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public getAllMeetings() {
    this.appService.getAllMeetings(this.userId).subscribe(apiResponse => {
      apiResponse.data.map(meeting => {
        this.events.push({
          start: addHours(subDays(parseISO(meeting.startDate), 0), 0),
          end: addHours(parseISO(meeting.endDate), 0),
          title: meeting.purpose,
          color: meeting.color,
          location: meeting.location,
          meetingId: meeting.meetingId,
          createdBy: meeting.createdBy,
          userId: meeting.userId
        });
        this.refresh.next();
      });
    });
  }

  public logout: any = (name: any) => {
    this.toastr.success(`${name}`);
  };
}
