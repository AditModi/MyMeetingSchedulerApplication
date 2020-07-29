import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  public isLink: boolean = false;
  public password: string;
  public confirmPassword: string;
  public userId: string;
  public token: string;

  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    let id = this._route.snapshot.paramMap.get("id");
    let token = this._route.snapshot.paramMap.get("token");
    // console.log("id", id);
    // console.log("token", token);
    this.appService.verifyPasswordResetLink(id, token).subscribe(
      (apiResponse) => {
        this.isLink = true;
        // console.log(apiResponse);
        // console.log(apiResponse.data.token);
        // console.log(apiResponse.data.userId);
        this.token = apiResponse.data.token;
        this.userId = apiResponse.data.userId;
      },
      (err) => {
        console.log(err);
        console.log("Link expired");
        this.toastr.error("Link expired");
      }
    );
  }

  public updatePasswordFunction = () => {
    let data = {
      userId: this.userId,
      token: this.token,
      password: this.password,
    };
    this.appService.updatePassword(data).subscribe(
      (apiResponse) => {
        console.log("Data posted");
        console.log(apiResponse);
        this.toastr.success(apiResponse.message);
        this.router.navigate(["/"]);
      },
      (err) => {
        console.log(err);
        this.router.navigate(["/"]);
      }
    );
  };
}
