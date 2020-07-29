import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  public email: string;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // this.resetPasswordLinkFetched();
  }

  public checkFormValidation = () => {
    if (!this.email) {
      this.toastr.warning("Email is missing");
    } else {
      return;
    }
  }; //end of checkFormValidation

  public forgotPasswordFunction() {
    this.checkFormValidation();
    let data = {
      email: this.email,
    };
    // console.log("data", data);
    this.appService.forgotPasswordFunction(data).subscribe(
      (apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.router.navigate(["/"]);
        } else {
          this.toastr.error(apiResponse.message);
          this.router.navigate(["/"]);
        }
      },
      (err) => {
        this.toastr.error("Some error occured");
      }
    );
  }
}
