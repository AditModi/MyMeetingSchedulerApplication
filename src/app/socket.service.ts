import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { of } from "rxjs";
import { Observable, Subscriber } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { stringify } from "querystring";
import { tap, map, filter } from "rxjs/operators";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket;

  private authToken;
  constructor(private _http: HttpClient) {
    //connection is being created
    //that handshake
    // this.socket = io("http://localhost:3000");
    this.socket = io("https://apimeetup.naikvaibhav.online");
    this.authToken = JSON.parse(localStorage.getItem("authToken"));
  }

  public verifyUser = () => {
    console.log("verifyUser called");
    return Observable.create((observer) => {
      this.socket.on("verifyUser", (data) => {
        console.log("verifyUser is catched", data);
        observer.next(data);
      });
    });
  };

  //events to be emitted
  public setUser = (token) => {
    // const token = JSON.parse(localStorage.getItem("authToken"));
    console.log("setUser");
    console.log("set-user is emitted");
    this.socket.emit("set-user", token);
  }; //end setUser

  public onlineUsersList = () => {
    return Observable.create((observer) => {
      this.socket.on("online-user-list", (userList) => {
        // console.log("online-user-list catched");
        // console.log("userlist", userList);
        observer.next(userList);
      });
    });
  };

  public exitSocket = () => {
    this.socket.disconnect();
  };

  public informServer = (data) => {
    // console.log("informServer is emitted");
    this.socket.emit("inform-server", data);
  };

  public informUser = (userId) => {
    // console.log("MyIO emit is being catched", userId);
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); //end Socket
    }); //end Observable
  };

  public meetingNotification = (userId) => {
    // console.log("MyIO emit is being catched", userId);
    // this.socket.removeAllListeners(userId);
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); //end Socket
    }); //end Observable
  }; //end of meetingNotification

  public disconnectedSocket = () => {
    console.log("disconnected socket called");
    return Observable.create((observer) => {
      this.socket.emit("disconnect", () => {
        // console.log("disconnected is catched");
        // console.log("disconnect called");
        observer.next();
      });
    });
  };

  //exception handler
  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
