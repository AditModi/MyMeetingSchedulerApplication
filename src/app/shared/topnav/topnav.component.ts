import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { AppService } from "../../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-topnav",
  templateUrl: "./topnav.component.html",
  styleUrls: ["./topnav.component.css"]
  // providers: [SocketService]
})
export class TopnavComponent implements OnInit {
  @Input() dashboardName: string;
  @Input() User: string;
  public name: any = "";
  constructor(
    public appService: AppService,
    private router: Router,
    public socketService: SocketService
  ) {}

  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit() {
    this.name = this.dashboardName;
  }

  public logout: any = () => {
    this.appService.logout(this.User).subscribe(
      apiResponse => {
        console.log("apiResponse", apiResponse);
        this.notify.emit(apiResponse.message);
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
  };
}
