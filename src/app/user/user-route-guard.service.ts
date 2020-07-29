import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AppService } from "../app.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class UserRouteGuardService {
  constructor(
    private router: Router,
    public appService: AppService,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authToken = this.appService.getAuthToken();
    // console.log("in guard service", authToken, route.data);
    if (authToken === undefined || authToken === "" || authToken === null) {
      this.router.navigate(["/"]);
      return false;
    } else {
      return true;
    }
  }
}
