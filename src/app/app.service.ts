import { Injectable } from "@angular/core";
//http client
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, Subscriber } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { stringify } from "querystring";
import { tap, map, filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AppService {
  // private url = "http://localhost:3000/api/v1";
  private url = "https://apimeetup.naikvaibhav.online/api/v1";

  public showSpinner: boolean = false;

  showLoadingSpinner() {
    this.showSpinner = true;
  }

  hideLoadingSpinner() {
    this.showSpinner = false;
  }

  hideSideNav: boolean = false;
  constructor(private _http: HttpClient) {}

  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }

  //user related services
  public signUpFunction(data): Observable<any> {
    // console.log(data);
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("email", data.email)
      .set("mobileNumber", data.mobileNumber)
      .set("password", data.password)
      .set("userRole", data.userRole)
      .set("userName", data.userName)
      .set("countryCode", data.countryCode)
      .set("countryName", data.countryName)
      .set("internationalCode", data.internationalCode)
      .set("avatar", data.avatar);
    // console.log(params);
    return this._http.post(`${this.url}/users/signup`, params);
  }

  public loginFunction(data): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);
    // console.log("params", params);
    return this._http.post(`${this.url}/users/login`, params);
  }

  public forgotPasswordFunction(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);
    // console.log("params", params);
    return this._http.post(`${this.url}/users/forgotPassword`, params);
  }

  public verifyPasswordResetLink(id, token): Observable<any> {
    // console.log(id, token);
    return this._http.get(`${this.url}/users/resetPassword/${id}/${token}`);
  }

  public updatePassword(data): Observable<any> {
    // console.log(data);
    return this._http.post(`${this.url}/users/updatePassword`, data);
  }

  public getAllUsers(): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.get(`${this.url}/users`, { headers: headers }).pipe(
      tap((data) => {}),
      catchError(this.handleError)
    );
  }

  public getSingleUser(userId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    // console.log(userId);
    return this._http
      .get(`${this.url}/users/${userId}`, { headers: headers })
      .pipe(
        tap((data) => {}),
        catchError(this.handleError)
      );
  }

  public setUserInfoInLocalStorage = (data): any => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  };
  public getUserInfoFromLocalStorage = (): any => {
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  public setAuthToken = (data): any => {
    localStorage.setItem("authToken", JSON.stringify(data));
  };
  public getAuthToken = (): any => {
    return JSON.parse(localStorage.getItem("authToken"));
  };

  public removeUserInfoFromLocalStorage = (): any => {
    localStorage.removeItem("userInfo");
  };

  public removeAuthTokenFromLocalStorage = (): any => {
    localStorage.removeItem("authToken");
  };

  public logout(userId): Observable<any> {
    // console.log(userId);
    const params = new HttpParams().set("userId", userId);
    // console.log("params", params);
    // let authToken = this.getAuthToken();
    // const params = new HttpParams().set("authToken", authToken);
    return this._http.post(`${this.url}/users/logout`, params);
  }

  //meeting related services
  public createMeeting(data, userId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    console.log(data);
    const params = new HttpParams()
      .set("purpose", data.purpose)
      .set("location", data.location)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate)
      .set("createdBy", data.createdBy)
      .set("userId", data.userId)
      .set("userDetails", data.userDetails);
    console.log(params);
    return this._http.post(`${this.url}/meetings/create/${userId}`, params, {
      headers: headers,
    });
  }

  public getAllMeetings(userId): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/meetings/user/${userId}`, {
        headers: headers,
      })
      .pipe(
        tap((data) => {}),
        catchError(this.handleError)
      );
  }

  public getAMeetingDetail(meetid): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http
      .get(`${this.url}/meetings/meeting/${meetid}`, {
        headers: headers,
      })
      .pipe(
        tap((data) => {}),
        catchError(this.handleError)
      );
  }

  public deleteMeeting(userid, meetid): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    let data = {};
    return this._http.post(
      `${this.url}/meetings/user/${userid}/meeting/${meetid}`,
      data,
      {
        headers: headers,
      }
    );
  }

  public editMeeting(userid, meetid, options): Observable<any> {
    const headers = new HttpHeaders().set("authToken", this.getAuthToken());
    return this._http.put(
      `${this.url}/meetings/user/${userid}/meeting/${meetid}`,
      options,
      {
        headers: headers,
      }
    );
  }

  //exception handler
  private handleError(err: HttpErrorResponse) {
    console.log("Handle error Http Calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
