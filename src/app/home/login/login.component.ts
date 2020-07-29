import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
//toaster
import { ToastrService } from "ngx-toastr";
//import service
import { AppService } from "../../app.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  public checkFormValidation = () => {
    if (!this.email) {
      this.toastr.warning("Email is missing");
    } else if (!this.password) {
      this.toastr.warning("Password is missing");
    } else {
      return;
    }
  }; //end of checkFormValidation

  public loginFunction = () => {
    document.querySelector(".loginBtn").textContent = "Logging....";
    this.checkFormValidation();
    let data = {
      email: this.email,
      password: this.password
    };
    // console.log("data", data);
    this.appService.loginFunction(data).subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status == 200) {
          if (apiResponse.data.userDetails.userRole == "admin") {
            this.router.navigate(["/admindashboard"]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          } else {
            this.router.navigate([
              `/userdashboard/${apiResponse.data.userDetails.userId}`
            ]);
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );
            this.appService.setAuthToken(apiResponse.data.authToken);
            this.toastr.success(apiResponse.message);
          }
        } else {
          console.log(apiResponse);
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        document.querySelector(".loginBtn").textContent = "Login";
        this.toastr.error(err.error.message);
      }
    );
  };
}
