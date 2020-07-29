import { Component, OnInit, SimpleChange } from "@angular/core";
import { AppService } from "src/app/app.service";
import { SocketService } from "src/app/socket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: "app-create-meeting",
  templateUrl: "./create-meeting.component.html",
  styleUrls: ["./create-meeting.component.css"],
  providers: [Location]
})
export class CreateMeetingComponent implements OnInit {
  public id = this._route.snapshot.paramMap.get("id");

  public name: any = "Admin dashboard";
  public purpose: string;
  public createdBy: string;
  public startDate: string;
  public endDate: string;
  public location: string;
  public admin_name: string;
  userId: string;
  userObject: string;
  localStorage: any;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    public location1: Location,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.localStorage = this.appService.getUserInfoFromLocalStorage();
    this.admin_name = this.localStorage.userName;
    this.userId = this._route.snapshot.paramMap.get("id");
    // console.log(this.userId);
    this.createdBy = this.localStorage._id;
    this.getSingleUser(this.userId);
  }
  disabledDay(date) {
    if (
      date.getMonth() == new Date().getMonth() &&
      date.getFullYear() == new Date().getFullYear()
    ) {
      return date.getDate() < new Date().getDate();
    }
  }

  getSingleUser(userId) {
    // console.log("getSingleusercalled", userId);
    this.appService.getSingleUser(userId).subscribe(data => {
      // console.log(data);
      this.userObject = data.data._id;
      // console.log("this.userObject", data.data._id);
    });
  }

  public goBack() {
    this.location1.back();
  }

  createMeeting() {
    let data = {
      purpose: this.purpose,
      location: this.location,
      startDate: this.startDate,
      endDate: this.endDate,
      createdBy: this.createdBy,
      userId: this.userId,
      userDetails: this.userObject
    };
    console.log(data);
    // this.appService.showLoadingSpinner();
    this.spinner.show();
    this.appService.createMeeting(data, this.userId).subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status == 201) {
          const message = `A new meeting on ${apiResponse.data.purpose} is created by ${this.admin_name}`;
          let messageObj = {
            userId: data.userId,
            message: message
          };
          this.socketService.informServer(messageObj);
          this.toastr.success(apiResponse.message);
          // this.appService.hideLoadingSpinner();
          this.spinner.hide();
          this.router.navigate(["admin/user/", this.userId]);
        } else {
          // this.appService.hideLoadingSpinner();
          this.spinner.hide();
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.error("Some error occured");
      }
    );
  }
}
