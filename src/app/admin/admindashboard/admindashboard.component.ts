import { Component, OnInit, SimpleChange } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-admindashboard",
  templateUrl: "./admindashboard.component.html",
  styleUrls: ["./admindashboard.component.css"]
  // providers: [SocketService]
})
export class AdmindashboardComponent implements OnInit {
  public name: any = "Admin dashboard";
  public localStorage: any = "";
  public users = "";
  public onlineUsers = [];
  public dupUsers = [];
  // userList: any[];
  // offLineUserList: any[];
  public authToken: string;
  public userId: string;
  public online: boolean = false;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.localStorage = this.appService.getUserInfoFromLocalStorage();
    this.userId = this.localStorage.userId;
    this.authToken = this.appService.getAuthToken();
    // this.checkStatus();
    this.getNormalUsers();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
  }

  public checkStatus: any = () => {
    if (
      this.localStorage === undefined ||
      this.localStorage === "" ||
      this.localStorage === null
    ) {
      this.router.navigate(["/"]);
      return false;
    } else {
      return true;
    }
  }; //end checkStatus

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(data => {
      // console.log("verifyUserConfirmation", data);
      this.socketService.setUser(this.authToken);
      // console.log("data got after user comes online", data);
    });
  };

  public getOnlineUserList: any = () => {
    this.socketService.onlineUsersList().subscribe(userList => {
      // console.log("getOnlineUserList", userList);
      this.onlineUsers = [...userList];
      console.log("online", this.onlineUsers);
    });
  };

  public logout: any = (name: any) => {
    this.toastr.success(`${name}`);
  };

  public getNormalUsers: any = () => {
    this.spinner.show();
    this.appService.getAllUsers().subscribe(
      apiResponse => {
        // console.log(apiResponse);
        if (apiResponse.status == 200) {
          this.spinner.hide();
          // console.log(apiResponse.data);
          this.users = apiResponse.data;
          // console.log(this.users);
        }else{
          console.log(apiResponse)
          this.spinner.hide();
        }
      },
      err => {
        console.log(err.error);
        this.toastr.error("some error occured");
      }
    );
  };

  toggleAccordian(event, index) {
    var element = event.target;
    element.classList.toggle("active");
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}
