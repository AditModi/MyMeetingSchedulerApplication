import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { AppService } from "../../app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"]
})
export class SidenavComponent implements OnInit {
  @Input() normalUserId: string;
  @Input() avatar: string;
  @Input() username: string;
  @Input() adminUserId: string;

  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();

  role: any;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    // console.log("normalUserId", this.normalUserId);
    // console.log("admin user id", this.adminUserId);
    let x = this.appService.getUserInfoFromLocalStorage();
    this.role = x.userRole;
  }

  goToAdminDashboard() {
    this.router.navigate(["/admindashboard"]);
  }
  goToUserDashboard() {
    this.router.navigate([
      `/userdashboard/${this._route.snapshot.paramMap.get("id")}`
    ]);
  }

  public logout: any = () => {
    // Cookie.deleteAll();
    // this.router.navigate(["/"]);
    if (this.adminUserId) {
      console.log(this.adminUserId);
      this.appService.logout(this.adminUserId).subscribe(
        apiResponse => {
          console.log("apiResponse", apiResponse);
          this.notify.emit(apiResponse.message);
          console.log("logout sucessfull");
          if (apiResponse.status == 200) {
            // Cookie.delete("authToken");
            // Cookie.delete("receiverId");
            // Cookie.delete("receiverName");
            this.appService.removeUserInfoFromLocalStorage();
            this.appService.removeAuthTokenFromLocalStorage();
            this.socketService.disconnectedSocket();
            // this.appService.removeUserInfoFromLocalStorage();
            // this.appService.removeAuthTokenFromLocalStorage();
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
    } else {
      console.log(this.normalUserId);
      this.appService.logout(this.normalUserId).subscribe(
        apiResponse => {
          console.log("apiResponse", apiResponse);
          this.notify.emit(apiResponse.message);
          console.log("logout sucessfull");
          if (apiResponse.status == 200) {
            // Cookie.delete("authToken");
            // Cookie.delete("receiverId");
            // Cookie.delete("receiverName");
            this.appService.removeUserInfoFromLocalStorage();
            this.appService.removeAuthTokenFromLocalStorage();
            this.socketService.disconnectedSocket();
            // this.appService.removeUserInfoFromLocalStorage();
            // this.appService.removeAuthTokenFromLocalStorage();
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
    }
  };
}
