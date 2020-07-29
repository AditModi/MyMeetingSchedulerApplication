import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/socket.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-edit-meeting",
  templateUrl: "./edit-meeting.component.html",
  styleUrls: ["./edit-meeting.component.css"],
  providers: [Location]
})
export class EditMeetingComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  public name: any = "Admin dashboard";

  public userId = this._route.snapshot.paramMap.get("id");
  public admin: string;

  public editForm = {
    purpose: "",
    location: "",
    startDate: "",
    endDate: "",
    admin_name: ""
  };

  public meetid = this._route.snapshot.paramMap.get("meetid");
  modalReference: NgbModalRef;
  closeResult: string;
  getDismissReason: any;
  localStorage: any;

  disabledDay:any;
  
  constructor(
    public appService: AppService,
    public socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    public location1: Location,
    private modal: NgbModal,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.localStorage = this.appService.getUserInfoFromLocalStorage();
    this.admin = this.localStorage.userName;
    // console.log(this.meetid);
    this.getMeeting();
  }

  public getMeeting = () => {
    this.spinner.show();
    this.appService.getAMeetingDetail(this.meetid).subscribe(
      apiResponse => {
        this.spinner.hide();
        console.log(apiResponse);
        this.editForm.purpose = apiResponse.data.purpose;
        this.editForm.location = apiResponse.data.location;
        this.editForm.startDate = apiResponse.data.startDate;
        this.editForm.endDate = apiResponse.data.endDate;
        this.editForm.admin_name = apiResponse.data.createdBy.userName;
      },
      err => {
        console.log(err);
      }
    );
  };

  public editMeeting = () => {
    this.spinner.show();
    this.appService
      .editMeeting(this.userId, this.meetid, this.editForm)
      .subscribe(
        apiResponse => {
          this.spinner.hide();
          console.log(apiResponse);
          this.toastr.info(apiResponse.message);
          const message = `A meeting on ${this.editForm.purpose} is edited by ${this.admin}`;
          let messageObj = {
            userId: this.userId,
            message: message
          };
          this.socketService.informServer(messageObj);
          this.location1.back();
        },
        err => {
          this.spinner.hide();
          console.log(err);
        }
      );
  };

  public goBack() {
    this.location1.back();
  }

  public deleteMeeting = () => {
    this.appService.deleteMeeting(this.userId, this.meetid).subscribe(
      apiResponse => {
        console.log(apiResponse);
        this.modalReference.close();
        this.location1.back();
      },
      err => {
        console.log(err);
      }
    );
  };

  public openConfirmModal = () => {
    this.modalReference = this.modal.open(this.modalContent, {
      centered: true
    });
  };
}
